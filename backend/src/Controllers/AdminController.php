<?php
// src/Controllers/AdminController.php

// use PDO;
// use PDOException;

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

    // Hàm tiện ích gửi response (Tạm thời copy từ controller khác)
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($data);
    }

    /**
     * Xử lý yêu cầu POST /admin/users
     * Admin tạo một tài khoản mới (mặc định là admin hoặc tùy chọn)
     */
    public function createUser(): void {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        // --- Validation cơ bản ---
        $name = $inputData['name'] ?? null;
        $email = $inputData['email'] ?? null;
        $password = $inputData['password'] ?? null;
        // Thêm các trường tùy chọn khác nếu muốn admin có thể set khi tạo
        $phone = $inputData['phone'] ?? null;
        $avatar = $inputData['avatar'] ?? null;
        // Cho phép admin set role khi tạo, nếu không gửi thì mặc định là admin? Hoặc luôn là admin?
        // Trong ví dụ này, sẽ luôn tạo là 'admin'. Nếu muốn linh hoạt, cần thêm logic kiểm tra role input.
        $roleToCreate = 'admin'; // Luôn tạo admin qua endpoint này

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
        // *** Thêm validation khác nếu cần ***

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
                // Trả về thông tin admin vừa tạo (không có pass)
                // Chúng ta không gọi lại getById vì hàm đó có thể không tồn tại hoặc không phù hợp
                // Nên tạo một hàm riêng để lấy thông tin user nếu cần
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
            // Chuẩn bị câu lệnh SQL - QUAN TRỌNG: Không bao giờ lấy cột password!
            $sql = "SELECT userId, name, email, role, phone, avatar, created_at
                    FROM user
                    ORDER BY userId ASC"; // Sắp xếp theo ID tăng dần (hoặc tùy chọn khác)
    
            // Thực thi query (không cần prepare vì không có tham số đầu vào)
            $stmt = $this->db->query($sql);
    
            // Lấy tất cả kết quả
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Trả về danh sách user với mã 200 OK
            $this->sendResponse(200, $users);
    
        } catch (PDOException $e) {
            error_log("API Error (AdminController::getAllUsers): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy danh sách người dùng.']);
        }
    }

    /**
     * Xử lý yêu cầu DELETE /admin/users/{userId}
     * Admin xóa một tài khoản người dùng khác
     * @param int $userIdToDelete ID của người dùng cần xóa
     * @param int $loggedInUserId ID của admin đang thực hiện hành động (lấy từ token)
     */
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
                 // Hoặc trả về 204 No Content nếu muốn
                 // http_response_code(204);
                 // exit();
             } else {
                 // Trường hợp này ít xảy ra nếu đã kiểm tra tồn tại ở trên, nhưng vẫn nên có
                 $this->sendResponse(500, ['error' => "Xóa người dùng ID {$userIdToDelete} thất bại mặc dù đã tìm thấy."]);
             }

         } catch (PDOException $e) {
              error_log("API Error (AdminController::deleteUser {$userIdToDelete}): " . $e->getMessage());
               // Xử lý lỗi khóa ngoại nếu cần (vd: user có đơn hàng...) - Tùy thuộc vào cấu hình ON DELETE của bạn
               if ($e->getCode() == 23000) {
                   $this->sendResponse(409, ['error' => "Không thể xóa người dùng ID {$userIdToDelete} do có ràng buộc dữ liệu (ví dụ: người dùng có đơn hàng)."]); // 409 Conflict
               } else {
                   $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xóa người dùng.']);
               }
         }
    }

    public function getAllOrders(): void {
        try {
            // Lấy thông tin cần thiết từ bảng purchased_order
            // Có thể JOIN với bảng user để lấy tên/email người đặt nếu muốn
            $sql = "SELECT po.orderId, po.userId, u.name as customerName, u.email as customerEmail, po.address, po.totalPrice, po.method, po.date, po.status
                    FROM purchased_order po
                    JOIN user u ON po.userId = u.userId
                    ORDER BY po.date DESC"; // Sắp xếp theo ngày gần nhất

            $stmt = $this->db->query($sql);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(200, $orders);

        } catch (PDOException $e) {
            error_log("API Error (AdminController::getAllOrders): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy danh sách đơn hàng.']);
        }
    }

    // *** THÊM HÀM MỚI: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ***
    /**
     * Xử lý yêu cầu PUT /admin/orders/{orderId}/status
     * Admin cập nhật trạng thái cho một đơn hàng
     * @param int $orderId ID của đơn hàng cần cập nhật
     */
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

        // Lấy các giá trị ENUM hợp lệ từ CSDL (hoặc định nghĩa sẵn trong code)
        // Cách lấy từ DB (cần thực hiện 1 lần hoặc cache lại):
        /*
        $stmtEnum = $this->db->query("SHOW COLUMNS FROM purchased_order LIKE 'status'");
        $enumData = $stmtEnum->fetch(PDO::FETCH_ASSOC);
        preg_match("/^enum\(\'(.*)\'\)$/", $enumData['Type'], $matches);
        $allowedStatuses = explode("','", $matches[1]);
        */
        // Hoặc định nghĩa sẵn (dễ hơn và thường đủ dùng):
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!in_array($newStatus, $allowedStatuses)) {
             $this->sendResponse(400, ['error' => "Trạng thái '{$newStatus}' không hợp lệ. Các trạng thái được phép: " . implode(', ', $allowedStatuses)]);
             return;
        }

        // (Tùy chọn) Thêm logic kiểm tra chuyển đổi trạng thái hợp lệ ở đây
        // Ví dụ: không cho chuyển từ 'cancelled' sang 'processing', v.v.

        // 3. Thực hiện cập nhật CSDL
        $sql = "UPDATE purchased_order SET status = ? WHERE orderId = ?";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$newStatus, $orderId]);

            // 4. Kiểm tra xem có cập nhật được không
            if ($stmt->rowCount() > 0) {
                // Lấy lại thông tin đơn hàng đã cập nhật để trả về (tùy chọn)
                $sqlGetUpdated = "SELECT orderId, userId, address, totalPrice, method, date, status FROM purchased_order WHERE orderId = ?";
                $stmtGetUpdated = $this->db->prepare($sqlGetUpdated);
                $stmtGetUpdated->execute([$orderId]);
                $updatedOrder = $stmtGetUpdated->fetch(PDO::FETCH_ASSOC);

                if ($updatedOrder) {
                     $this->sendResponse(200, $updatedOrder);
                } else {
                     // Trường hợp hy hữu: update thành công nhưng fetch lại thất bại?
                     $this->sendResponse(200, ['message' => "Đã cập nhật trạng thái đơn hàng ID {$orderId} thành '{$newStatus}', nhưng không thể lấy lại dữ liệu."]);
                }
            } else {
                // Nếu rowCount = 0, kiểm tra xem orderId có tồn tại không
                $checkStmt = $this->db->prepare("SELECT orderId FROM purchased_order WHERE orderId = ?");
                $checkStmt->execute([$orderId]);
                if (!$checkStmt->fetch()) {
                     $this->sendResponse(404, ['error' => "Không tìm thấy đơn hàng với ID = {$orderId} để cập nhật."]);
                } else {
                     // Đơn hàng tồn tại nhưng trạng thái gửi lên giống trạng thái hiện tại
                     $this->sendResponse(200, ['message' => "Trạng thái đơn hàng ID {$orderId} không thay đổi (đã là '{$newStatus}')."]);
                }
            }
        } catch (PDOException $e) {
             error_log("API Error (AdminController::updateOrderStatus {$orderId}): " . $e->getMessage());
             $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi cập nhật trạng thái đơn hàng.']);
        }
    }

} // Kết thúc class AdminController
?>