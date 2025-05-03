<?php
// Đặt ở đầu index.php hoặc trong src/helpers.php (nếu có và đã include)

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

function authenticate(): ?object {
    // Lấy khóa bí mật (phải giống hệt khóa trong AuthController)
    $jwtSecretKey = 'YOUR_REALLY_STRONG_AND_SECRET_KEY_HERE_12345!'; // *** LẤY TỪ CONFIG/ENV SAU NÀY ***

    // Kiểm tra xem header Authorization có tồn tại không
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;

    if (!$authHeader) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Thiếu header Authorization.']);
        exit();
    }

    // Tách token khỏi chữ "Bearer "
    $parts = explode(' ', $authHeader);
    if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
         http_response_code(401);
         echo json_encode(['error' => 'Định dạng token không hợp lệ (Thiếu "Bearer ").']);
         exit();
    }
    $token = $parts[1];

    // Giải mã và xác thực token
    try {
        // Dùng Key object cho phiên bản mới của firebase/php-jwt
        $decoded = JWT::decode($token, new Key($jwtSecretKey, 'HS256'));
        // Trả về payload nếu token hợp lệ
        return $decoded;
    } catch (ExpiredException $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Token đã hết hạn.']);
        exit();
    } catch (SignatureInvalidException $e) {
         http_response_code(401);
         echo json_encode(['error' => 'Chữ ký token không hợp lệ.']);
         exit();
    } catch (Exception $e) { // Các lỗi khác (vd: token sai định dạng)
        http_response_code(401);
        echo json_encode(['error' => 'Token không hợp lệ: ' . $e->getMessage()]);
        exit();
    }
}
?>