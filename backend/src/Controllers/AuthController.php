<?php
// src/Controllers/AuthController.php

// use PDO;
// use PDOException;
use Firebase\JWT\JWT; // Import lớp JWT
use Firebase\JWT\Key;  // Import lớp Key (dùng cho phiên bản mới của php-jwt)

class AuthController {

    private $db;
    private $jwtSecretKey; // Sẽ lưu trữ khóa bí mật JWT
    private $issuer = 'your_api_domain.com'; // Thay bằng domain của bạn hoặc tên ứng dụng
    private $audience = 'your_api_domain.com'; // Tương tự

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi kết nối CSDL trong AuthController.']);
            exit();
        }
        $this->db = $pdo;

        // !!! QUAN TRỌNG: Lấy khóa bí mật JWT từ nơi an toàn !!!
        // Tạm thời để trong code, nhưng cách tốt nhất là dùng biến môi trường (.env)
        // Hoặc định nghĩa trong file config riêng không đưa lên Git
        $this->jwtSecretKey = 'YOUR_REALLY_STRONG_AND_SECRET_KEY_HERE_12345!'; // *** THAY BẰNG KHÓA BÍ MẬT CỦA BẠN ***
        // Đảm bảo khóa này đủ dài và phức tạp.
    }

    // Hàm tiện ích gửi response (giống ProductController)
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($data);
    }

    // Hàm tạo JWT (sẽ thêm ở Bước 3)
    private function createJwt(int $userId, string $email, string $role, string $name): string {
        $issuedAt = time();
        $expirationTime = $issuedAt + (60 * 60 * 24 * 7); // Token hết hạn sau 7 ngày (ví dụ)
        // Bạn có thể đặt thời gian hết hạn ngắn hơn (vd: 1 giờ) và dùng Refresh Token nếu cần bảo mật cao hơn
    
        $payload = [
            'iss' => $this->issuer,       // Issuer: Ai cấp token
            'aud' => $this->audience,    // Audience: Ai sử dụng token
            'iat' => $issuedAt,          // Issued At: Thời điểm cấp
            'exp' => $expirationTime,    // Expiration Time: Thời điểm hết hạn
            'userId' => $userId,         // Dữ liệu người dùng
            'email' => $email,
            'role' => $role,
            'name' => $name
        ];
    
        // Encode thành JWT dùng khóa bí mật và thuật toán HS256
        $jwt = JWT::encode($payload, $this->jwtSecretKey, 'HS256');
    
        return $jwt;
    }

    // Hàm đăng ký (sẽ thêm ở Bước 2)
    public function register(): void {
        $inputData = json_decode(file_get_contents('php://input'), true);
    
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }
    
        // --- Validation cơ bản ---
        $name = $inputData['name'] ?? null;
        $email = $inputData['email'] ?? null;
        $password = $inputData['password'] ?? null;
        $phone = $inputData['phone'] ?? null; // Tùy chọn
        $avatar = $inputData['avatar'] ?? null; // Tùy chọn
    
        if (empty($name) || empty($email) || empty($password)) {
            $this->sendResponse(400, ['error' => 'Thiếu tên, email hoặc mật khẩu.']);
            return;
        }
    
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
             $this->sendResponse(400, ['error' => 'Địa chỉ email không hợp lệ.']);
             return;
        }
    
        // Kiểm tra độ dài mật khẩu (ví dụ tối thiểu 8 ký tự)
        if (strlen($password) < 8) {
             $this->sendResponse(400, ['error' => 'Mật khẩu phải có ít nhất 8 ký tự.']);
             return;
        }
        // Thêm các validation khác nếu cần...
    
        // --- Kiểm tra Email tồn tại ---
        try {
            $sqlCheck = "SELECT userId FROM user WHERE email = ?";
            $stmtCheck = $this->db->prepare($sqlCheck);
            $stmtCheck->execute([$email]);
            if ($stmtCheck->fetch()) {
                $this->sendResponse(409, ['error' => 'Địa chỉ email này đã được đăng ký.']); // 409 Conflict
                return;
            }
    
            // --- Mã hóa mật khẩu ---
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hoặc dùng PASSWORD_BCRYPT
             if ($hashedPassword === false) {
                  throw new Exception("Không thể mã hóa mật khẩu."); // Ném lỗi nếu hash thất bại
             }
    
            // --- Lưu người dùng vào DB ---
            $sqlInsert = "INSERT INTO user (name, email, password, phone, avatar, role, created_at)
                          VALUES (?, ?, ?, ?, ?, 'customer', NOW())"; // Mặc định role là 'customer'
            $stmtInsert = $this->db->prepare($sqlInsert);
            $success = $stmtInsert->execute([
                $name,
                $email,
                $hashedPassword,
                $phone,
                $avatar
            ]);
    
            if ($success) {
                $newUserId = $this->db->lastInsertId();
                // Trả về thông báo thành công hoặc thông tin user (không có pass)
                $this->sendResponse(201, [
                    'message' => 'Đăng ký thành công!',
                    'userId' => (int)$newUserId, // Trả về ID user mới
                    'name' => $name,
                    'email' => $email,
                    'role' => 'customer'
                 ]);
            } else {
                $this->sendResponse(500, ['error' => 'Không thể đăng ký người dùng do lỗi không xác định.']);
            }
    
        } catch (PDOException $e) {
            error_log("API Error (AuthController::register - DB): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi đăng ký (DB).']);
        } catch (Exception $e) { // Bắt lỗi Exception chung (ví dụ: lỗi hash password)
             error_log("API Error (AuthController::register - General): " . $e->getMessage());
             $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi đăng ký (General).']);
        }
    }

    // Hàm đăng nhập (sẽ thêm ở Bước 4)
    public function login(): void {
        $inputData = json_decode(file_get_contents('php://input'), true);
    
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }
    
        // --- Validation cơ bản ---
        $email = $inputData['email'] ?? null;
        $password = $inputData['password'] ?? null;
    
        if (empty($email) || empty($password)) {
            $this->sendResponse(400, ['error' => 'Thiếu email hoặc mật khẩu.']);
            return;
        }
    
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
             $this->sendResponse(400, ['error' => 'Địa chỉ email không hợp lệ.']);
             return;
        }
    
        // --- Tìm user và xác thực ---
        try {
            // Lấy cả password hash và role để tạo token
            $sql = "SELECT userId, email, password, role, name FROM user WHERE email = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // 1. Kiểm tra user tồn tại
            if (!$user) {
                $this->sendResponse(401, ['error' => 'Email hoặc mật khẩu không đúng.']); // 401 Unauthorized
                return;
            }
    
            // 2. Kiểm tra mật khẩu
            if (password_verify($password, $user['password'])) {
                // Mật khẩu đúng -> Tạo JWT
                $token = $this->createJwt($user['userId'], $user['email'], $user['role'], name: $user['name']);
    
                // Trả về token và thông tin user cơ bản
                $this->sendResponse(200, [
                    'message' => 'Đăng nhập thành công!',
                    'token' => $token,
                    'user' => [ // Chỉ trả về thông tin an toàn
                         'id' => $user['userId'],
                         'name' => $user['name'],
                         'email' => $user['email'],
                         'role' => $user['role']
                     ]
                 ]);
            } else {
                // Mật khẩu sai
                $this->sendResponse(401, ['error' => 'Email hoặc mật khẩu không đúng.']); // 401 Unauthorized
            }
    
        } catch (PDOException $e) {
            error_log("API Error (AuthController::login): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi đăng nhập.']);
        }
    }
}
?>