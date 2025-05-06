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

-- Insert sample data into post table (for blog/news section)
INSERT INTO post (title, content, date, category, authorId) VALUES 
('Xu hướng thời trang mùa hè năm 2025', 'Mùa hè năm 2025 đang đến gần với nhiều xu hướng thời trang mới mẻ và thú vị. Các nhà thiết kế hàng đầu đang giới thiệu những bộ sưu tập với tông màu sáng, họa tiết nhiệt đới và chất liệu nhẹ, thoáng mát. Đặc biệt, các mẫu áo sơ mi oversize, quần shorts linen và váy maxi là những món đồ không thể thiếu trong tủ đồ mùa hè năm nay. Ngoài ra, xu hướng thời trang bền vững cũng đang được ưa chuộng khi nhiều thương hiệu chú trọng đến việc sử dụng các nguyên liệu thân thiện với môi trường và quy trình sản xuất có trách nhiệm.', NOW(), 'Thời trang', 3),

('Cách phối đồ cho người mới bắt đầu', 'Phối đồ là một kỹ năng quan trọng giúp bạn tạo nên phong cách riêng. Đối với người mới bắt đầu, có một số nguyên tắc cơ bản cần nhớ. Trước tiên, hãy chọn những món đồ cơ bản với màu sắc trung tính như đen, trắng, be, xám - chúng dễ dàng kết hợp với nhau. Thứ hai, hãy chọn quần áo phù hợp với vóc dáng của bạn. Thứ ba, đừng ngần ngại thử nghiệm các phụ kiện như thắt lưng, túi xách, giày dép để làm nổi bật trang phục. Cuối cùng, hãy nhớ rằng sự tự tin là phụ kiện quan trọng nhất trong bất kỳ set đồ nào.', NOW() - INTERVAL 2 DAY, 'Thời trang', 3),

('Top 10 phụ kiện không thể thiếu trong mùa hè', 'Mùa hè là thời điểm tuyệt vời để làm mới phong cách của bạn với những phụ kiện thời trang bắt mắt. Dưới đây là top 10 phụ kiện không thể thiếu trong mùa hè này: 1) Kính râm thời trang không chỉ bảo vệ mắt mà còn là điểm nhấn phong cách; 2) Mũ rộng vành giúp che nắng hiệu quả; 3) Túi xách cói mang đến vẻ đẹp mộc mạc, tự nhiên; 4) Sandals đế bệt thoải mái cho những chuyến du lịch; 5) Vòng tay nhiều màu sắc tạo điểm nhấn cho trang phục; 6) Khăn bandana đa năng; 7) Dây chuyền vỏ sò điệu đà; 8) Nón bucket năng động; 9) Túi đeo hông tiện lợi; 10) Đồng hồ chống nước cho các hoạt động ngoài trời.', NOW() - INTERVAL 5 DAY, 'Phụ kiện', 3),

('Chăm sóc quần áo đúng cách để kéo dài tuổi thọ', 'Việc chăm sóc quần áo đúng cách không chỉ giúp bạn tiết kiệm chi phí mà còn góp phần bảo vệ môi trường. Đầu tiên, hãy luôn đọc kỹ nhãn hướng dẫn giặt ủi trên quần áo. Phân loại quần áo theo màu sắc và chất liệu trước khi giặt. Với quần jean, nên lộn trái và giặt trong nước lạnh để giữ màu. Đối với áo len, tốt nhất là giặt tay hoặc sử dụng chế độ giặt nhẹ nhàng. Tránh sử dụng máy sấy với đồ dễ co rút như len, lụa. Cuối cùng, cất giữ quần áo đúng cách - treo áo khoác, áo sơ mi và gấp gọn áo thun, đồ len để tránh bị giãn, biến dạng.', NOW() - INTERVAL 7 DAY, 'Mẹo vặt', 3),

