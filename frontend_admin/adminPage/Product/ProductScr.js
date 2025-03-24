let products = [
    { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", image: "" },
    { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", image: "" },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", image: "" },
    { id: 4, name: "Áo sơ mi 4", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 5, name: "Áo sơ mi 5", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 6, name: "Áo sơ mi 6", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 7, name: "Áo sơ mi 7", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 8, name: "Áo sơ mi 8", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 9, name: "Áo sơ mi 9", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 10, name: "Áo sơ mi 10", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 11, name: "Áo sơ mi 11", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 12, name: "Áo sơ mi 12", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 13, name: "Áo sơ mi 13", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 14, name: "Áo sơ mi 14", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 15, name: "Áo sơ mi 15", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 16, name: "Áo sơ mi 16", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 17, name: "Áo sơ mi 17", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 18, name: "Áo sơ mi 18", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 19, name: "Áo sơ mi 19", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 20, name: "Áo sơ mi 20", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 21, name: "Áo sơ mi 21", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 22, name: "Áo sơ mi 22", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 23, name: "Áo sơ mi 23", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 24, name: "Áo sơ mi 24", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 25, name: "Áo sơ mi 25", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 26, name: "Áo sơ mi 26", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 27, name: "Áo sơ mi 27", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 28, name: "Áo sơ mi 28", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 29, name: "Áo sơ mi 29", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
    { id: 30, name: "Áo sơ mi 30", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "" },
];

const itemPerPage = 5;
let currentPage = 1;

function displayProducts(page, listProd) {
    let start = (page - 1) * itemPerPage;
    let end = start + itemPerPage;
    let displayed = listProd.slice(start, end);

    let tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    displayed.forEach((product, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" width="50" class="me-2">
                    ${product.name}
                </td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.category}</td>
                <td>${product.color}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Chỉnh sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
    updatePagination();
}

function updatePagination() {
    let totalPages = Math.ceil(products.length / itemPerPage);
    let paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    let ul = document.createElement("ul");
    ul.className = "pagination pagination-primary justify-content-center";

    // Tạo nút về trang đầu tiên nếu currentPage >= 2
    if (currentPage > 1) {
        let firstPage = createPageItem(1, `<i class="bi bi-chevron-double-left"></i>`);
        let prevPage = createPageItem(currentPage - 1, `<i class="bi bi-chevron-left"></i>`);
        ul.appendChild(firstPage);
        ul.appendChild(prevPage);
    }

    // Xác định các trang hiển thị
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        let pageItem = createPageItem(i, i);
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        ul.appendChild(pageItem);
    }

    // Tạo nút đi tới trang cuối nếu currentPage < totalPages
    if (currentPage < totalPages) {
        let nextPage = createPageItem(currentPage + 1, `<i class="bi bi-chevron-right"></i>`);
        let lastPage = createPageItem(totalPages, `<i class="bi bi-chevron-double-right"></i>`);
        ul.appendChild(nextPage);
        ul.appendChild(lastPage);
    }

    paginationContainer.appendChild(ul);
}

// Hàm tạo thẻ <li> chứa nút phân trang
function createPageItem(page, content) {
    let li = document.createElement("li");
    li.className = "page-item";
    let a = document.createElement("a");
    a.className = "page-link";
    a.innerHTML = content;
    a.href = "#";
    a.onclick = function (e) {
        e.preventDefault();
        currentPage = page;
        displayProducts(currentPage, products);
        updatePagination();
    };
    li.appendChild(a);
    return li;
}


// Biến toàn cục để lưu trữ id sản phẩm đang được chỉnh sửa (nếu có)
let editingProductId = null;

function openModal(isEdit = false, prodId = null) {
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    document.getElementById("modalTitle").textContent = isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";

    if (isEdit && prodId !== null) {
        const realProd = products.find(i => i.id === prodId);
        console.log(realProd);
        if (realProd) {
            document.getElementById("productId").value = realProd.id; // trường ẩn
            document.getElementById("productName").value = realProd.name;
            document.getElementById("productPrice").value = realProd.price;
            document.getElementById("productCategory").value = realProd.category;
            document.getElementById("productColor").value = realProd.color;
            document.getElementById("productImage").value = realProd.image;
            document.getElementById("previewImage").src = realProd.image;
            // Gán id vào biến toàn cục để biết đang ở chế độ chỉnh sửa
            editingProductId = realProd.id;
        }
    } else {
        // Reset form cho chế độ thêm mới
        document.getElementById("productId").value = "";
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productColor").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("previewImage").src = "https://via.placeholder.com/100";
        editingProductId = null;
    }

    modal.show();
}

document.getElementById("productFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result;
            document.getElementById("productImage").value = e.target.result; // Lưu base64 vào input
        };
        reader.readAsDataURL(file);
    }
});

