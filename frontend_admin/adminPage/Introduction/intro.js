const API_URL = 'http://localhost/backend/public/introduction';

async function fetchIntroduction() {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(API_URL, {
            headers: headers
        });
        const data = await response.json();
        if (data.status === 'success') {
            const intro = data.data;
            document.getElementById('title1').value = intro.title1 || '';
            document.getElementById('content1').value = intro.content1 || '';
            document.getElementById('title2').value = intro.title2 || '';
            document.getElementById('content2').value = intro.content2 || '';
            document.getElementById('title3').value = intro.title3 || '';
            document.getElementById('content3').value = intro.content3 || '';
        } else {
            showError('Lỗi khi lấy dữ liệu giới thiệu: ' + data.message);
        }
    } catch (err) {
        showError('Lỗi khi lấy dữ liệu giới thiệu: ' + err.message);
    }
}

async function saveIntroduction() {
    const title1 = document.getElementById('title1').value.trim();
    const content1 = document.getElementById('content1').value.trim();
    const title2 = document.getElementById('title2').value.trim();
    const content2 = document.getElementById('content2').value.trim();
    const title3 = document.getElementById('title3').value.trim();
    const content3 = document.getElementById('content3').value.trim();

    if (!title1 || !content1 || !title2 || !content2 || !title3 || !content3) {
        alert('Vui lòng nhập đầy đủ tất cả các trường.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để chỉnh sửa nội dung.');
            return;
        }

        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title1, content1, title2, content2, title3, content3 })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Cập nhật nội dung giới thiệu thành công!');
            fetchIntroduction(); // Làm mới dữ liệu
        } else {
            alert('Lỗi khi cập nhật nội dung: ' + data.message);
        }
    } catch (err) {
        alert('Lỗi khi cập nhật nội dung: ' + err.message);
    }
}

function showError(message) {
    const formContainer = document.getElementById('introForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    formContainer.prepend(errorDiv);
}

document.addEventListener('DOMContentLoaded', fetchIntroduction);