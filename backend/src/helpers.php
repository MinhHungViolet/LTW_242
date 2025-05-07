<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

function authenticate(): ?object {
    $jwtSecretKey = 'YOUR_REALLY_STRONG_AND_SECRET_KEY_HERE_12345!';

    $authHeader = null;
    $headers_for_log = [];

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];

        error_log("DEBUG AUTH: Lấy header từ \$_SERVER['HTTP_AUTHORIZATION']");
    }

    elseif (function_exists('getallheaders')) {
        $allHeaders = getallheaders();
        $headers_for_log = $allHeaders;

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

    if (!$authHeader) {
         error_log("DEBUG AUTH: Không tìm thấy header Authorization bằng cả 2 cách.");
         if (!empty($headers_for_log)) {
              error_log("DEBUG AUTH: Headers nhận được từ getallheaders(): " . print_r($headers_for_log, true));
         }

         error_log("DEBUG AUTH: Biến \$_SERVER: " . print_r($_SERVER, true));

         http_response_code(401);
         echo json_encode(['error' => 'Thiếu header Authorization.']);
         exit();
    }

    $parts = explode(' ', $authHeader);
    if (count($parts) !== 2 || strcasecmp($parts[0], 'Bearer') !== 0) {
         error_log("DEBUG AUTH: Sai định dạng header Authorization: " . $authHeader);
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
        error_log("DEBUG AUTH: Giải mã token thành công cho userId: " . ($decoded->userId ?? 'KHONG_XAC_DINH'));
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