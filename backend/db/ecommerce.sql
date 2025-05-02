-- CREATE DATABASE ecommerce_db;
USE ecommerce_db;
CREATE TABLE user (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE product (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    number INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    size VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_contain_product (
    cartId INT NOT NULL,
    productId INT NOT NULL,
    number INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cartId, productId),
    FOREIGN KEY (cartId) REFERENCES Cart(cartId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
);

CREATE TABLE purchased_order (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    address TEXT NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE purchased_order_contain_product (
    orderId INT NOT NULL,
    productId INT NOT NULL,
    number INT NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(10,2) NOT NULL, -- Store price at time of purchase
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES Purchased_order(orderId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
);

CREATE TABLE qna (
    questionId INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT,
    customerId INT NOT NULL,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP NULL,
    FOREIGN KEY (customerId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE post (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50),
    authorId INT NOT NULL,
    numberComment INT DEFAULT 0,
    FOREIGN KEY (authorId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE comment (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    postId INT NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Post(postId) ON DELETE CASCADE
);

CREATE TABLE infor_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    image VARCHAR(255)
);

CREATE TABLE introduction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    content1 TEXT,
    title1 VARCHAR(255),
    content2 TEXT,
    title2 VARCHAR(255),
    content3 TEXT,
    title3 VARCHAR(255)
);

-- Thêm dữ liệu vào bảng User
INSERT INTO user (name, email, password, role, phone, avatar) VALUES
('Nguyễn Văn A', 'nguyenvana@example.com', 'hashed_password_1', 'customer', '0912345678', 'avatar1.jpg'),
('Trần Thị B', 'tranthib@example.com', 'hashed_password_2', 'customer', '0912345679', 'avatar2.jpg'),
('Lê Văn C', 'levanc@example.com', 'hashed_password_3', 'admin', '0912345680', 'avatar3.jpg'),
('Phạm Thị D', 'phamthid@example.com', 'hashed_password_4', 'customer', '0912345681', 'avatar4.jpg'),
('Hoàng Văn E', 'hoangvane@example.com', 'hashed_password_5', 'customer', '0912345682', 'avatar5.jpg');

-- Thêm dữ liệu vào bảng Cart
INSERT INTO cart (userId) VALUES
(1), (2), (3), (4), (5);

-- Thêm dữ liệu vào bảng Product
INSERT INTO product (name, number, price, image, category, color, description, size) VALUES
('Áo thun nam', 100, 150000, 'aothun1.jpg', 'Áo', 'Trắng', 'Áo thun cotton cao cấp', 'M'),
('Quần jean nữ', 50, 350000, 'quanjean1.jpg', 'Quần', 'Xanh', 'Quần jean slimfit', 'S'),
('Giày thể thao', 30, 500000, 'giaythethao1.jpg', 'Giày', 'Đen', 'Giày chạy bộ đế êm', '40'),
('Túi xách da', 20, 450000, 'tuixach1.jpg', 'Phụ kiện', 'Nâu', 'Túi xách da bò thật', 'One size'),
('Mũ lưỡi trai', 80, 120000, 'muluitrai1.jpg', 'Phụ kiện', 'Đen', 'Mũ lưỡi trai thời trang', 'One size');

-- Thêm dữ liệu vào bảng Cart_contain_product
INSERT INTO cart_contain_product (cartId, productId, number) VALUES
(1, 1, 2), (1, 3, 1),
(2, 2, 1), (2, 4, 1),
(3, 5, 3),
(4, 1, 1), (4, 2, 1),
(5, 3, 2);

-- Thêm dữ liệu vào bảng Purchased_order
INSERT INTO purchased_order (address, totalPrice, method, userId, status) VALUES
('123 Đường ABC, Quận 1, TP.HCM', 800000, 'COD', 1, 'delivered'),
('456 Đường XYZ, Quận 2, TP.HCM', 450000, 'Momo', 2, 'shipped'),
('789 Đường DEF, Quận 3, TP.HCM', 360000, 'Banking', 3, 'processing'),
('321 Đường GHI, Quận 4, TP.HCM', 500000, 'COD', 4, 'pending');
SELECT * FROM user;
SELECT * FROM purchased_order;
SELECT * FROM cart_contain_product;