('Sản phẩm mới nhất của chúng tôi đã lên kệ', 'Chúng tôi vui mừng thông báo bộ sưu tập mới nhất đã chính thức lên kệ tại tất cả các cửa hàng trên toàn quốc và website. Bộ sưu tập lần này được thiết kế với cảm hứng từ văn hóa đường phố, mang đến những sản phẩm vừa thời thượng vừa thoải mái cho người sử dụng. Đặc biệt, chúng tôi đã ứng dụng công nghệ vải mới nhất giúp thoáng khí, thấm hút mồ hôi tốt, phù hợp với khí hậu nhiệt đới. Hơn nữa, với mỗi sản phẩm được bán ra, chúng tôi sẽ đóng góp 5% doanh thu cho các dự án bảo vệ môi trường. Hãy đến cửa hàng gần nhất hoặc truy cập website để khám phá và sở hữu những sản phẩm mới nhất của chúng tôi!', NOW() - INTERVAL 10 DAY, 'Sản phẩm', 3);

-- Update the numberComment field for each post with random values
UPDATE post SET numberComment = FLOOR(RAND() * 10) WHERE numberComment = 0;

-- Insert sample comments for the posts
INSERT INTO comment (userId, postId, content, date) VALUES
-- Comments for the first post (Xu hướng thời trang mùa hè năm 2025)
(1, (SELECT postId FROM post WHERE title LIKE 'Xu hướng thời trang mùa hè%' LIMIT 1), 
   'Bài viết rất hữu ích! Tôi đang cần tìm những gợi ý về trang phục cho mùa hè sắp tới.', 
   NOW() - INTERVAL 1 DAY),
(2, (SELECT postId FROM post WHERE title LIKE 'Xu hướng thời trang mùa hè%' LIMIT 1), 
   'Tôi đặc biệt thích xu hướng thời trang bền vững được đề cập trong bài. Các thương hiệu nào đang đi đầu trong lĩnh vực này vậy?', 
   NOW() - INTERVAL 2 DAY),
(4, (SELECT postId FROM post WHERE title LIKE 'Xu hướng thời trang mùa hè%' LIMIT 1), 
   'Váy maxi là item yêu thích của tôi mỗi mùa hè. Tôi sẽ chắc chắn mua thêm vài chiếc cho năm nay!', 
   NOW() - INTERVAL 3 DAY),

-- Comments for the second post (Cách phối đồ cho người mới bắt đầu)
(5, (SELECT postId FROM post WHERE title LIKE 'Cách phối đồ cho người%' LIMIT 1), 
   'Những tip cơ bản trong bài viết rất dễ áp dụng. Cảm ơn tác giả đã chia sẻ!', 
   NOW() - INTERVAL 4 DAY),
(1, (SELECT postId FROM post WHERE title LIKE 'Cách phối đồ cho người%' LIMIT 1), 
   'Tôi luôn gặp khó khăn khi phối màu sắc. Bài viết này đã giúp tôi hiểu rõ hơn về cách chọn tông màu phù hợp.', 
   NOW() - INTERVAL 5 DAY),
(3, (SELECT postId FROM post WHERE title LIKE 'Cách phối đồ cho người%' LIMIT 1), 
   'Tôi hoàn toàn đồng ý rằng sự tự tin là phụ kiện quan trọng nhất. Điều này thực sự đúng!', 
   NOW() - INTERVAL 6 DAY),

-- Comments for the third post (Top 10 phụ kiện không thể thiếu trong mùa hè)
(2, (SELECT postId FROM post WHERE title LIKE 'Top 10 phụ kiện%' LIMIT 1), 
   'Kính râm và mũ rộng vành là hai món phụ kiện không thể thiếu của tôi mỗi mùa hè. Bảo vệ da khỏi ánh nắng mặt trời rất quan trọng!', 
   NOW() - INTERVAL 7 DAY),
(4, (SELECT postId FROM post WHERE title LIKE 'Top 10 phụ kiện%' LIMIT 1), 
   'Tôi cũng thích túi xách cói. Trông rất hợp với trang phục mùa hè và rất bền nữa.', 
   NOW() - INTERVAL 8 DAY),
