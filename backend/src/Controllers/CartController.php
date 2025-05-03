<?php
// src/Controllers/CartController.php

// use PDO;
// use PDOException;

class CartController {

    private $db;

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi kết nối CSDL trong CartController.']);
            exit();
        }
        $this->db = $pdo;
    }

    // Hàm tiện ích gửi response
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($data);
    }

    /**
     * Lấy (hoặc tạo nếu chưa có) cartId cho user
     * @param int $userId ID của người dùng
     * @return int|null cartId nếu thành công, null nếu lỗi
     */
    private function getUserCartId(int $userId): ?int {
        try {
            // Thử tìm cartId hiện có
            $sqlFind = "SELECT cartId FROM cart WHERE userId = ?";
            $stmtFind = $this->db->prepare($sqlFind);
            $stmtFind->execute([$userId]);
            $cart = $stmtFind->fetch(PDO::FETCH_ASSOC);

            if ($cart) {
                return (int)$cart['cartId'];
            } else {
                // Nếu chưa có, tạo cart mới
                $sqlCreate = "INSERT INTO cart (userId, created_at) VALUES (?, NOW())";
                $stmtCreate = $this->db->prepare($sqlCreate);
                if ($stmtCreate->execute([$userId])) {
                    return (int)$this->db->lastInsertId();
                } else {
                    return null; // Lỗi khi tạo cart
                }
            }
        } catch (PDOException $e) {
            error_log("API Error (CartController::getUserCartId for user {$userId}): " . $e->getMessage());
            return null; // Lỗi DB
        }
    }


    /**
     * Xử lý yêu cầu POST /cart/items
     * Thêm sản phẩm vào giỏ hàng của người dùng đang đăng nhập
     * @param object $userPayload Dữ liệu user từ token đã giải mã
     */
    public function addItem(object $userPayload): void {
        $userId = $userPayload->userId; // Lấy userId từ token

        // 1. Lấy dữ liệu từ request body
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        $productId = $inputData['productId'] ?? null;
        $quantity = $inputData['quantity'] ?? 1; // Mặc định số lượng là 1 nếu không gửi

        // 2. Validate dữ liệu cơ bản
        if (empty($productId) || !is_numeric($productId) || $productId <= 0) {
            $this->sendResponse(400, ['error' => 'productId không hợp lệ.']);
            return;
        }
        if (!is_numeric($quantity) || $quantity <= 0) {
            $this->sendResponse(400, ['error' => 'Số lượng (quantity) không hợp lệ.']);
            return;
        }
        $productId = (int)$productId;
        $quantity = (int)$quantity;

        try {
            // Bắt đầu transaction để đảm bảo tính nhất quán (đặc biệt khi cần tạo cart)
            $this->db->beginTransaction();

            // 3. Lấy cartId của user (tạo nếu chưa có)
            $cartId = $this->getUserCartId($userId);
            if ($cartId === null) {
                $this->db->rollBack();
                $this->sendResponse(500, ['error' => 'Không thể lấy hoặc tạo giỏ hàng cho người dùng.']);
                return;
            }

            // 4. Kiểm tra sản phẩm tồn tại và tồn kho
            $sqlCheckProduct = "SELECT name, number AS stock_quantity FROM product WHERE productId = ?";
            $stmtCheckProduct = $this->db->prepare($sqlCheckProduct);
            $stmtCheckProduct->execute([$productId]);
            $product = $stmtCheckProduct->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                $this->db->rollBack();
                $this->sendResponse(404, ['error' => "Sản phẩm với ID {$productId} không tồn tại."]);
                return;
            }
            $productName = $product['name']; // Lấy tên để hiển thị thông báo
            $stockQuantity = (int)$product['stock_quantity'];

            // 5. Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            $sqlCheckCartItem = "SELECT number FROM cart_contain_product WHERE cartId = ? AND productId = ?";
            $stmtCheckCartItem = $this->db->prepare($sqlCheckCartItem);
            $stmtCheckCartItem->execute([$cartId, $productId]);
            $existingCartItem = $stmtCheckCartItem->fetch(PDO::FETCH_ASSOC);

            $newQuantity = $quantity; // Số lượng cuối cùng sẽ lưu vào DB
            if ($existingCartItem) {
                // Nếu đã có, cộng dồn số lượng
                $newQuantity += (int)$existingCartItem['number'];
            }

            // 6. Kiểm tra lại tồn kho với số lượng MỚI
            if ($stockQuantity < $newQuantity) {
                $this->db->rollBack();
                $this->sendResponse(400, [
                    'error' => "Số lượng tồn kho không đủ cho sản phẩm '{$productName}'. Chỉ còn {$stockQuantity} sản phẩm.",
                    'stock_available' => $stockQuantity
                ]);
                return;
            }

            // 7. Thêm mới hoặc cập nhật giỏ hàng
            if ($existingCartItem) {
                // Cập nhật số lượng
                $sqlUpdateCart = "UPDATE cart_contain_product SET number = ? WHERE cartId = ? AND productId = ?";
                $stmtUpdateCart = $this->db->prepare($sqlUpdateCart);
                $success = $stmtUpdateCart->execute([$newQuantity, $cartId, $productId]);
                 $statusCode = 200; // OK vì là update
                 $message = "Đã cập nhật số lượng sản phẩm '{$productName}' trong giỏ hàng.";
            } else {
                // Thêm mới vào giỏ
                $sqlInsertCart = "INSERT INTO cart_contain_product (cartId, productId, number, added_at) VALUES (?, ?, ?, NOW())";
                $stmtInsertCart = $this->db->prepare($sqlInsertCart);
                $success = $stmtInsertCart->execute([$cartId, $productId, $newQuantity]);
                $statusCode = 201; // Created vì là thêm mới
                $message = "Đã thêm sản phẩm '{$productName}' vào giỏ hàng.";
            }

            if ($success) {
                $this->db->commit(); // Hoàn tất transaction thành công
                $this->sendResponse($statusCode, [
                    'message' => $message,
                    'cartId' => $cartId,
                    'productId' => $productId,
                    'newQuantity' => $newQuantity
                ]);
            } else {
                $this->db->rollBack();
                $this->sendResponse(500, ['error' => 'Không thể cập nhật hoặc thêm sản phẩm vào giỏ hàng.']);
            }

        } catch (PDOException $e) {
            // Rollback nếu có lỗi DB
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log("API Error (CartController::addItem user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xử lý giỏ hàng.']);
        }
    }

    public function getCart(object $userPayload): void {
        $userId = $userPayload->userId;
    
        try {
            // 1. Lấy cartId của user (không tạo mới nếu chưa có)
            $cartId = $this->getUserCartId($userId);
    
            // Nếu user chưa từng thêm gì vào giỏ => chưa có cartId => trả về giỏ hàng rỗng
            if ($cartId === null) {
                $this->sendResponse(200, ['cartId' => null, 'items' => [], 'subtotal' => 0]);
                return;
            }
    
            // 2. Lấy các sản phẩm trong giỏ hàng và thông tin chi tiết sản phẩm
            $sqlGetItems = "SELECT
                                ccp.productId,
                                ccp.number AS quantity,
                                p.name,
                                p.price,
                                p.image
                                -- Thêm các trường khác của product nếu cần hiển thị trong giỏ hàng
                            FROM cart_contain_product ccp
                            JOIN product p ON ccp.productId = p.productId
                            WHERE ccp.cartId = ?
                            ORDER BY ccp.added_at DESC"; // Sắp xếp theo thời gian thêm gần nhất
    
            $stmtGetItems = $this->db->prepare($sqlGetItems);
            $stmtGetItems->execute([$cartId]);
            $items = $stmtGetItems->fetchAll(PDO::FETCH_ASSOC);
    
            // 3. (Tùy chọn) Tính tổng tiền tạm tính của giỏ hàng
            $subtotal = 0;
            foreach ($items as $item) {
                // Chuyển đổi kiểu dữ liệu cho chắc chắn
                $price = (float) $item['price'];
                $quantity = (int) $item['quantity'];
                $subtotal += $price * $quantity;
            }
    
            // 4. Trả về kết quả
            $this->sendResponse(200, [
                'cartId' => $cartId,
                'items' => $items, // Mảng các sản phẩm trong giỏ
                'subtotal' => round($subtotal, 2) // Làm tròn tổng tiền
            ]);
    
        } catch (PDOException $e) {
            error_log("API Error (CartController::getCart user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy thông tin giỏ hàng.']);
        }
    }

    // Thêm các hàm khác cho Cart sau này (vd: getCart, updateQuantity, removeItem...)

} // Kết thúc class CartController
?>