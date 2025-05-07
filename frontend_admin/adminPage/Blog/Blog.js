// API base URL - adjust this based on your backend configuration
const API_URL = 'http://localhost/backend/public/blog';
const CATEGORIES_API_URL = 'http://localhost/backend/public/categories'; // URL for categories API

// Global variables
let currentPage = 1;
let totalPages = 1;
let postsPerPage = 10;
let blogPosts = [];
let currentPostId = null;
let deletePostId = null;
let blogCategories = []; // Store available categories

// DOM elements
const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated as admin
    checkAdminAuth();
    // Load categories first, then blog posts
    loadCategories().then(() => {
        loadBlogPosts();
    });
    
    // Set up event listeners
    document.getElementById('confirmDelete').addEventListener('click', deletePost);
    document.getElementById('image').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('currentImage').classList.remove('d-none');
            }
            reader.readAsDataURL(file);
        }
    });
});

// Load categories from API
async function loadCategories() {
    try {
        // First check if we already have categories stored in localStorage
        const cachedCategories = localStorage.getItem('blogCategories');
        if (cachedCategories) {
            blogCategories = JSON.parse(cachedCategories);
            return;
        }
        
        // If no cached categories, fetch from API
        // Note: This is a placeholder since we don't have an actual categories API endpoint
        // In a real implementation, you would fetch categories from a dedicated endpoint
        
        // For now, we'll use some default categories
        blogCategories = [
            { id: 1, name: 'Tin tức', slug: 'tin-tuc' },
            { id: 2, name: 'Thời trang', slug: 'thoi-trang' },
            { id: 3, name: 'Hướng dẫn', slug: 'huong-dan' },
            { id: 4, name: 'Review', slug: 'review' },
            { id: 5, name: 'Chưa phân loại', slug: 'uncategorized' }
        ];
        
        // Cache categories in localStorage for future use
        localStorage.setItem('blogCategories', JSON.stringify(blogCategories));
    } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories if API fails
        blogCategories = [
            { id: 5, name: 'Chưa phân loại', slug: 'uncategorized' }
        ];
    }
}

// Check if user is authenticated as admin
function checkAdminAuth() {
    // Check for adminToken which is the correct token name used after admin login
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        console.log('No admin token found. Redirecting to login page...');
        window.location.href = '../admin_login.html';
        return;
    }
    
    // You can add additional checks here if needed
    // For example, verify that the token is valid or hasn't expired
    console.log('Admin authentication successful');
}

