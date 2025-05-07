// API base URL - adjust this based on your backend configuration
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost/backend/public' 
    : '/api';

// DOM Elements
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
const loadingOverlay = document.getElementById('loadingOverlay');

// Global Variables
let deleteCommentId = null;
let allComments = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated as admin
    checkAdminAuth();
    
    // Set up event listeners
    document.getElementById('confirmDelete').addEventListener('click', deleteComment);
    document.getElementById('backToBlogs').addEventListener('click', function() {
        window.location.href = './Blog.html';
    });

    // Initialize event listeners
    initializeEventListeners();

    // Load all comments from all posts
    fetchAllComments();
});

// Initialize event listeners
function initializeEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterComments();
        }
    });
}

// Check if user is authenticated as admin
function checkAdminAuth() {
    // Try different token keys that might be used by the system
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
    
    if (!token) {
        console.log('No token found. Redirecting to login page...');
        showAlert('Bạn cần đăng nhập để tiếp tục.', 'warning');
        // Don't immediately redirect, let the user see the error
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 2000);
        return;
    }
    
    try {
        // If jwt_decode function exists, verify token
        if (typeof jwt_decode === 'function') {
            const decodedToken = jwt_decode(token);
            const currentTime = Date.now() / 1000;
    
            // Check if token is expired
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('adminToken');
                showAlert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 2000);
                return;
            }
    
            // Check if user is admin
            if (decodedToken.role && decodedToken.role !== 'admin') {
                showAlert('Bạn không có quyền truy cập trang này.', 'danger');
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 2000);
                return;
            }
    
            // Display admin info if available
            if (decodedToken.name && document.getElementById('admin-display-name')) {
                document.getElementById('admin-display-name').textContent = decodedToken.name;
            }
            if (decodedToken.email && document.getElementById('admin-display-email')) {
                document.getElementById('admin-display-email').textContent = decodedToken.email;
            }
        }

        console.log('Admin authentication successful');
    } catch (error) {
        console.error('Token verification error:', error);
        // Continue anyway - the server will reject invalid tokens
    }
}

// Show loading overlay
function showLoading(show = true) {
    if (show) {
        loadingOverlay.classList.remove('d-none');
    } else {
        loadingOverlay.classList.add('d-none');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    
    // Set alert content
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add alert to the page
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Fetch all comments from all blog posts
async function fetchAllComments() {
    showLoading(true);
    
    try {
        // Get the token from various possible storage locations
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || 
                      sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
        
        // First get all blog posts
        const postsResponse = await fetch(`${API_URL}/blog`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        
        if (!postsResponse.ok) {
            throw new Error(`Error fetching posts: ${postsResponse.statusText}`);
        }
        
        const postsData = await postsResponse.json();
        
        if (postsData.status !== 'success' || !postsData.data) {
            throw new Error('Invalid data format from posts API');
        }
        
        // Now fetch comments for each post
        allComments = [];
        
        for (const post of postsData.data) {
            try {
                const commentsResponse = await fetch(`${API_URL}/blog/${post.postId}/comments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (!commentsResponse.ok) {
                    console.error(`Error fetching comments for post ${post.postId}: ${commentsResponse.statusText}`);
                    continue;
                }
                
                const commentsData = await commentsResponse.json();
                
                if (commentsData.status === 'success' && commentsData.data) {
                    // Add post information to each comment
                    const postComments = commentsData.data.map(comment => ({
                        ...comment,
                        postId: post.postId,
                        postTitle: post.title
                    }));
                    
                    allComments = [...allComments, ...postComments];
                }
            } catch (error) {
                console.error(`Error processing comments for post ${post.postId}:`, error);
            }
        }
        
        // Update the UI
        updateCommentCount();
        displayComments(allComments);
        
        // Hide blog post details card since we're viewing all comments
        const blogPostDetailsCard = document.querySelector('.card.mb-4');
        if (blogPostDetailsCard) {
            blogPostDetailsCard.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        showAlert('Không thể tải bình luận. Vui lòng thử lại sau.', 'danger');
    } finally {
        showLoading(false);
    }
}

// Display comments in the table
function displayComments(comments) {
    const tableBody = document.getElementById('commentsTableBody');
    tableBody.innerHTML = '';
    
    if (comments.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Không có bình luận nào</td>
            </tr>
        `;
        return;
    }
    
    comments.forEach(comment => {
        const tr = document.createElement('tr');
        
        // Format date
        const formattedDate = formatDate(comment.date);
        const userAvatar = comment.avatar ? `${API_URL}/uploads/avatars/${comment.avatar}` : '../../assets/compiled/jpg/1.jpg';
        
        tr.innerHTML = `
            <td>${comment.commentId}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm me-3">
                        <img src="${userAvatar}" alt="User Avatar">
                    </div>
                    <div>
                        <p class="font-bold mb-0">${comment.name}</p>
                        <p class="text-muted mb-0">${comment.userId}</p>
                    </div>
                </div>
            </td>
            <td>
                <p class="mb-0">${comment.content}</p>
                <small class="text-muted">Bài viết: ${comment.postTitle}</small>
            </td>
            <td>${formattedDate}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteComment(${comment.commentId})">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Update comment count
function updateCommentCount() {
    const commentCount = document.getElementById('commentCount');
    if (commentCount) {
        commentCount.textContent = allComments.length;
    }
}

// Confirm delete comment
function confirmDeleteComment(commentId) {
    deleteCommentId = commentId;
    confirmModal.show();
}

// Delete comment
async function deleteComment() {
    if (!deleteCommentId) return;
    
    showLoading(true);
    
    try {
        // Get the token from various possible storage locations
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || 
                      sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
        
        const response = await fetch(`${API_URL}/blog/comments/${deleteCommentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể xóa bình luận');
        }
        
        // Close modal
        confirmModal.hide();
        
        // Remove comment from array
        allComments = allComments.filter(comment => comment.commentId != deleteCommentId);
        
        // Update UI
        updateCommentCount();
        displayComments(allComments);
        
        // Show success message
        showAlert('Xóa bình luận thành công', 'success');
    } catch (error) {
        console.error('Error deleting comment:', error);
        showAlert('Không thể xóa bình luận: ' + error.message, 'danger');
    } finally {
        showLoading(false);
        deleteCommentId = null;
    }
}

// Filter comments
function filterComments() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchText) {
        displayComments(allComments);
        return;
    }
    
    const filteredComments = allComments.filter(comment => 
        comment.content.toLowerCase().includes(searchText) || 
        comment.name.toLowerCase().includes(searchText) ||
        comment.postTitle.toLowerCase().includes(searchText)
    );
    
    displayComments(filteredComments);
}