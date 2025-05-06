// admin_login.js

document.addEventListener('DOMContentLoaded', function() {
    // Định nghĩa các hằng số URL
    const API_LOGIN_URL = 'http://localhost/backend/public/login';
    // Đường dẫn tương đối đến trang dashboard admin từ trang login này
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
        event.preventDefault(); // Ngăn form submit theo cách truyền thống

        // Xóa thông báo lỗi cũ và reset validation (nếu dùng Bootstrap validation)
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        // Lấy giá trị input
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate cơ bản
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
            // Gọi API đăng nhập bằng fetch
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Nên thêm Accept header
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Parse kết quả JSON
            const data = await response.json();

            // Kiểm tra response có thành công không (status 200-299)
            if (!response.ok) {
                 // Ném lỗi với message từ API hoặc status text
                throw new Error(data.error || data.message || `Lỗi ${response.status}`);
            }

            // Kiểm tra xem có token và user data không
            if (data.token && data.user) {
                // *** Quan trọng: Kiểm tra vai trò (role) ***
                if (data.user.role === 'admin') {
                    // Đăng nhập thành công với vai trò Admin
                    console.log('Admin login successful! Token:', data.token);

                    // Lưu token vào localStorage để các trang admin khác sử dụng
                    localStorage.setItem('adminToken', data.token);
                    // (Tùy chọn) Lưu thêm thông tin khác nếu cần, ví dụ tên
                    // localStorage.setItem('adminName', data.user.name);

                    // Chuyển hướng đến trang dashboard admin
                    // Dùng replace để không lưu trang login vào lịch sử trình duyệt
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