(5, (SELECT postId FROM post WHERE title LIKE 'Top 10 phụ kiện%' LIMIT 1), 
   'Bạn có thể giới thiệu một vài thương hiệu đồng hồ chống nước tốt không? Tôi đang tìm một chiếc cho chuyến đi biển sắp tới.', 
   NOW() - INTERVAL 9 DAY),
(1, (SELECT postId FROM post WHERE title LIKE 'Top 10 phụ kiện%' LIMIT 1), 
   'Danh sách rất đầy đủ! Tôi sẽ bổ sung thêm kẹp tóc nhiều màu sắc vào danh sách này nữa.', 
   NOW() - INTERVAL 10 DAY),

-- Comments for the fourth post (Chăm sóc quần áo đúng cách để kéo dài tuổi thọ)
(3, (SELECT postId FROM post WHERE title LIKE 'Chăm sóc quần áo%' LIMIT 1), 
   'Những lời khuyên này rất thiết thực. Tôi đã áp dụng cách giặt quần jean trong nước lạnh và màu sắc của nó giữ được rất lâu.', 
   NOW() - INTERVAL 11 DAY),
(2, (SELECT postId FROM post WHERE title LIKE 'Chăm sóc quần áo%' LIMIT 1), 
   'Tôi đặc biệt đồng ý với việc đọc kỹ nhãn hướng dẫn giặt ủi. Rất nhiều người bỏ qua điều này nhưng nó thực sự quan trọng.', 
   NOW() - INTERVAL 12 DAY),
(5, (SELECT postId FROM post WHERE title LIKE 'Chăm sóc quần áo%' LIMIT 1), 
   'Bạn có mẹo nào để giặt áo len không bị giãn không? Tôi luôn gặp vấn đề với việc này.', 
   NOW() - INTERVAL 13 DAY),
(4, (SELECT postId FROM post WHERE title LIKE 'Chăm sóc quần áo%' LIMIT 1), 
   'Cảm ơn vì bài viết hữu ích! Tôi cũng muốn thêm rằng nên giặt quần áo mới trước khi mặc lần đầu.', 
   NOW() - INTERVAL 14 DAY),

-- Comments for the fifth post (Sản phẩm mới nhất của chúng tôi đã lên kệ)
(1, (SELECT postId FROM post WHERE title LIKE 'Sản phẩm mới nhất%' LIMIT 1), 
   'Tôi rất ấn tượng với việc đóng góp 5% doanh thu cho các dự án bảo vệ môi trường. Thật là một sáng kiến tuyệt vời!', 
   NOW() - INTERVAL 15 DAY),
(2, (SELECT postId FROM post WHERE title LIKE 'Sản phẩm mới nhất%' LIMIT 1), 
   'Tôi đã mua một vài sản phẩm từ bộ sưu tập này và chất lượng vải thực sự rất tốt. Thoáng khí như mô tả!', 
   NOW() - INTERVAL 16 DAY),
(3, (SELECT postId FROM post WHERE title LIKE 'Sản phẩm mới nhất%' LIMIT 1), 
   'Thiết kế lấy cảm hứng từ văn hóa đường phố thực sự rất ấn tượng. Tôi yêu phong cách này!', 
   NOW() - INTERVAL 17 DAY),
(4, (SELECT postId FROM post WHERE title LIKE 'Sản phẩm mới nhất%' LIMIT 1), 
   'Cửa hàng ở khu vực Quận 1 có mở cửa vào Chủ Nhật không vậy?', 
   NOW() - INTERVAL 18 DAY),
(5, (SELECT postId FROM post WHERE title LIKE 'Sản phẩm mới nhất%' LIMIT 1), 
   'Sản phẩm có ship ra nước ngoài không? Tôi rất muốn mua tặng người thân ở nước ngoài.', 
   NOW() - INTERVAL 19 DAY);

-- Update the numberComment field for each post based on actual comment count
UPDATE post p
SET numberComment = (SELECT COUNT(*) FROM comment c WHERE c.postId = p.postId);