<?php
// src/Controllers/OrderController.php

// use PDO;
// use PDOException;

class OrderController {

    private $db;

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi kết nối CSDL trong OrderController.']);
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

    // Hàm lấy cartId (có thể copy từ CartController hoặc tạo BaseController)
    private function getUserCartId(int $userId): ?int {
        try {
            $sqlFind = "SELECT cartId FROM cart WHERE userId = ?";
            $stmtFind = $this->db->prepare($sqlFind);
            $stmtFind->execute([$userId]);
            $cart = $stmtFind->fetch(PDO::FETCH_ASSOC);
            return $cart ? (int)$cart['cartId'] : null; // Chỉ lấy, không tạo ở đây
        } catch (PDOException $e) {
            error_log("API Error (OrderController::getUserCartId for user {$userId}): " . $e->getMessage());
            return null;
        }
    }


    /**
     * Xử lý yêu cầu POST /orders
     * Tạo đơn hàng mới từ giỏ hàng của người dùng
     * @param object $userPayload Dữ liệu user từ token
     */
    public function createOrder(object $userPayload): void {
        $userId = $userPayload->userId;

        // 1. Lấy dữ liệu địa chỉ, phương thức thanh toán từ request body
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        $address = $inputData['address'] ?? null;
        $method = $inputData['method'] ?? null;

        // 2. Validate input cơ bản
        if (empty($address) || empty($method)) {
            $this->sendResponse(400, ['error' => 'Thiếu địa chỉ nhận hàng (address) hoặc phương thức thanh toán (method).']);
            return;
        }
        // Thêm validation khác cho address, method nếu cần

        try {
            // Bắt đầu Transaction - Rất quan trọng cho việc đặt hàng
            $this->db->beginTransaction();

            // 3. Lấy cartId của user
            $cartId = $this->getUserCartId($userId);
            if ($cartId === null) {
                $this->db->rollBack(); // Không cần rollback vì chưa làm gì, nhưng để cho an toàn
                $this->sendResponse(404, ['error' => 'Không tìm thấy giỏ hàng cho người dùng này.']);
                return;
            }

            // 4. Lấy các sản phẩm trong giỏ hàng và thông tin sản phẩm tương ứng
            // Dùng JOIN để lấy cả giá và tồn kho hiện tại
            // Thêm FOR UPDATE để khóa các dòng sản phẩm và giỏ hàng, tránh race condition khi nhiều người đặt cùng lúc
            // Lưu ý: FOR UPDATE có thể ảnh hưởng hiệu năng, cân nhắc dùng nếu hệ thống có tải cao.
            $sqlGetCartItems = "SELECT
                                    ccp.productId,
                                    ccp.number AS quantity_in_cart,
                                    p.name AS product_name,
                                    p.price AS current_price,
                                    p.number AS stock_quantity
                                FROM cart_contain_product ccp
                                JOIN product p ON ccp.productId = p.productId
                                WHERE ccp.cartId = ? FOR UPDATE"; // Khóa dòng để kiểm tra tồn kho chính xác
            $stmtGetCartItems = $this->db->prepare($sqlGetCartItems);
            $stmtGetCartItems->execute([$cartId]);
            $cartItems = $stmtGetCartItems->fetchAll(PDO::FETCH_ASSOC);

            // 5. Kiểm tra giỏ hàng có trống không
            if (empty($cartItems)) {
                 $this->db->rollBack();
                 $this->sendResponse(400, ['error' => 'Giỏ hàng trống, không thể đặt hàng.']);
                 return;
            }

            // 6. Kiểm tra lại tồn kho và tính tổng tiền
            $totalPrice = 0;
            $itemsForOrder = []; // Lưu lại thông tin cần thiết để insert vào order details

            foreach ($cartItems as $item) {
                $productId = $item['productId'];
                $productName = $item['product_name'];
                $quantityInCart = (int)$item['quantity_in_cart'];
                $stockQuantity = (int)$item['stock_quantity'];
                $currentPrice = (float)$item['current_price'];

                // Kiểm tra tồn kho
                if ($stockQuantity < $quantityInCart) {
                    $this->db->rollBack();
                    $this->sendResponse(409, [ // 409 Conflict vì trạng thái đã thay đổi
                        'error' => "Sản phẩm '{$productName}' (ID: {$productId}) không đủ số lượng tồn kho (cần {$quantityInCart}, còn {$stockQuantity}). Vui lòng cập nhật giỏ hàng.",
                        'productId' => $productId,
                        'stock_available' => $stockQuantity
                    ]);
                    return;
                }

                // Tính tổng tiền
                $totalPrice += $currentPrice * $quantityInCart;

                // Lưu thông tin để insert vào bảng chi tiết đơn hàng
                $itemsForOrder[] = [
                    'productId' => $productId,
                    'quantity' => $quantityInCart,
                    'price_at_purchase' => $currentPrice // Lưu giá tại thời điểm mua
                ];
            }

            // 7. Tạo đơn hàng mới trong bảng purchased_order
            $sqlCreateOrder = "INSERT INTO purchased_order (userId, address, totalPrice, method, date, status)
                               VALUES (?, ?, ?, ?, NOW(), 'pending')"; // Mặc định status là pending
            $stmtCreateOrder = $this->db->prepare($sqlCreateOrder);
            $successOrder = $stmtCreateOrder->execute([
                $userId,
                $address,
                $totalPrice,
                $method
            ]);

            if (!$successOrder) {
                 $this->db->rollBack();
                 $this->sendResponse(500, ['error' => 'Không thể tạo bản ghi đơn hàng chính.']);
                 return;
            }
            $orderId = $this->db->lastInsertId(); // Lấy ID đơn hàng vừa tạo

            // 8. Thêm các sản phẩm vào bảng purchased_order_contain_product và Cập nhật tồn kho
            $sqlInsertOrderDetail = "INSERT INTO purchased_order_contain_product (orderId, productId, number, price_at_purchase) VALUES (?, ?, ?, ?)";
            $stmtInsertOrderDetail = $this->db->prepare($sqlInsertOrderDetail);

            $sqlUpdateStock = "UPDATE product SET number = number - ? WHERE productId = ? AND number >= ?"; // Thêm AND number >= ? để tránh âm kho
            $stmtUpdateStock = $this->db->prepare($sqlUpdateStock);

            foreach ($itemsForOrder as $orderItem) {
                // Thêm chi tiết đơn hàng
                $successDetail = $stmtInsertOrderDetail->execute([
                    $orderId,
                    $orderItem['productId'],
                    $orderItem['quantity'],
                    $orderItem['price_at_purchase']
                ]);
                if (!$successDetail) {
                     $this->db->rollBack();
                     $this->sendResponse(500, ['error' => "Không thể thêm chi tiết sản phẩm ID {$orderItem['productId']} vào đơn hàng."]);
                     return;
                }

                // Cập nhật tồn kho
                $successStock = $stmtUpdateStock->execute([
                    $orderItem['quantity'], // Số lượng giảm
                    $orderItem['productId'],
                    $orderItem['quantity'] // Đảm bảo tồn kho >= số lượng cần giảm
                ]);
                // Kiểm tra xem có đúng 1 dòng được cập nhật không (đảm bảo không có lỗi logic)
                if (!$successStock || $stmtUpdateStock->rowCount() !== 1) {
                     $this->db->rollBack();
                     $this->sendResponse(500, ['error' => "Không thể cập nhật tồn kho cho sản phẩm ID {$orderItem['productId']}. Có thể do thay đổi dữ liệu đồng thời."]);
                     return;
                }
            }

            // 9. Xóa các sản phẩm khỏi giỏ hàng tạm (cart_contain_product)
            $sqlDeleteCartItems = "DELETE FROM cart_contain_product WHERE cartId = ?";
            $stmtDeleteCartItems = $this->db->prepare($sqlDeleteCartItems);
            $stmtDeleteCartItems->execute([$cartId]);
            // Có thể cân nhắc xóa cả record trong bảng `cart` nếu muốn, nhưng để lại cũng không sao

            // 10. Nếu mọi thứ thành công -> Commit Transaction
            $this->db->commit();

            // 11. Trả về thông tin đơn hàng vừa tạo
            $this->sendResponse(201, [ // 201 Created
                'message' => 'Đặt hàng thành công!',
                'orderId' => (int)$orderId,
                'totalPrice' => $totalPrice,
                'shipping_address' => $address,
                'payment_method' => $method
            ]);

        } catch (PDOException $e) {
            // Rollback nếu có lỗi DB trong quá trình transaction
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log("API Error (OrderController::createOrder user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xử lý đơn hàng.']);
        }
    }

    public function getOrderHistory(object $userPayload): void {
        $userId = $userPayload->userId;
    
        try {
            // Lấy các thông tin chính của đơn hàng, sắp xếp theo ngày gần nhất
            $sql = "SELECT orderId, address, totalPrice, method, date, status
                    FROM purchased_order
                    WHERE userId = ?
                    ORDER BY date DESC";
    
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$userId]);
    
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Trả về danh sách đơn hàng (có thể là mảng rỗng nếu chưa có đơn nào)
            $this->sendResponse(200, $orders);
    
        } catch (PDOException $e) {
            error_log("API Error (OrderController::getOrderHistory user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy lịch sử đơn hàng.']);
        }
    }

