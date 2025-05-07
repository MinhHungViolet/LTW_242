// Order.js
// Xử lý hiển thị, lọc và cập nhật trạng thái đơn hàng, hiển thị trực tiếp các sản phẩm

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost/backend/public/admin/orders';
    const token = localStorage.getItem('adminToken');
    let orders = [];

    const orderTableBody = document.getElementById('orderTableBody');
    const filterOrderId = document.getElementById('filterOrderId');
    const filterPhoneNum = document.getElementById('filterPhoneNum');
    const filterPrice = document.getElementById('filterPrice');

    const confirmModalElement = document.getElementById('confirmModal');
    const confirmModal = new bootstrap.Modal(confirmModalElement);
    const confirmModalTitle = confirmModalElement.querySelector('#modalTitle');
    const confirmModalBody = document.getElementById('modalMessage');
    const confirmActionBtn = document.getElementById('confirmAction');

    let pendingChange = { orderId: null, newStatus: null };

    // Fetch orders and their items
    async function fetchOrders() {
        try {
            const res = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Không thể lấy danh sách đơn hàng');
            orders = await res.json();
            await Promise.all(orders.map(async o => {
                try {
                    const detailRes = await fetch(`${API_URL}/${o.orderId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (detailRes.ok) {
                        const detail = await detailRes.json();
                        o.items = detail.items;
                    } else {
                        o.items = [];
                    }
                } catch {
                    o.items = [];
                }
            }));
            renderOrders(orders);
        } catch (err) {
            console.error(err);
            orderTableBody.innerHTML = '<tr><td colspan="4">Lỗi khi tải đơn hàng</td></tr>';
        }
    }

    // Render bảng đơn hàng
    function renderOrders(list) {
        orderTableBody.innerHTML = '';
        list.forEach(o => {
            // Tạo HTML cho giỏ hàng
            const itemsHtml = o.items.map(it =>
                `<li>${it.productName} (x${it.quantity}) - ${it.price_at_purchase}</li>`
            ).join('');
            const cartHtml = itemsHtml ? `<ul>${itemsHtml}</ul>` : '—';
            
            // Map trạng thái
            let statusLabel = '';
            let badgeClass = '';
            if (o.status === 'delivered') {
                statusLabel = 'delivered';
                badgeClass = 'bg-success';
            } else if (o.status === 'cancelled') {
                statusLabel = 'cancelled';
                badgeClass = 'bg-danger';
            }

            // Nút hành động chỉ cho đơn pending
            let actions = '';
            if (o.status === 'pending') {
                actions = `
                    <button class="btn btn-sm btn-success me-1" onclick="handleChange(${o.orderId}, 'delivered')">Duyệt</button>
                    <button class="btn btn-sm btn-danger" onclick="handleChange(${o.orderId}, 'cancelled')">Hủy</button>
                `;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-center">${o.orderId}</td>
                <td>${cartHtml}</td>
                <td>
                  <strong>${o.customerName}</strong><br>
                  ${o.customerEmail}<br>
                  ${o.address}<br>
                  ${o.customerPhone || ''}
                </td>
                <td class="text-center">
                  ${statusLabel ? `<span class="badge ${badgeClass} text-light">${statusLabel}</span><br>` : ''}
                  ${actions}
                </td>
            `;
            orderTableBody.appendChild(tr);
        });
    }

    // Lọc đơn hàng
    window.filterOrders = () => {
        const id = parseInt(filterOrderId.value, 10);
        const phone = filterPhoneNum.value.trim();
        const maxP = parseFloat(filterPrice.value);
        const filtered = orders.filter(o => {
            return (!id || o.orderId === id)
                && (!phone || (o.customerPhone && o.customerPhone.includes(phone)))
                && (!maxP || parseFloat(o.totalPrice) <= maxP);
        });
        renderOrders(filtered);
    };

    // Xử lý xác nhận thay đổi trạng thái
    window.handleChange = (orderId, newStatus) => {
        pendingChange = { orderId, newStatus };
        confirmModalTitle.textContent = 'Xác nhận';
        confirmModalBody.textContent = `Bạn có muốn đổi trạng thái đơn #${orderId} sang "${newStatus}" không?`;
        confirmActionBtn.style.display = 'inline-block';
        confirmActionBtn.textContent = 'Xác nhận';
        confirmModal.show();
    };

    // Khi nhấn nút trong modal xác nhận
    confirmActionBtn.addEventListener('click', async () => {
        const { orderId, newStatus } = pendingChange;
        try {
            const res = await fetch(`${API_URL}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || `Lỗi ${res.status}`);
            }
            await fetchOrders();
            confirmModal.hide();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });

    // Khởi tạo
    fetchOrders();
});
