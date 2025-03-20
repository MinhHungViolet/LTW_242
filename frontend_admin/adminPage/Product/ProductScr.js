let products = [
    { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 4, name: "Áo sơ mi 4", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
];

function renderProducts() {
    const tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";
    products.forEach((product, index) => {
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
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Chỉnh sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function openModal(isEdit = false, index = null) {
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    document.getElementById("modalTitle").textContent = isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";

    if (isEdit && index !== null) {
        document.getElementById("productId").value = products[index].id;
        document.getElementById("productName").value = products[index].name;
        document.getElementById("productPrice").value = products[index].price;
        document.getElementById("productCategory").value = products[index].category;
        document.getElementById("productColor").value = products[index].color;
        document.getElementById("productImage").value = products[index].image;
        document.getElementById("previewImage").src = products[index].image;
        document.getElementById("productModal").dataset.index = index;
    } else {
        document.getElementById("productId").value = "";
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productColor").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("previewImage").src = "https://via.placeholder.com/100";
        document.getElementById("productModal").dataset.index = "";
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
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const color = document.getElementById("productColor").value;
    const image = document.getElementById("productImage").value;
    const index = document.getElementById("productModal").dataset.index;

    if (index) {
        products[index] = { id, name, price, category, color, image };
    } else {
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        products.push({ id: newId, name, price, category, color, image });
    }

    renderProducts();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
}

function editProduct(index) {
    openModal(true, index);
}

function deleteProduct(index) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        products.splice(index, 1);
        renderProducts();
    }
}

function filterProducts() {
    
    const category = document.getElementById("filterCategory").value;
    const color = document.getElementById("filterColor").value;
    const maxPrice = document.getElementById("filterPrice").value;
    let filtered = products.filter(product => {
        return (category === "" || product.category === category) &&
               (color === "" || product.color === color) &&
               (maxPrice === "" || product.price <= parseInt(maxPrice));
    });
    console.log(filtered)

    renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", renderProducts);