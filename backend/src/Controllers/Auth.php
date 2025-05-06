<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Xử lý yêu cầu preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../Database/Connection.php';

$response = ['status' => 'error', 'message' => 'Yêu cầu không hợp lệ', 'data' => null];

try {
    // Đọc dữ liệu JSON từ request
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['action'])) {
        echo json_encode($response);
        exit;
    }

    $action = $data['action'];
    error_log("Action received: $action"); // Log hành động
    $pdo = Connection::getInstance();
    if ($pdo === null) {
        $response['message'] = 'Không thể kết nối cơ sở dữ liệu';
        error_log("Database connection failed");
        echo json_encode($response);
        exit;
    }

    if ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        error_log("Login attempt: email=$email, password=***");

        if (empty($email) || empty($password)) {
            $response['message'] = 'Vui lòng nhập email và mật khẩu!';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $response['status'] = 'success';
                $response['message'] = 'Đăng nhập thành công';
                $response['data'] = [
                    'userId' => $user['userId'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'phone' => $user['phone']
                ];
            } else {
                $response['message'] = 'Email hoặc mật khẩu không đúng!';
            }
        }
    } elseif ($action === 'register') {
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $phone = $data['phone'] ?? '';
        error_log("Register attempt: name=$name, email=$email, phone=$phone, password=***");

        if (empty($name) || empty($email) || empty($password) || empty($phone)) {
            $response['message'] = 'Vui lòng nhập đầy đủ thông tin!';
        } else {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM user WHERE email = :email");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->fetchColumn() > 0) {
                $response['message'] = 'Email đã tồn tại!';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO user (name, email, password, phone, role) VALUES (:name, :email, :password, :phone, 'customer')");
                $stmt->bindParam(':name', $name, PDO::PARAM_STR);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
                $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
                if ($stmt->execute()) {
                    $userId = $pdo->lastInsertId();
                    
                    $stmt = $pdo->prepare("INSERT INTO cart (userId) VALUES (:userId)");
                    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                    $stmt->execute();

                    $stmt = $pdo->prepare("SELECT * FROM user WHERE userId = :userId");
                    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                    $stmt->execute();
                    $user = $stmt->fetch();

                    $response['status'] = 'success';
                    $response['message'] = 'Đăng ký thành công';
                    $response['data'] = [
                        'userId' => $user['userId'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'phone' => $user['phone']
                    ];
                } else {
                    $response['message'] = 'Lỗi khi thêm người dùng vào cơ sở dữ liệu';
                    error_log("SQL Error: " . print_r($stmt->errorInfo(), true));
                }
            }
        }
    }

    echo json_encode($response);
} catch (Exception $e) {
    error_log("Lỗi hệ thống: " . $e->getMessage());
    $response['message'] = 'Lỗi hệ thống: ' . $e->getMessage();
    echo json_encode($response);
}
?>