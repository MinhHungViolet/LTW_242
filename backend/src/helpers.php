<?php
// Đặt ở đầu index.php hoặc trong src/helpers.php (nếu có và đã include)

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
// Đảm bảo các lớp JWT có sẵn qua vendor/autoload.php

function authenticate(): ?object {
    // !!! THAY BẰNG KHÓA BÍ MẬT THỰC TẾ CỦA BẠN !!!
    $jwtSecretKey = 'YOUR_REALLY_STRONG_AND_SECRET_KEY_HERE_12345!';

    $authHeader = null;
    $headers_for_log = []; // Để lưu header và ghi log

    // Thử lấy từ $_SERVER['HTTP_AUTHORIZATION'] trước
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        // Ghi log để biết header được lấy từ đâu
        error_log("DEBUG AUTH: Lấy header từ \$_SERVER['HTTP_AUTHORIZATION']");
    }
    // Nếu không có, thử dùng getallheaders() (nếu tồn tại)
    elseif (function_exists('getallheaders')) {
        $allHeaders = getallheaders();
        $headers_for_log = $allHeaders; // Lưu lại để ghi log nếu cần

        // getallheaders() có thể trả về key dạng 'Authorization' hoặc 'authorization'
        if (isset($allHeaders['Authorization'])) {
             $authHeader = $allHeaders['Authorization'];
             error_log("DEBUG AUTH: Lấy header từ getallheaders()['Authorization']");
        } elseif (isset($allHeaders['authorization'])) {
             $authHeader = $allHeaders['authorization'];
             error_log("DEBUG AUTH: Lấy header từ getallheaders()['authorization']");
        }
    } else {
         error_log("DEBUG AUTH: Không có \$_SERVER['HTTP_AUTHORIZATION'] và hàm getallheaders() không tồn tại.");
    }

    // Ghi log nếu vẫn không tìm thấy header hoặc ghi log tất cả header từ getallheaders
    if (!$authHeader) {
         error_log("DEBUG AUTH: Không tìm thấy header Authorization bằng cả 2 cách.");
         if (!empty($headers_for_log)) {
              error_log("DEBUG AUTH: Headers nhận được từ getallheaders(): " . print_r($headers_for_log, true));
         }
         // Log cả $_SERVER để kiểm tra kỹ hơn
         error_log("DEBUG AUTH: Biến \$_SERVER: " . print_r($_SERVER, true));

         // Trả lỗi như cũ
         http_response_code(401); // Unauthorized
         echo json_encode(['error' => 'Thiếu header Authorization.']);
         exit();
    }

    // Tách token khỏi chữ "Bearer " (không phân biệt hoa thường chữ Bearer)
    $parts = explode(' ', $authHeader);
    if (count($parts) !== 2 || strcasecmp($parts[0], 'Bearer') !== 0) {
         error_log("DEBUG AUTH: Sai định dạng header Authorization: " . $authHeader); // Ghi log header sai
         http_response_code(401);
         echo json_encode(['error' => 'Định dạng token không hợp lệ (Phải bắt đầu bằng "Bearer ").']);
         exit();
    }
    $token = $parts[1];

    if (empty($token)) {
         error_log("DEBUG AUTH: Token trống sau chữ Bearer.");
         http_response_code(401);
         echo json_encode(['error' => 'Token bị trống sau chữ "Bearer ".']);
         exit();
    }

    // Giải mã và xác thực token
    try {
        $decoded = JWT::decode($token, new Key($jwtSecretKey, 'HS256'));
        error_log("DEBUG AUTH: Giải mã token thành công cho userId: " . ($decoded->userId ?? 'KHONG_XAC_DINH')); // Ghi log thành công
        return $decoded;
    } catch (ExpiredException $e) {
        error_log("DEBUG AUTH: Token hết hạn - " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['error' => 'Token đã hết hạn.']);
        exit();
    } catch (SignatureInvalidException $e) {
         error_log("DEBUG AUTH: Chữ ký token không hợp lệ - " . $e->getMessage());
         http_response_code(401);
         echo json_encode(['error' => 'Chữ ký token không hợp lệ.']);
         exit();
    } catch (Throwable $e) { // Bắt tất cả lỗi/exception khác
        error_log("DEBUG AUTH: Token không hợp lệ hoặc lỗi khác - " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['error' => 'Token không hợp lệ: ' . $e->getMessage()]);
        exit();
    }
}
?>