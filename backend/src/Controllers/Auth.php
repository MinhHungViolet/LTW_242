<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../Database/Connection.php';

$response = ['status' => 'error', 'message' => 'Yêu cầu không hợp lệ', 'data' => null];

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $pdo = Connection::getInstance();

    if ($method === 'GET') {
        if (isset($_GET['action']) && $_GET['action'] === 'getUserInfo') {
            $userId = $_GET['userId'] ?? null;
            if (!$userId) {
                $response['message'] = 'Thiếu userId';
                echo json_encode($response);
                exit;
            }

            $stmt = $pdo->prepare("SELECT userId, name, email, phone, birthDate, gender, avatar FROM user WHERE userId = :userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userData) {
                $response['status'] = 'success';
                $response['data'] = $userData;
            } else {
                $response['message'] = 'Không tìm thấy thông tin người dùng';
            }
            echo json_encode($response);
            exit;
        }
    } elseif ($method === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!$data || !isset($data['action'])) {
            echo json_encode($response);
            exit;
        }

        $action = $data['action'];

        if ($action === 'updateUserInfo') {
            $userId = $data['userId'] ?? null;
            $userData = $data['userData'] ?? null;

            if (!$userId || !$userData) {
                $response['message'] = 'Thiếu thông tin cập nhật';
                echo json_encode($response);
                exit;
            }

            $allowedFields = ['name', 'phone', 'birthDate', 'gender', 'avatar'];
            $updates = [];
            $params = [];

            foreach ($allowedFields as $field) {
                if (isset($userData[$field])) {
                    $updates[] = "$field = :$field";
                    $params[$field] = $userData[$field];
                }
            }

            if (!empty($updates)) {
                $params['userId'] = $userId;
                $sql = "UPDATE user SET " . implode(', ', $updates) . " WHERE userId = :userId";
                $stmt = $pdo->prepare($sql);
                
                if ($stmt->execute($params)) {
                    $response['status'] = 'success';
                    $response['message'] = 'Cập nhật thông tin thành công';
                } else {
                    $response['message'] = 'Lỗi khi cập nhật thông tin';
                }
            } else {
                $response['message'] = 'Không có thông tin để cập nhật';
            }
            echo json_encode($response);
            exit;
        } elseif ($action === 'login') {
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
    }

    echo json_encode($response);
} catch (Exception $e) {
    error_log("Lỗi hệ thống: " . $e->getMessage());
    $response['message'] = 'Lỗi hệ thống: ' . $e->getMessage();
    echo json_encode($response);
}
?>