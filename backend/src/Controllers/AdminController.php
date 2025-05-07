<?php

class AdminController {

    private $db;

    // Constructor nhận kết nối PDO
    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi kết nối CSDL trong AdminController.']);
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
    public function createUser(): void {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        $name = $inputData['name'] ?? null;
        $email = $inputData['email'] ?? null;
        $password = $inputData['password'] ?? null;

        $phone = $inputData['phone'] ?? null;
        $avatar = $inputData['avatar'] ?? null;
        $roleToCreate = 'admin';

        if (empty($name) || empty($email) || empty($password)) {
            $this->sendResponse(400, ['error' => 'Thiếu tên, email hoặc mật khẩu.']);
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
             $this->sendResponse(400, ['error' => 'Địa chỉ email không hợp lệ.']);
             return;
        }
        if (strlen($password) < 8) {
             $this->sendResponse(400, ['error' => 'Mật khẩu phải có ít nhất 8 ký tự.']);
             return;
        }

        // --- Kiểm tra Email tồn tại ---
        try {
            $sqlCheck = "SELECT userId FROM user WHERE email = ?";
            $stmtCheck = $this->db->prepare($sqlCheck);
            $stmtCheck->execute([$email]);
            if ($stmtCheck->fetch()) {
                $this->sendResponse(409, ['error' => 'Địa chỉ email này đã được đăng ký.']);
                return;
            }

            // --- Mã hóa mật khẩu ---
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
             if ($hashedPassword === false) {
                  throw new Exception("Không thể mã hóa mật khẩu.");
             }

            // --- Lưu người dùng vào DB với role 'admin' ---
            $sqlInsert = "INSERT INTO user (name, email, password, phone, avatar, role, created_at)
                          VALUES (?, ?, ?, ?, ?, ?, NOW())";
            $stmtInsert = $this->db->prepare($sqlInsert);
            $success = $stmtInsert->execute([
                $name,
                $email,
                $hashedPassword,
                $phone,
                $avatar,
                $roleToCreate // Luôn là 'admin'
            ]);

            if ($success) {
                $newUserId = $this->db->lastInsertId();
                $this->sendResponse(201, [
                    'message' => 'Tạo tài khoản Admin thành công!',
                    'userId' => (int)$newUserId,
                    'name' => $name,
                    'email' => $email,
                    'role' => $roleToCreate
                 ]);
            } else {
                $this->sendResponse(500, ['error' => 'Không thể tạo tài khoản do lỗi không xác định.']);
            }

        } catch (PDOException $e) {
            error_log("API Error (AdminController::createUser - DB): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi tạo tài khoản (DB).']);
        } catch (Exception $e) {
             error_log("API Error (AdminController::createUser - General): " . $e->getMessage());
             $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi tạo tài khoản (General).']);
        }
    }

    public function getAllUsers(): void {
        try {
            $sql = "SELECT userId, name, email, role, phone, avatar, created_at
                    FROM user
                    ORDER BY userId ASC"; 

            $stmt = $this->db->query($sql);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse(200, 
            [
                'status' => 'success',
                'data' => $users
            ]);
        } catch (PDOException $e) {
            error_log("API Error (AdminController::getAllUsers): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy danh sách người dùng.']);
        }
    }

    public function deleteUser(int $userIdToDelete, int $loggedInUserId): void {
         // 0. Kiểm tra ID hợp lệ
         if ($userIdToDelete <= 0) {
              $this->sendResponse(400, ['error' => 'ID người dùng cần xóa không hợp lệ.']);
              return;
         }

         // 1. *** Ngăn Admin tự xóa chính mình qua API *** (Rất quan trọng)
         if ($userIdToDelete === $loggedInUserId) {
              $this->sendResponse(403, ['error' => 'Admin không thể tự xóa tài khoản của chính mình.']);
              return;
         }

         // 2. Kiểm tra xem user cần xóa có tồn tại không
         try {
             $sqlCheck = "SELECT userId FROM user WHERE userId = ?";
             $stmtCheck = $this->db->prepare($sqlCheck);
             $stmtCheck->execute([$userIdToDelete]);
             if (!$stmtCheck->fetch()) {
                 $this->sendResponse(404, ['error' => "Không tìm thấy người dùng với ID = {$userIdToDelete} để xóa."]);
                 return;
             }

             // 3. Thực hiện xóa user
             $sqlDelete = "DELETE FROM user WHERE userId = ?";
             $stmtDelete = $this->db->prepare($sqlDelete);
             $stmtDelete->execute([$userIdToDelete]);

             // 4. Kiểm tra kết quả xóa
             if ($stmtDelete->rowCount() > 0) {
                 $this->sendResponse(200, ['message' => "Đã xóa thành công người dùng với ID = {$userIdToDelete}."]);
             } else {
                 $this->sendResponse(500, ['error' => "Xóa người dùng ID {$userIdToDelete} thất bại mặc dù đã tìm thấy."]);
             }

         } catch (PDOException $e) {
              error_log("API Error (AdminController::deleteUser {$userIdToDelete}): " . $e->getMessage());
               if ($e->getCode() == 23000) {
                   $this->sendResponse(409, ['error' => "Không thể xóa người dùng ID {$userIdToDelete} do có ràng buộc dữ liệu (ví dụ: người dùng có đơn hàng)."]); // 409 Conflict
               } else {
                   $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xóa người dùng.']);
               }
         }
    }

    public function getAllOrders(): void {
        try {

            $sql = "SELECT po.orderId, po.userId, u.name as customerName, u.email as customerEmail, po.address, po.totalPrice, po.method, po.date, po.status
                    FROM purchased_order po
                    JOIN user u ON po.userId = u.userId
                    ORDER BY po.date DESC";

            $stmt = $this->db->query($sql);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(200, $orders);

        } catch (PDOException $e) {
            error_log("API Error (AdminController::getAllOrders): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy danh sách đơn hàng.']);
        }
    }
    public function updateOrderStatus(int $orderId): void {
        // 0. Kiểm tra orderId hợp lệ
        if ($orderId <= 0) {
             $this->sendResponse(400, ['error' => 'ID đơn hàng không hợp lệ.']);
             return;
        }

        // 1. Lấy trạng thái mới từ request body
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        $newStatus = $inputData['status'] ?? null;

        // 2. Validate trạng thái mới
        if (empty($newStatus)) {
             $this->sendResponse(400, ['error' => 'Thiếu trạng thái (status) mới trong request body.']);
             return;
        }

        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!in_array($newStatus, $allowedStatuses)) {
             $this->sendResponse(400, ['error' => "Trạng thái '{$newStatus}' không hợp lệ. Các trạng thái được phép: " . implode(', ', $allowedStatuses)]);
             return;
        }

        // 3. Thực hiện cập nhật CSDL
        $sql = "UPDATE purchased_order SET status = ? WHERE orderId = ?";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$newStatus, $orderId]);

            // 4. Kiểm tra xem có cập nhật được không
            if ($stmt->rowCount() > 0) {
                $sqlGetUpdated = "SELECT orderId, userId, address, totalPrice, method, date, status FROM purchased_order WHERE orderId = ?";
                $stmtGetUpdated = $this->db->prepare($sqlGetUpdated);
                $stmtGetUpdated->execute([$orderId]);
                $updatedOrder = $stmtGetUpdated->fetch(PDO::FETCH_ASSOC);

                if ($updatedOrder) {
                     $this->sendResponse(200, $updatedOrder);
                } else {
                     $this->sendResponse(200, ['message' => "Đã cập nhật trạng thái đơn hàng ID {$orderId} thành '{$newStatus}', nhưng không thể lấy lại dữ liệu."]);
                }
            } else {
                $checkStmt = $this->db->prepare("SELECT orderId FROM purchased_order WHERE orderId = ?");
                $checkStmt->execute([$orderId]);
                if (!$checkStmt->fetch()) {
                     $this->sendResponse(404, ['error' => "Không tìm thấy đơn hàng với ID = {$orderId} để cập nhật."]);
                } else {
                     $this->sendResponse(200, ['message' => "Trạng thái đơn hàng ID {$orderId} không thay đổi (đã là '{$newStatus}')."]);
                }
            }
        } catch (PDOException $e) {
             error_log("API Error (AdminController::updateOrderStatus {$orderId}): " . $e->getMessage());
             $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi cập nhật trạng thái đơn hàng.']);
        }
    }
    public function getOrderDetailAsAdmin(int $orderId): void {
        if ($orderId <= 0) {
            $this->sendResponse(400, ['error' => 'ID đơn hàng không hợp lệ.']);
            return;
        }
        try {
            // 1. Lấy thông tin đơn hàng chính và JOIN với bảng user để lấy thông tin người đặt
            $sqlOrder = "SELECT
                             po.orderId, po.address, po.totalPrice, po.method, po.date, po.status,
                             po.userId, u.name as customerName, u.email as customerEmail
                         FROM purchased_order po
                         JOIN user u ON po.userId = u.userId
                         WHERE po.orderId = ?";
            $stmtOrder = $this->db->prepare($sqlOrder);
            $stmtOrder->execute([$orderId]);
            $orderData = $stmtOrder->fetch(PDO::FETCH_ASSOC);
            if (!$orderData) {
                $this->sendResponse(404, ['error' => "Không tìm thấy đơn hàng với ID = {$orderId}."]);
                return;
            }
            // 2. Lấy danh sách sản phẩm trong đơn hàng đó (Giống như getOrderDetail của User)
            $sqlItems = "SELECT
                             pocp.productId,
                             p.name AS productName,
                             p.image AS productImage,
                             pocp.number AS quantity,
                             pocp.price_at_purchase
                         FROM purchased_order_contain_product pocp
                         JOIN product p ON pocp.productId = p.productId
                         WHERE pocp.orderId = ?";
            $stmtItems = $this->db->prepare($sqlItems);
            $stmtItems->execute([$orderId]);
            $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
    
            // 3. Gắn mảng items vào thông tin đơn hàng chính
            $orderData['items'] = $items;
    
            // 4. Trả về kết quả thành công
            $this->sendResponse(200, $orderData);
    
        } catch (PDOException $e) {
            error_log("API Error (AdminController::getOrderDetailAsAdmin order {$orderId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy chi tiết đơn hàng cho admin.']);
        }
    }

}
?>