// Load blog posts from API
async function loadBlogPosts(page = 1) {
    try {
        currentPage = page;
        showLoading(true);
        
        // Fetch posts from API with pagination
        const response = await fetch(`${API_URL}?page=${page}&limit=${postsPerPage}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            blogPosts = data.data || [];
            totalPages = data.totalPages || 1;
            
            // Render posts to table
            renderPosts(blogPosts);
            
            // Generate pagination
            renderPagination(currentPage, totalPages);
        } else {
            showAlert('Không thể tải danh sách bài viết: ' + (data.message || 'Đã có lỗi xảy ra'), 'danger');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        showAlert('Không thể tải danh sách bài viết: ' + error.message, 'danger');
    } finally {
        showLoading(false);
    }
}

// Render posts to table
function renderPosts(posts) {
    const tableBody = document.getElementById('blogTableBody');
    tableBody.innerHTML = '';
    
    if (posts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Không có bài viết nào</td>
            </tr>
        `;
        return;
    }
    
    posts.forEach(post => {
        const date = new Date(post.date).toLocaleDateString('vi-VN');
        const category = getCategoryName(post.category);
        const categoryBadge = getCategoryBadge(post.category);
        
        tableBody.innerHTML += `
            <tr>
                <td>${post.postId}</td>
                <td>
                    <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${post.title}
                    </div>
                </td>
                <td>
                    ${post.image ? 
                        `<img src="${API_URL}/uploads/blog/${post.image}" class="img-thumbnail" style="height: 50px;">` : 
                        '<span class="text-muted">Không có</span>'}
                </td>
                <td>${date}</td>
                <td>${categoryBadge}</td>
                <td>${post.author || 'Admin'}</td>
                <td>
                    <div class="d-flex">
                        <button onclick="viewPost(${post.postId})" class="btn btn-sm btn-info me-1" title="Xem">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button onclick="editPost(${post.postId})" class="btn btn-sm btn-primary me-1" title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button onclick="confirmDelete(${post.postId})" class="btn btn-sm btn-danger" title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Get category name by ID/slug
function getCategoryName(categoryId) {
    if (!categoryId) return 'Chưa phân loại';
    
    const category = blogCategories.find(cat => 
        cat.id === parseInt(categoryId) || cat.slug === categoryId
    );
    
    return category ? category.name : 'Chưa phân loại';
}

// Get category badge HTML by category ID/slug
function getCategoryBadge(categoryId) {
    if (!categoryId) {
        return '<span class="badge bg-secondary">Chưa phân loại</span>';
    }
    
    // Map category IDs/slugs to badge colors
    const categoryColors = {
        'tin-tuc': 'success',
        'khuyen-mai': 'warning',
        'huong-dan': 'info',
        'review': 'primary',
        'uncategorized': 'secondary',
        // Map IDs as well
        '1': 'success',  // Tin tức
        '2': 'warning',  // Khuyến mãi
        '3': 'info',     // Hướng dẫn
        '4': 'primary',  // Review
        '5': 'secondary' // Chưa phân loại
    };
    
    const category = blogCategories.find(cat => 
        cat.id === parseInt(categoryId) || cat.slug === categoryId
    );
    
    const name = category ? category.name : 'Chưa phân loại';
    const color = categoryColors[categoryId] || categoryColors[category?.slug] || 'secondary';
    
    return `<span class="badge bg-${color}">${name}</span>`;
}

// Generate pagination
function renderPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    // Previous button
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadBlogPosts(${currentPage - 1}); return false;">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadBlogPosts(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    // Next button
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadBlogPosts(${currentPage + 1}); return false;">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
}

// Open modal for adding a new post
function openModal() {
    // Reset form
    document.getElementById('blogForm').reset();
    document.getElementById('currentImage').classList.add('d-none');
    document.getElementById('modalTitle').textContent = 'Thêm bài viết mới';
    document.getElementById('postId').value = '';
    currentPostId = null;
    
    // Populate category select box
    populateCategorySelect();
    
    blogModal.show();
}

// Populate category select dropdown
function populateCategorySelect(selectedCategory = null) {
    const categorySelect = document.getElementById('status');
    categorySelect.innerHTML = '';
    
    blogCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;
        option.textContent = category.name;
        if (selectedCategory === category.slug || selectedCategory === category.id.toString()) {
            option.selected = true;
        }
        categorySelect.appendChild(option);
    });
    
    // Add an option for uncategorized if not already present
    if (!blogCategories.some(cat => cat.slug === 'uncategorized')) {
        const uncategorizedOption = document.createElement('option');
        uncategorizedOption.value = '';
        uncategorizedOption.textContent = 'Chưa phân loại';
        if (!selectedCategory) {
            uncategorizedOption.selected = true;
        }
        categorySelect.appendChild(uncategorizedOption);
    }
}

// View post details
function viewPost(postId) {
    window.open(`${API_URL}/${postId}`, '_blank');
}

// Edit post
async function editPost(postId) {
    try {
        currentPostId = postId;
        showLoading(true);
        
        // Fetch post details
        const response = await fetch(`${API_URL}/${postId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const post = data.data;
            
            // Fill form with post data
            document.getElementById('postId').value = post.postId;
            document.getElementById('title').value = post.title || '';
            document.getElementById('content').value = post.content || '';
            
            // Populate category dropdown and select the current category
            populateCategorySelect(post.category);
            
            // Display current image if exists
            if (post.image) {
                document.getElementById('previewImage').src = `${API_URL}/uploads/blog/${post.image}`;
                document.getElementById('currentImage').classList.remove('d-none');
            } else {
                document.getElementById('currentImage').classList.add('d-none');
            }
            
            // Update modal title
            document.getElementById('modalTitle').textContent = 'Chỉnh sửa bài viết';
            
            // Show modal
            blogModal.show();
        } else {
            showAlert('Không thể tải thông tin bài viết: ' + (data.message || 'Đã có lỗi xảy ra'), 'danger');
        }
    } catch (error) {
        console.error('Error loading post for edit:', error);
        showAlert('Không thể tải thông tin bài viết: ' + error.message, 'danger');
    } finally {
        showLoading(false);
    }
}

// Save post (create or update)
async function savePost() {
    try {
        // Validate form
        const form = document.getElementById('blogForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        showLoading(true);
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const category = document.getElementById('status').value;
        const imageFile = document.getElementById('image').files[0];
        const postId = document.getElementById('postId').value;
        
        // Prepare data for API
        const postData = {
            title,
            content,
            category
        };
        
        const token = localStorage.getItem('adminToken');
        let url = API_URL;
        let method = 'POST';
        
        // If updating an existing post
        if (postId) {
            url = `${API_URL}/${postId}`;
            method = 'PUT';
        }
        
        // API request options
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };
        
        // Send request to API
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.status === 'success') {
            // Handle image upload if a new image is selected
            if (imageFile && (postId ? !document.getElementById('keepExistingImage').checked : true)) {
                await uploadImage(postId || data.data.postId, imageFile);
            }
            
            // Close modal and refresh posts
            blogModal.hide();
            showAlert(postId ? 'Bài viết đã được cập nhật thành công' : 'Bài viết đã được tạo thành công', 'success');
            loadBlogPosts(currentPage);
        } else {
            showAlert(postId ? 'Không thể cập nhật bài viết: ' : 'Không thể tạo bài viết: ' + 
                    (data.message || 'Đã có lỗi xảy ra'), 'danger');
        }
    } catch (error) {
        console.error('Error saving post:', error);
        showAlert('Đã có lỗi xảy ra khi lưu bài viết: ' + error.message, 'danger');
    } finally {
        showLoading(false);
    }
}

// Upload image for a post
async function uploadImage(postId, imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const token = localStorage.getItem('adminToken');
        
        await fetch(`${API_URL}/${postId}/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        showAlert('Bài viết đã được lưu nhưng không thể tải lên hình ảnh: ' + error.message, 'warning');
    }
}

// Confirm delete post
function confirmDelete(postId) {
    deletePostId = postId;
    confirmModal.show();
}

// Delete post
async function deletePost() {
    try {
        if (!deletePostId) return;
        
        showLoading(true);
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(`${API_URL}/${deletePostId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showAlert('Bài viết đã được xóa thành công', 'success');
            
            // Reload current page or go to previous page if this was the only item
            const reloadPage = blogPosts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            loadBlogPosts(reloadPage);
        } else {
            showAlert('Không thể xóa bài viết: ' + (data.message || 'Đã có lỗi xảy ra'), 'danger');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        showAlert('Không thể xóa bài viết: ' + error.message, 'danger');
    } finally {
        confirmModal.hide();
        deletePostId = null;
        showLoading(false);
    }
}

// Filter posts based on search input and sort option
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortOption = document.getElementById('sortSelect').value;
    
    // Filter posts based on search term
    let filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
    );
    
    // Sort posts based on selected option
    if (sortOption === 'newest') {
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'oldest') {
        filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'title') {
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Render filtered posts
    renderPosts(filteredPosts);
}

// Show loading indicator
function showLoading(isLoading) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    if (isLoading) {
        loadingOverlay.classList.remove('d-none');
    } else {
        loadingOverlay.classList.add('d-none');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    let alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        alertContainer.className = 'position-fixed top-0 end-0 p-3';
        alertContainer.style.zIndex = '1050';
        document.body.appendChild(alertContainer);
    }
    
    const alertId = `alert_${Date.now()}`;
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.id = alertId;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alertElement);
    
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(document.getElementById(alertId));
        if (alert) {
            alert.close();
        }
    }, 5000);
}
