// HomePage.js

// Hiển thị thông tin Admin và xử lý logout
function setupAdminInfo() {
    const token = localStorage.getItem('adminToken');
    // Nếu không có token, chuyển về trang login
    if (!token) {
        window.location.replace('admin_login.html');
        return;
    }
    let name = localStorage.getItem('adminName');
    let email;
    try {
        // Giải mã token để lấy email
        const decoded = jwt_decode(token);
        email = decoded.email || decoded.userEmail;
        // Nếu chưa lưu name riêng, thử lấy từ payload user.name
        if (!name && decoded.user && decoded.user.name) {
            name = decoded.user.name;
        }
    } catch (e) {
        console.error('Không thể decode token:', e);
    }
    // Dùng email làm tên nếu chưa có
    if (!name) {
        name = email;
    }
    // Hiển thị
    const nameEl = document.getElementById('admin-display-name');
    const emailEl = document.getElementById('admin-display-email');
    nameEl.textContent = name;
    emailEl.textContent = email;

    // Logout
    const logoutBtn = document.getElementById('admin-logout-button');
    logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        window.location.replace('admin_login.html');
    });
}

// Lấy số lượng Q&A
async function fetchQnaCount() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost/backend/public/question/count', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        const el = document.getElementById('qnaCount');
        if (data.status === 'success') {
            el.textContent = data.data;
        } else {
            el.textContent = 'Error';
            console.error('Lỗi khi lấy số câu hỏi:', data);
        }
    } catch (err) {
        const el = document.getElementById('qnaCount');
        el.textContent = 'Error';
        console.error('Lỗi khi lấy số câu hỏi:', err);
    }
}

// Lấy câu hỏi mới nhất
async function fetchLatestQna() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost/backend/public/question/latest', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (data.status === 'success') {
            const tbody = document.querySelector('#recentQnaTable tbody');
            tbody.innerHTML = '';
            data.data.slice(0, 5).forEach((qna, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-3">
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-md">
                                <img src="../assets/compiled/jpg/${(index % 5) + 1}.jpg">
                            </div>
                            <p class="font-bold ms-3 mb-0">User ${qna.customerId}</p>
                        </div>
                    </td>
                    <td class="col-auto">
                        <p class="mb-0">${qna.question}</p>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error('Lỗi khi lấy câu hỏi mới nhất:', data);
        }
    } catch (err) {
        console.error('Lỗi khi lấy câu hỏi mới nhất:', err);
    }
}

// Lấy tổng số đơn hàng
async function fetchOrderCount() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost/backend/public/admin/orders', {
            headers: token ? { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } : { 'Accept': 'application/json' }
        });
        const data = await response.json();
        console.log('Order list response:', data);
        let list = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (data.data && Array.isArray(data.data)) {
            list = data.data;
        } else {
            console.error('Không nhận được mảng đơn hàng:', data);
        }
        document.getElementById('orderCount').textContent = list.length;
    } catch (err) {
        console.error('Lỗi khi lấy số đơn hàng:', err);
        document.getElementById('orderCount').textContent = 'Error';
    }
}

// Lấy tổng số sản phẩm
async function fetchProductCount() {
    try {
        const response = await fetch('http://localhost/backend/public/products', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        console.log('Product list response:', data);
        let list = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (data.data && Array.isArray(data.data)) {
            list = data.data;
        } else {
            console.error('Không nhận được mảng sản phẩm:', data);
        }
        document.getElementById('productCount').textContent = list.length;
    } catch (err) {
        console.error('Lỗi khi lấy số sản phẩm:', err);
        document.getElementById('productCount').textContent = 'Error';
    }
}

// Gọi các hàm khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    setupAdminInfo();
    fetchQnaCount();
    fetchLatestQna();
    fetchOrderCount();
    fetchProductCount();
});
