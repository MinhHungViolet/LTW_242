<?php
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
    $controller = new ProductController($pdo);

    if (isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
        $productId = (int)$pathSegments[1]; 
        if ($requestMethod === 'GET') {
            $controller->getById($productId);
        } elseif ($requestMethod === 'PUT') {
            $controller->update($productId);
        } elseif ($requestMethod === 'DELETE') {
            $controller->delete($productId);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không được hỗ trợ cho endpoint này.']);
        }
    } elseif (!isset($pathSegments[1])) {
        if ($requestMethod === 'GET') {
            $controller->getAll();
        } elseif ($requestMethod === 'POST') {
            $controller->create();
        } else {
             http_response_code(405);
             echo json_encode(['error' => 'Phương thức không được hỗ trợ cho endpoint này.']);
        }
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint không tồn tại hoặc không được tìm thấy.']);
}
exit();
?>