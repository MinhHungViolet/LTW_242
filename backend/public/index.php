<?php

require_once __DIR__ . '/../vendor/autoload.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../src/Database/Connection.php';
require_once __DIR__ . '/../src/Controllers/ProductController.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php'; 
require_once __DIR__ . '/../src/helpers.php'; 

$pdo = Connection::getInstance();

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);
$basePath = '/backend/public';
if (strpos($requestPath, $basePath) === 0) { $routePath = substr($requestPath, strlen($basePath)); } else { $routePath = $requestPath; }
$routePath = trim($routePath, '/');
$pathSegments = explode('/', $routePath);

if (!$pdo) {
    http_response_code(503);
    echo json_encode(['error' => 'Không thể kết nối đến dịch vụ cơ sở dữ liệu.']);
    exit();
}

if (!empty($pathSegments[0]) && $pathSegments[0] === 'products') {
    // Tạm thời include helpers ở đây nếu chưa include ở đầu file
    // require_once __DIR__ . '/../src/helpers.php';

    $controller = new ProductController($pdo);

    // Xử lý /products/{id}
    if (isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
        $productId = (int)$pathSegments[1];

        if ($requestMethod === 'GET') {
            $controller->getById($productId);
        } elseif ($requestMethod === 'PUT') {
             // --- BẢO VỆ ROUTE PUT ---
             $userData = authenticate(); // Xác thực trước
             if ($userData && $userData->role === 'admin') { // Kiểm tra role
                 $controller->update($productId);
             } else {
                  http_response_code(403); // Forbidden
                  echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
             }
             // --- KẾT THÚC BẢO VỆ ---
        } elseif ($requestMethod === 'DELETE') {
             // --- BẢO VỆ ROUTE DELETE ---
             $userData = authenticate();
             if ($userData && $userData->role === 'admin') {
                 $controller->delete($productId);
             } else {
                 http_response_code(403);
                 echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
             }
             // --- KẾT THÚC BẢO VỆ ---
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không được hỗ trợ cho endpoint này.']);
        }
    }
    // Xử lý /products
    elseif (!isset($pathSegments[1])) {
         if ($requestMethod === 'GET') {
             $controller->getAll();
         } elseif ($requestMethod === 'POST') {
              // --- BẢO VỆ ROUTE POST ---
              $userData = authenticate();
              if ($userData && $userData->role === 'admin') {
                  $controller->create();
              } else {
                  http_response_code(403);
                  echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
              }
              // --- KẾT THÚC BẢO VỆ ---
         } else {
              http_response_code(405);
              echo json_encode(['error' => 'Phương thức không được hỗ trợ cho endpoint này.']);
         }
    }
    // Xử lý /products/abc
    else {
         http_response_code(400);
         echo json_encode(['error' => 'ID sản phẩm không hợp lệ.']);
    }
}
// Route cho Authentication
elseif (!empty($pathSegments[0]) && ($pathSegments[0] === 'register' || $pathSegments[0] === 'login')) {
     $authController = new AuthController($pdo);
     if ($pathSegments[0] === 'register' && $requestMethod === 'POST') {
          $authController->register();
     } elseif ($pathSegments[0] === 'login' && $requestMethod === 'POST') {
          $authController->login();
     } else {
          http_response_code(405);
          echo json_encode(['error' => 'Phương thức không hợp lệ cho endpoint này.']);
     }
}
// Route không tồn tại
else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint không tồn tại hoặc không được tìm thấy.']);
}
exit();
?>