function saveProduct() {
    // Lấy các phần tử input
    const productIdEl = document.getElementById("productId");
    const nameEl = document.getElementById("productName");
    const priceEl = document.getElementById("productPrice");
    const categoryEl = document.getElementById("productCategory");
    const colorEl = document.getElementById("productColor");
    const imageEl = document.getElementById("productImage");
    const modalEl = document.getElementById("productModal");

    let isValid = true;
    // Reset trạng thái validation của các input
    [nameEl, priceEl, categoryEl, colorEl, imageEl].forEach(el => {
        el.classList.remove("is-invalid");
        el.classList.remove("is-valid");
    });

    // Kiểm tra các trường bắt buộc
    if (nameEl.value.trim() === "") {
        nameEl.classList.add("is-invalid");
        isValid = false;
    } else {
        nameEl.classList.add("is-valid");
    }
    if (priceEl.value.trim() === "" || parseFloat(priceEl.value) <= 0) {
        priceEl.classList.add("is-invalid");
        isValid = false;
    } else {
        priceEl.classList.add("is-valid");
    }
    if (categoryEl.value.trim() === "") {
        categoryEl.classList.add("is-invalid");
        isValid = false;
    } else {
        categoryEl.classList.add("is-valid");
    }
    if (colorEl.value.trim() === "") {
        colorEl.classList.add("is-invalid");
        isValid = false;
    } else {
        colorEl.classList.add("is-valid");
    }
    if (imageEl.value.trim() === "") {
        imageEl.classList.add("is-invalid");
        isValid = false;
    } else {
        imageEl.classList.add("is-valid");
    }

    // Nếu form không hợp lệ, dừng xử lý
    if (!isValid) {
        return;
    }

    // Lấy giá trị từ các input
    const idVal = productIdEl.value;
    const name = nameEl.value;
    const price = parseFloat(priceEl.value);
    const category = categoryEl.value;
    const color = colorEl.value;
    const image = imageEl.value;

    if (editingProductId) {
        // Đang chỉnh sửa sản phẩm, tìm vị trí của sản phẩm trong mảng dựa trên editingProductId
        const index = products.findIndex(item => item.id === editingProductId);
        if (index !== -1) {
            products[index] = { id: editingProductId, name, price, category, color, image };
        }
    } else {
        // Thêm mới sản phẩm
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        products.push({ id: newId, name, price, category, color, image });
    }

    // Cập nhật danh sách sản phẩm
    displayProducts(currentPage, products);

    // Reset trạng thái sau khi lưu
    editingProductId = null;
    productIdEl.value = "";

    // Ẩn modal
    bootstrap.Modal.getInstance(modalEl).hide();
}




function editProduct(prodId) {
    openModal(true, prodId);
}

let selectedProductId = null;
let selectedAction = null;

function showModal(title, message, action) {
    selectedAction = action;
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;

    let modal = new bootstrap.Modal(document.getElementById("confirmModal"));
    modal.show()
}

function deleteProduct(idProduct) {
    selectedProductId = idProduct;
    showModal(
        "Xác nhận xóa sản phẩm",
        `Bạn có chắc chắn muốn xóa sản phẩm #${idProduct} không? `,
        "delete"
    );
}

function deleteProd(){
    products = products.filter(prod => prod.id !== selectedProductId);
    console.log("pro length: ", selectedProductId)
    selectedProductId = null;
    displayProducts(currentPage, products);
    let modal = bootstrap.Modal.getInstance(document.getElementById("confirmModal"));
    modal.hide();
}

document.getElementById("confirmAction").addEventListener("click", function () {
    if (selectedProductId !== null && selectedAction === "delete"){
        let productIndex = products.findIndex(pro => pro.id === selectedProductId);
        if (productIndex !== -1){
            pro
        }
    }
})

function filterProducts() {
    console.log("Check filter")
    const category = document.getElementById("filterCategory").value;
    const color = document.getElementById("filterColor").value;
    const maxPrice = document.getElementById("filterPrice").value;

    let filteredProducts = products.filter(i => {
        return (category === "" || i.category === category)
            && (color === "" || i.color === color)
            && (maxPrice === "" || i.price <= parseInt(maxPrice));
    })

    displayProducts(1, filterProducts);
}

document.addEventListener("DOMContentLoaded", displayProducts(1, products));