    public function getOrderDetail(object $userPayload, int $orderId): void {
        $userId = $userPayload->userId; // Lấy userId của người dùng đang đăng nhập
    
        // Validate orderId cơ bản
        if ($orderId <= 0) {
            $this->sendResponse(400, ['error' => 'ID đơn hàng không hợp lệ.']);
            return;
        }
    
        try {
            // 1. Lấy thông tin đơn hàng chính và kiểm tra xem có đúng là của user này không
            $sqlOrder = "SELECT orderId, address, totalPrice, method, date, status, userId
                         FROM purchased_order
                         WHERE orderId = ? AND userId = ?"; // *** Quan trọng: Thêm AND userId = ? ***
            $stmtOrder = $this->db->prepare($sqlOrder);
            $stmtOrder->execute([$orderId, $userId]);
            $orderData = $stmtOrder->fetch(PDO::FETCH_ASSOC);
    
            // Nếu không tìm thấy đơn hàng hoặc đơn hàng không thuộc user này -> trả về 404
            // (Không nên phân biệt rõ ràng giữa "không tồn tại" và "không có quyền" để tránh lộ thông tin)
            if (!$orderData) {
                error_log("Attempt to access order {$orderId} by user {$userId} failed or order does not exist.");
                $this->sendResponse(404, ['error' => "Không tìm thấy đơn hàng với ID = {$orderId}."]);
                return;
            }
    
            // 2. Lấy danh sách các sản phẩm (items) trong đơn hàng đó
            $sqlItems = "SELECT
                             pocp.productId,
                             p.name AS productName,
                             p.image AS productImage,
                             pocp.number AS quantity,
                             pocp.price_at_purchase  -- Giá sản phẩm tại thời điểm mua hàng
                         FROM purchased_order_contain_product pocp
                         JOIN product p ON pocp.productId = p.productId
                         WHERE pocp.orderId = ?";
            $stmtItems = $this->db->prepare($sqlItems);
            $stmtItems->execute([$orderId]);
            $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
    
            // 3. Gắn danh sách items vào dữ liệu đơn hàng chính
            $orderData['items'] = $items;
            // Có thể bỏ userId khỏi kết quả trả về cuối cùng nếu muốn
            // unset($orderData['userId']);
    
            // 4. Trả về kết quả thành công
            $this->sendResponse(200, $orderData);
    
        } catch (PDOException $e) {
            error_log("API Error (OrderController::getOrderDetail order {$orderId}, user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy chi tiết đơn hàng.']);
        }
    }

} // Kết thúc class OrderController
?>