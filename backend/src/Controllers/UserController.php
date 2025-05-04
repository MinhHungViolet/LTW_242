<?php
// src/Controllers/UserController.php

// Bỏ comment hoặc thêm nếu chưa có
// use PDO;
// use PDOException;

class UserController {

    private $db;

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            // Không thể dùng $this->sendResponse ở đây vì $this chưa hoàn toàn được tạo
            // Nên trả về lỗi trực tiếp hoặc ném Exception
             http_response_code(500);
             header("Content-Type: application/json; charset=UTF-8");
             echo json_encode(['error' => 'Lỗi nghiêm trọng: Không có kết nối CSDL trong UserController constructor.']);
             exit();
        }
        $this->db = $pdo;
    }

    // Hàm tiện ích gửi response
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        // Đảm bảo header Content-Type là JSON
        if (!headers_sent()) { // Kiểm tra header chưa gửi đi
             header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode($data);
    }

    /**
     * Xử lý GET /user/profile
     * Lấy thông tin profile của user đang đăng nhập
     * @param object $userPayload Payload từ JWT đã được xác thực
     */
    public function getProfile(object $userPayload): void {
        $userId = $userPayload->userId;

        try {
            // Lấy các thông tin cần thiết, TRỪ password
            $sql = "SELECT userId, name, email, role, phone, avatar, created_at
                    FROM user
                    WHERE userId = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$userId]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userData) {
                 // Nếu avatar được lưu là tên file, tạo URL đầy đủ để trả về cho frontend (tùy chọn)
                 if (!empty($userData['avatar'])) {
                      // Giả sử API_BASE_URL là biến toàn cục hoặc lấy từ config
                      // và thư mục uploads nằm trong public
                      // $baseImageUrl = rtrim(getenv('API_BASE_URL') ?: 'http://localhost/backend', '/') . '/uploads/avatars/'; // Bỏ /public
                      // $userData['avatarUrl'] = $baseImageUrl . $userData['avatar'];

                      // Hoặc đơn giản chỉ trả về tên file, frontend tự xử lý
                 }
                $this->sendResponse(200, $userData);
            } else {
                $this->sendResponse(404, ['error' => 'Không tìm thấy thông tin người dùng.']);
            }
        } catch (PDOException $e) {
            error_log("API Error (UserController::getProfile user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi lấy thông tin profile.']);
        }
    }

    /**
     * Xử lý PUT /user/profile (ĐÃ GOM CHUNG + THÊM LOG + ROWCOUNT CHECK)
     * Cập nhật thông tin (tên, sđt) và/hoặc avatar cho user đang đăng nhập
     * Nhận dữ liệu dạng multipart/form-data
     * @param object $userPayload Payload từ JWT
     */
    public function updateProfile(object $userPayload): void {
        $userId = $userPayload->userId;
        error_log("DEBUG updateProfile: Called for userId = {$userId}");

        // 1. Đọc dữ liệu text từ $_POST
        $inputName = $_POST['name'] ?? null;
        $inputPhone = $_POST['phone'] ?? null;
        error_log("DEBUG updateProfile - Received POST data: name=" . ($inputName ?? 'NULL') . ", phone=" . ($inputPhone ?? 'NULL'));

        // 2. Chuẩn bị dữ liệu cập nhật CSDL
        $fieldsToUpdate = [];
        $params = [];
        $newAvatarDbPath = null;
        $destinationPath = null;
        $uploadDir = __DIR__ . '/../../public/uploads/avatars/';

        // Validate và thêm name
        if ($inputName !== null) {
             $name = trim($inputName);
             // Cho phép cập nhật tên rỗng không? Nếu không thì kiểm tra !empty()
             // if (!empty($name)) {
             // Giả sử cho phép cập nhật tên, kể cả rỗng (frontend nên validate nếu cần bắt buộc)
             error_log("DEBUG updateProfile: Adding 'name' to update.");
             $fieldsToUpdate[] = "name = ?";
             $params[] = $name;
             // } else {
             //     $this->sendResponse(400, ['error' => 'Tên không được để trống.']); return;
             // }
        }

        // Validate và thêm phone
        if ($inputPhone !== null) {
            $phone = preg_replace('/\D/', '', $inputPhone);
            if (empty($phone) || preg_match('/^0\d{9}$/', $phone)) {
                error_log("DEBUG updateProfile: Adding 'phone' to update.");
                $fieldsToUpdate[] = "phone = ?";
                $params[] = $phone ?: null;
            } else {
                $this->sendResponse(400, ['error' => 'Số điện thoại không hợp lệ.']); return;
            }
        }

        // 3. Xử lý file avatar nếu được gửi kèm ('avatarFile' là key trong FormData)
        if (isset($_FILES['avatarFile']) && $_FILES['avatarFile']['error'] === UPLOAD_ERR_OK) {
             error_log("DEBUG updateProfile: Received avatarFile: " . print_r($_FILES['avatarFile'], true));
             $file = $_FILES['avatarFile'];

             // Validate file
             $maxSize = 2 * 1024 * 1024; // 2MB
             if ($file['size'] > $maxSize) { $this->sendResponse(400, ['error' => 'Ảnh đại diện quá lớn (> 2MB).']); return; }
             $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
             $fileType = mime_content_type($file['tmp_name']);
             if (!in_array($fileType, $allowedTypes)) { $this->sendResponse(400, ['error' => 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP).']); return; }

             // Tạo tên file mới
             $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
             $newFileName = $userId . '_' . time() . '.' . strtolower($extension);
             $destinationPath = $uploadDir . $newFileName;

             // Di chuyển file upload
             if (move_uploaded_file($file['tmp_name'], $destinationPath)) {
                  error_log("DEBUG updateProfile: Avatar file moved successfully to: " . $destinationPath);
                  $newAvatarDbPath = $newFileName;
                  $fieldsToUpdate[] = "avatar = ?";
                  $params[] = $newAvatarDbPath;

                   // Xóa avatar cũ
                   try { /* ... code xóa avatar cũ như trước ... */
                        $sqlGetOld = "SELECT avatar FROM user WHERE userId = ?";
                        $stmtGetOld = $this->db->prepare($sqlGetOld);
                        $stmtGetOld->execute([$userId]);
                        $oldAvatarData = $stmtGetOld->fetch(PDO::FETCH_ASSOC);
                        if ($oldAvatarData && !empty($oldAvatarData['avatar'])) {
                            $oldAvatarPath = $uploadDir . $oldAvatarData['avatar'];
                            if (file_exists($oldAvatarPath) && $oldAvatarData['avatar'] !== $newAvatarDbPath) {
                                @unlink($oldAvatarPath); error_log("DEBUG updateProfile: Deleted old avatar: " . $oldAvatarPath);
                            }
                        }
                   } catch(PDOException $e) { error_log("API Warning (UserController::updateProfile - delete old avatar user {$userId}): " . $e->getMessage()); }
             } else {
                  error_log("ERROR updateProfile: Failed to move uploaded file for user {$userId}.");
                  $this->sendResponse(500, ['error' => 'Không thể lưu file ảnh đại diện đã tải lên.']); return;
             }
        } elseif (isset($_FILES['avatarFile']) && $_FILES['avatarFile']['error'] !== UPLOAD_ERR_NO_FILE) {
            error_log("ERROR updateProfile: File upload error code: " . $_FILES['avatarFile']['error'] . " for user {$userId}.");
            $this->sendResponse(400, ['error' => 'Có lỗi xảy ra khi tải file lên.', 'upload_error_code' => $_FILES['avatarFile']['error']]); return;
        } else {
             error_log("DEBUG updateProfile: No new avatar file uploaded or UPLOAD_ERR_NO_FILE.");
        }

        // 4. Kiểm tra xem có gì để cập nhật không
        error_log("DEBUG updateProfile - Fields to update array: " . print_r($fieldsToUpdate, true));
        if (empty($fieldsToUpdate)) {
            error_log("DEBUG updateProfile: No valid fields to update for user {$userId}. Returning current profile.");
            $this->getProfile($userPayload); // Trả về thông tin hiện tại
            return;
        }

        // 5. Thực thi câu lệnh UPDATE CSDL
        $params[] = $userId; // Thêm userId vào cuối cho WHERE
        $setClause = implode(', ', $fieldsToUpdate);
        $sql = "UPDATE user SET {$setClause} WHERE userId = ?";
        error_log("DEBUG updateProfile - Executing SQL: " . $sql);
        error_log("DEBUG updateProfile - With Params: " . print_r($params, true));

        try {
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute($params);
            $rowCount = $stmt->rowCount(); // Lấy số dòng bị ảnh hưởng
    
            error_log("DEBUG updateProfile - Execute status: " . ($success ? 'true' : 'false') . ", Row count: " . $rowCount);
    
            // 6. Kiểm tra kết quả và trả về response DỰA TRÊN ROWCOUNT
            if ($success) { // Kiểm tra xem execute() có thành công không
                if ($rowCount > 0) {
                     // *** CÓ THAY ĐỔI DỮ LIỆU ***
                     // Gọi getProfile để trả về dữ liệu mới nhất sau khi cập nhật
                     error_log("DEBUG updateProfile: Update successful, {$rowCount} row(s) affected for user {$userId}. Fetching updated profile.");
                     $this->getProfile($userPayload);
                } else {
                     // *** KHÔNG CÓ THAY ĐỔI DỮ LIỆU (rowCount = 0) ***
                     // Thực thi thành công nhưng không có dòng nào thay đổi (dữ liệu gửi lên giống hệt dữ liệu cũ)
                     error_log("DEBUG updateProfile: Update executed but no rows affected for user {$userId}. Data might be the same.");
                     // Trả về một thông báo rõ ràng thay vì gọi lại getProfile
                     $this->sendResponse(200, ['message' => 'Thông tin không có gì thay đổi. Dữ liệu gửi lên giống với dữ liệu hiện tại.']);
                }
            } else {
                  // Lỗi khi thực thi execute() trả về false
                  error_log("ERROR updateProfile: Execute returned false for user {$userId}.");
                  if ($newAvatarDbPath && $destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); } // Xóa file nếu lỗi DB
                  $this->sendResponse(500, ['error' => 'Không thể thực thi cập nhật CSDL.']);
            }
    
        } catch (PDOException $e) {
            // Lỗi PDO Exception (giữ nguyên)
            if ($newAvatarDbPath && $destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); }
            error_log("API Error (UserController::updateProfile DB update user {$userId}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi cập nhật profile.']);
        }
    }

 } // Kết thúc class UserController
 ?>