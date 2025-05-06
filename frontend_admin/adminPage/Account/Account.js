// Account.js
// Quản lý người dùng: xem, tạo Admin mới, xóa user (không xóa Admin)

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost/backend/public/admin/users';
    const token = localStorage.getItem('adminToken');
    let users = [];
    let deleteUserId = null;
  
    // DOM elements
    const userTableBody = document.getElementById('userTableBody');
    const createModal = new bootstrap.Modal(document.getElementById('createModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const createBtn = document.getElementById('createBtn');
    const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
  
    // Open Create Admin modal
    window.openCreateModal = () => {
      document.getElementById('newName').value = '';
      document.getElementById('newEmail').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('newPhone').value = '';
      createModal.show();
    };
  
    // Open Delete confirmation modal
    window.openDeleteModal = (id) => {
      deleteUserId = id;
      deleteModal.show();
    };
  
    // Fetch all users
    async function fetchUsers() {
      try {
        const res = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Lấy danh sách thất bại');
        const resp = await res.json();
        if (resp.status !== 'success' || !Array.isArray(resp.data)) {
          throw new Error('Response không đúng định dạng');
        }
        users = resp.data;
        renderUsers();
      } catch (err) {
        console.error('fetchUsers error:', err);
      }
    }
  
    // Render user table
    function renderUsers() {
      userTableBody.innerHTML = '';
      users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>${u.phone}</td>
          <td>${u.created_at}</td>
          <td>${u.role !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="openDeleteModal(${u.userId})">Xóa</button>` : ''}</td>
        `;
        userTableBody.appendChild(tr);
      });
    }
  
    // Create new Admin
    createBtn.addEventListener('click', async () => {
      const payload = {
        name: document.getElementById('newName').value.trim(),
        email: document.getElementById('newEmail').value.trim(),
        password: document.getElementById('newPassword').value,
        phone: document.getElementById('newPhone').value.trim()
      };
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes.message || 'Tạo thất bại');
        }
        createModal.hide();
        fetchUsers();
      } catch (err) {
        console.error('create user error:', err);
        alert(err.message);
      }
    });
  
    // Delete user confirmation
    deleteConfirmBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_URL}/${deleteUserId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes.message || 'Xóa thất bại');
        }
        deleteModal.hide();
        fetchUsers();
      } catch (err) {
        console.error('delete user error:', err);
        alert(err.message);
      }
    });
  
    // Initial load
    fetchUsers();
  });
  