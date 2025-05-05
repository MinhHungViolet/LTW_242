// Global variables
let dataTable;
const apiBaseUrl = 'http://localhost/backend/public'; // Update this with your actual API base URL

// DOM ready
$(document).ready(function() {
    // Initialize sidebar and header
    $("#sidebar").load("../components/sidebar.html");
    $("header").load("../components/header.html");

    // Initialize DataTable
    dataTable = $('#news-table').DataTable({
        responsive: true,
        processing: true,
        columns: [
            { data: 'id' },
            { 
                data: 'image', 
                render: function(data, type, row) {
                    if (data) {
                        return `<img src="${data}" alt="News thumbnail" class="img-thumbnail" style="width: 80px; height: 50px; object-fit: cover;">`;
                    }
                    return 'No image';
                } 
            },
            { data: 'title' },
            { data: 'created_at' },
            { data: 'author' },
            { data: 'category' },
            { 
                data: null,
                render: function(data, type, row) {
                    return `
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-info view-btn" data-id="${row.id}"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-sm btn-primary edit-btn" data-id="${row.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}"><i class="bi bi-trash"></i></button>
                        </div>
                    `;
                }
            }
        ]
    });

    // Load news posts when page loads
    loadNewsPosts();

    // Handle file input preview
    $('#image').on('change', previewImage);
    $('#edit-newImage').on('change', function() {
        previewImage.call(this, '#edit-imagePreview');
    });

    // Form submission handlers
    $('#addNewsForm').on('submit', handleAddNews);
    $('#editNewsForm').on('submit', handleUpdateNews);

    // Table button handlers
    $('#news-table').on('click', '.view-btn', handleViewNews);
    $('#news-table').on('click', '.edit-btn', handleEditButtonClick);
    $('#news-table').on('click', '.delete-btn', handleDeleteButtonClick);
});

// Load all news posts
function loadNewsPosts() {
    fetch(`${apiBaseUrl}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear existing data and add new data
            dataTable.clear();
            dataTable.rows.add(data).draw();
        })
        .catch(error => {
            console.error('Error fetching news posts:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to load news posts',
                text: 'Please try again later.',
            });
        });
}

// Preview image before upload
function previewImage(previewElement = '#imagePreview') {
    const file = this.files[0];
    const preview = $(previewElement);
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.removeClass('d-none');
            preview.find('img').attr('src', e.target.result);
        };
        
        reader.readAsDataURL(file);
    } else {
        preview.addClass('d-none');
        preview.find('img').attr('src', '');
    }
}

// Add new news post
function handleAddNews(e) {
    e.preventDefault();
    
    const title = $('#title').val();
    const content = $('#content').val();
    const category = $('#category').val() || 'Uncategorized';
    const imageFile = $('#image')[0].files[0];
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // Send request to API
    fetch(`${apiBaseUrl}/posts`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create post');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Post Created',
            text: 'The news post has been created successfully!'
        });
        
        // Reset form and close modal
        $('#addNewsForm')[0].reset();
        $('#imagePreview').addClass('d-none');
        $('#addNewsModal').modal('hide');
        
        // Reload news posts
        loadNewsPosts();
    })
    .catch(error => {
        console.error('Error creating news post:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to Create Post',
            text: 'There was an error creating the post. Please try again.'
        });
    });
}

// Handle view news button click
function handleViewNews() {
    const postId = $(this).data('id');
    
    // Get post details
    fetch(`${apiBaseUrl}/posts/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch post details');
            }
            return response.json();
        })
        .then(post => {
            // Populate modal with post details
            $('#view-title').text(post.title);
            $('#view-content').html(post.content);
            $('#view-category').text(post.category || 'Uncategorized');
            $('#view-author').text(post.author || 'Admin');
            $('#view-date').text(new Date(post.created_at).toLocaleDateString());
            
            if (post.image) {
                $('#view-image').attr('src', post.image).removeClass('d-none');
            } else {
                $('#view-image').addClass('d-none');
            }
            
            // Show the modal
            $('#viewNewsModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to load post details',
                text: 'There was an error loading the post details. Please try again.'
            });
        });
}

// Handle edit button click
function handleEditButtonClick() {
    const postId = $(this).data('id');
    
    // Get post details to populate edit form
    fetch(`${apiBaseUrl}/posts/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch post details');
            }
            return response.json();
        })
        .then(post => {
            // Populate edit form
            $('#edit-postId').val(post.id);
            $('#edit-title').val(post.title);
            $('#edit-content').val(post.content);
            $('#edit-category').val(post.category);
            
            // Show current image if available
            if (post.image) {
                $('#edit-currentImage').removeClass('d-none')
                    .find('img').attr('src', post.image);
            } else {
                $('#edit-currentImage').addClass('d-none');
            }
            
            // Reset image preview
            $('#edit-imagePreview').addClass('d-none');
            $('#edit-newImage').val('');
            
            // Show the modal
            $('#editNewsModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching post details for edit:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to load post details',
                text: 'There was an error loading the post details for editing. Please try again.'
            });
        });
}

// Update news post
function handleUpdateNews(e) {
    e.preventDefault();
    
    const postId = $('#edit-postId').val();
    const title = $('#edit-title').val();
    const content = $('#edit-content').val();
    const category = $('#edit-category').val();
    const imageFile = $('#edit-newImage')[0].files[0];
    
    // Create form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // Send request to API
    fetch(`${apiBaseUrl}/posts/${postId}`, {
        method: 'POST', // Many servers don't support PUT with form-data, so we use POST with _method
        body: formData,
        headers: {
            'X-HTTP-Method-Override': 'PUT' // Tell the server we want to do a PUT
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update post');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Post Updated',
            text: 'The news post has been updated successfully!'
        });
        
        // Close modal and reload posts
        $('#editNewsModal').modal('hide');
        loadNewsPosts();
    })
    .catch(error => {
        console.error('Error updating news post:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to Update Post',
            text: 'There was an error updating the post. Please try again.'
        });
    });
}

// Handle delete button click
function handleDeleteButtonClick() {
    const postId = $(this).data('id');
    
    Swal.fire({
        title: 'Are you sure?',
        text: "This post will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteNewsPost(postId);
        }
    });
}

// Delete news post
function deleteNewsPost(postId) {
    fetch(`${apiBaseUrl}/posts/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Post Deleted',
            text: 'The news post has been deleted successfully!'
        });
        
        // Reload news posts
        loadNewsPosts();
    })
    .catch(error => {
        console.error('Error deleting news post:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to Delete Post',
            text: 'There was an error deleting the post. Please try again.'
        });
    });
}