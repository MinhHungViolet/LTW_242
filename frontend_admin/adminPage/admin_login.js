// admin_login.js

document.addEventListener('DOMContentLoaded', function() {
    const API_LOGIN_URL = 'http://localhost/backend/public/login';
    const ADMIN_DASHBOARD_URL = './HomePage.html';

    // Lấy các phần tử DOM
    const loginForm = document.getElementById('admin-login-form');
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const errorDiv = document.getElementById('login-error-message');
    const loginButton = document.getElementById('login-button');
    const loginButtonText = document.getElementById('login-button-text');
    const loginSpinner = document.getElementById('login-spinner');

    // Xử lý sự kiện submit form
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;
        if (!email) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }
        if (!password) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }
        if (!isValid) {
            errorDiv.textContent = 'Vui lòng nhập đầy đủ email và mật khẩu.';
            errorDiv.style.display = 'block';
            return;
        }

        // Hiển thị trạng thái loading
        loginButton.disabled = true;
        loginButtonText.textContent = 'Đang xử lý...';
        loginSpinner.style.display = 'inline-block';

        try {
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || `Lỗi ${response.status}`);
            }

            if (data.token && data.user) {
                if (data.user.role === 'admin') {
                    console.log('Admin login successful! Token:', data.token);
                    localStorage.setItem('adminToken', data.token);
                    window.location.replace(ADMIN_DASHBOARD_URL);

                } else {
                    // Đăng nhập thành công nhưng không phải admin
                    throw new Error('Tài khoản này không có quyền truy cập trang quản trị.');
                }
            } else {
                // API trả về 200 OK nhưng thiếu token hoặc user data
                throw new Error('Dữ liệu trả về từ server không hợp lệ.');
            }

        } catch (error) {
            console.error('Login failed:', error);
            // Hiển thị lỗi cho người dùng
            errorDiv.textContent = error.message || 'Đã xảy ra lỗi không mong muốn.';
            errorDiv.style.display = 'block';

            // Tắt trạng thái loading
            loginButton.disabled = false;
            loginButtonText.textContent = 'Đăng Nhập';
            loginSpinner.style.display = 'none';
        }
    });
});