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
    birthDate DATE DEFAULT NULL,
    gender VARCHAR(10) DEFAULT NULL,
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

-- Thêm dữ liệu mẫu vào bảng Post
INSERT INTO post (title, content, category, authorId, date) VALUES
('Xu hướng thời trang mùa hè 2024', 'Khám phá những xu hướng thời trang nóng nhất cho mùa hè năm nay...', 'Fashion', 3, '2024-05-01 10:00:00'),
('Tips phối đồ công sở', 'Những gợi ý phối đồ chuyên nghiệp và thanh lịch cho dân văn phòng...', 'Tips', 3, '2024-05-02 14:30:00'),
('Bộ sưu tập mới nhất của cửa hàng', 'Giới thiệu những sản phẩm mới nhất đã có mặt tại cửa hàng...', 'News', 3, '2024-05-03 09:15:00'),
('Chương trình khuyến mãi tháng 5', 'Giảm giá đặc biệt lên đến 50% cho nhiều mặt hàng...', 'Promotion', 3, '2024-05-04 11:45:00'),
('Hướng dẫn chọn size quần áo chuẩn', 'Chi tiết cách đo và chọn size quần áo phù hợp...', 'Guide', 3, '2024-05-04 16:20:00');

-- Thêm dữ liệu mẫu vào bảng Post
INSERT INTO post (title, content, category, authorId) VALUES
('Xu hướng thời trang mùa hè 2025', '<p>Mùa hè năm nay chứng kiến sự trở lại của những items retro...</p>', 'Fashion', 1),
('Cách chọn size quần áo chuẩn', '<p>Để chọn được size quần áo phù hợp, bạn cần lưu ý những điểm sau...</p>', 'Guide', 1),
('Khuyến mãi tháng 5 - Giảm giá đến 50%', '<p>Chương trình khuyến mãi lớn nhất trong năm với nhiều ưu đãi hấp dẫn...</p>', 'Promotion', 1),
('Top 5 phong cách thời trang được ưa chuộng', '<p>Minimalism tiếp tục dẫn đầu xu hướng với những thiết kế đơn giản...</p>', 'Fashion', 1),
('Tips phối đồ cho người mới bắt đầu', '<p>Những nguyên tắc cơ bản khi phối đồ mà bạn nên biết...</p>', 'Tips', 1);

-- Insert sample data into post table
INSERT INTO post (title, content, category, authorId) VALUES
('Welcome to Our New Store!', 'We are excited to announce the grand opening of our online store. Check out our amazing products and special offers!', 'announcement', 1),
('Summer Collection 2025', 'Discover our latest summer collection featuring trendy designs and comfortable fabrics perfect for the season.', 'products', 1),
('Shopping Guide: How to Choose the Perfect Outfit', 'Learn expert tips on selecting outfits that match your style and body type. Read our comprehensive guide.', 'guide', 1),
('Customer Appreciation Week', 'Join us for a week of special discounts and exclusive offers as we celebrate our valued customers.', 'promotion', 1),
('Fashion Trends 2025', 'Stay ahead of the curve with our forecast of the hottest fashion trends for 2025.', 'fashion', 1),
('Store Maintenance Notice', 'Our website will undergo scheduled maintenance this weekend. We apologize for any inconvenience.', 'announcement', 1),
('New Arrivals: Premium Collection', 'Explore our newly arrived premium collection featuring luxury items and designer collaborations.', 'products', 1),
('Holiday Shopping Tips', 'Make your holiday shopping stress-free with our expert shopping tips and gift guides.', 'guide', 1),
('Black Friday Sale Preview', 'Get ready for our biggest sale of the year! Preview the amazing deals coming this Black Friday.', 'promotion', 1),
('Sustainable Fashion Initiative', 'Learn about our commitment to sustainability and eco-friendly fashion choices.', 'announcement', 1);




-- Cập nhật các bản ghi hiện có với giá trị mặc định cho avatar nếu cần
UPDATE user SET avatar = 'https://via.placeholder.com/100' WHERE avatar IS NULL;

SELECT * FROM user;
SELECT * FROM purchased_order;
SELECT * FROM cart_contain_product;