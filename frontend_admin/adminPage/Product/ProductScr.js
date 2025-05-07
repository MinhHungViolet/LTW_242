document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost/backend/public/products';
    const token = localStorage.getItem('adminToken');
    let products = [];
    let filteredProducts = [];

    const productTableBody = document.getElementById('productTableBody');
    const filterCategory = document.getElementById('filterCategory');
    const filterColor = document.getElementById('filterColor');
    const filterPrice = document.getElementById('filterPrice');

    const productModalElement = document.getElementById('productModal');
    const productModal = new bootstrap.Modal(productModalElement);
    const confirmModalElement = document.getElementById('confirmModal');
    const confirmModal = new bootstrap.Modal(confirmModalElement);

    const modalTitle = document.getElementById('modalTitle');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productStockInput = document.getElementById('productStock');
    const productCategoryInput = document.getElementById('productCategory');
    const productColorInput = document.getElementById('productColor');
    const productImageInput = document.getElementById('productImage');
    const productFileInput = document.getElementById('productFile');
    const previewImage = document.getElementById('previewImage');
    const modalMessage = document.getElementById('modalMessage');
    const confirmActionBtn = document.getElementById('confirmAction');
    let deleteProductId = null;

    // Hàm lấy danh sách sản phẩm từ API
    async function fetchProducts() {
        try {
            const res = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Không thể lấy danh sách sản phẩm');
            products = await res.json();
            filteredProducts = products;
            renderProducts(filteredProducts);
        } catch (err) {
            console.error(err);
            productTableBody.innerHTML = '<tr><td colspan="6">Lỗi khi tải sản phẩm</td></tr>';
        }
    }

    // Hàm hiển thị sản phẩm lên bảng
    function renderProducts(list) {
        productTableBody.innerHTML = '';
        list.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.productId}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.category}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="openModal(${p.productId})">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete(${p.productId})">Xóa</button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    }

    // Lọc sản phẩm theo input
    window.filterProducts = function() {
        const cat = filterCategory.value.trim().toLowerCase();
        const color = filterColor.value.trim().toLowerCase();
        const priceMax = parseFloat(filterPrice.value);
        filteredProducts = products.filter(p => {
            return (!cat || p.category.toLowerCase().includes(cat))
                && (!color || (p.color && p.color.toLowerCase().includes(color)))
                && (!priceMax || parseFloat(p.price) <= priceMax);
        });
        renderProducts(filteredProducts);
    };

    // Mở modal thêm hoặc chỉnh sửa
    window.openModal = function(id) {
        if (id) {
            const p = products.find(x => x.productId === id);
            modalTitle.textContent = 'Chỉnh sửa sản phẩm';
            productIdInput.value = p.productId;
            productNameInput.value = p.name;
            productPriceInput.value = p.price;
            productCategoryInput.value = p.category;
            productColorInput.value = p.color || '';
            previewImage.src = p.image.startsWith('http') ? p.image : `../assets/compiled/img/${p.image}`;
        } else {
            modalTitle.textContent = 'Thêm sản phẩm';
            productIdInput.value = '';
            productNameInput.value = '';
            productPriceInput.value = '';
            productStockInput.value = '';
            productCategoryInput.value = '';
            productColorInput.value = '';
            productImageInput.value = '';
            productFileInput.value = '';
            previewImage.src = 'https://via.placeholder.com/100';
        }
        productModal.show();
    };

    // Xem trước ảnh từ URL
    productImageInput.addEventListener('input', () => {
        const url = productImageInput.value.trim();
        if (url) previewImage.src = url;
    });

    // Xem trước ảnh khi upload file
    productFileInput.addEventListener('change', () => {
        const file = productFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => previewImage.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Lưu (thêm hoặc sửa) sản phẩm
    window.saveProduct = async function() {
        const id = productIdInput.value;
        const formData = new FormData();
        formData.append('name', productNameInput.value);
        formData.append('price', productPriceInput.value);
        formData.append('stock_quantity', productStockInput.value.trim());
        formData.append('category', productCategoryInput.value);
        formData.append('description', '');
        if (productFileInput.files[0]) {
            formData.append('productImage', productFileInput.files[0]);
        } else if (productImageInput.value.trim()) {
            formData.append('productImage', productImageInput.value.trim());
        }
        try {
            let url = API_URL;
            let method = 'POST';
            console.log("ID: ", id)
            if (id) {
                url += `/${id}`;
                method = 'POST';
            }
            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            console.log("123: ", res)
            if (!res.ok) throw new Error('Lỗi khi lưu sản phẩm');
            await fetchProducts();
            productModal.hide();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    // Xác nhận xóa
    window.confirmDelete = function(id) {
        deleteProductId = id;
        modalMessage.textContent = 'Bạn có chắc muốn xóa sản phẩm này?';
        confirmModal.show();
    };

    // Thực hiện xóa sản phẩm
    window.deleteProd = async function() {
        if (!deleteProductId) return;
        try {
            const res = await fetch(`${API_URL}/${deleteProductId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Lỗi khi xóa sản phẩm');
            await fetchProducts();
            confirmModal.hide();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    // Khởi tạo ban đầu
    fetchProducts();
});
