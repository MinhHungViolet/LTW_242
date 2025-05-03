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
require_once __DIR__ . '/../src/Controllers/AdminController.php';
require_once __DIR__ . '/../src/Controllers/CartController.php';
require_once __DIR__ . '/../src/Controllers/OrderController.php';

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
elseif (!empty($pathSegments[0]) && $pathSegments[0] === 'admin') {

    // --- BẮT BUỘC XÁC THỰC VÀ KIỂM TRA QUYỀN ADMIN CHO TẤT CẢ ROUTE /admin/* ---
    $userData = authenticate(); // Gọi hàm xác thực JWT
    if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
        http_response_code(403); // Forbidden
        echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
        exit(); // Dừng lại ngay nếu không phải Admin
    }
    // --- KẾT THÚC KIỂM TRA QUYỀN ---

    // Nếu đã qua được kiểm tra quyền Admin:
    // Khởi tạo AdminController một lần để dùng chung
    $adminController = new AdminController($pdo);

    // Phân tích tài nguyên con dưới /admin (ví dụ: users, orders)
    $adminResource = $pathSegments[1] ?? null; // Lấy segment thứ 2 (users, orders,...)

    // Xử lý dựa trên tài nguyên con
    if ($adminResource === 'users') {

        // Xử lý /admin/users/{userId}
        if (isset($pathSegments[2]) && is_numeric($pathSegments[2])) {
            $userIdToDelete = (int)$pathSegments[2];
            if ($requestMethod === 'DELETE') {
                $loggedInUserId = $userData->userId ?? 0;
                $adminController->deleteUser($userIdToDelete, $loggedInUserId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users/{id}. Chỉ hỗ trợ DELETE.']);
            }
        }
        // Xử lý /admin/users (không có ID)
        elseif (!isset($pathSegments[2])) {
            if ($requestMethod === 'POST') {
                $adminController->createUser();
            } elseif ($requestMethod === 'GET') {
                $adminController->getAllUsers(); // Gọi hàm lấy tất cả user
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users. Chỉ hỗ trợ POST, GET.']);
            }
        }
        // URL không hợp lệ dưới /admin/users/
        else {
            http_response_code(400);
            echo json_encode(['error' => 'ID người dùng không hợp lệ trong URL /admin/users/.']);
        }

    } // Kết thúc xử lý /admin/users

    // *** BỔ SUNG XỬ LÝ CHO /admin/orders ***
    elseif ($adminResource === 'orders') {

         // Xử lý /admin/orders/{orderId}/status
         // Kiểm tra có 4 segment: admin, orders, {id}, status
         if (isset($pathSegments[2]) && is_numeric($pathSegments[2]) && isset($pathSegments[3]) && $pathSegments[3] === 'status') {
             $orderId = (int)$pathSegments[2];
             if ($requestMethod === 'PUT') {
                 $adminController->updateOrderStatus($orderId); // Gọi hàm cập nhật status
             } else {
                 http_response_code(405);
                 echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders/{id}/status. Chỉ hỗ trợ PUT.']);
             }
         }
         // Xử lý /admin/orders (không có ID hay /status)
         elseif (!isset($pathSegments[2])) {
              if ($requestMethod === 'GET') {
                  $adminController->getAllOrders(); // Gọi hàm lấy tất cả order
              } else {
                  http_response_code(405);
                  echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders. Chỉ hỗ trợ GET.']);
              }
         }
         // URL không hợp lệ dưới /admin/orders
         else {
              http_response_code(404);
              echo json_encode(['error' => 'Endpoint admin orders không hợp lệ.']);
         }

    } // *** KẾT THÚC BỔ SUNG /admin/orders ***

    // Thêm các tài nguyên admin khác ở đây nếu cần (ví dụ: /admin/products)
    // elseif ($adminResource === 'products') { ... }

    else {
         // Tài nguyên admin không xác định (ví dụ: /admin/settings)
         http_response_code(404);
         echo json_encode(['error' => "Tài nguyên admin '{$adminResource}' không tồn tại."]);
    }

}
elseif (!empty($pathSegments[0]) && $pathSegments[0] === 'cart') {
    // --- Yêu cầu xác thực cho tất cả route /cart ---
    $userData = authenticate();
    if (!$userData) {
        // Hàm authenticate đã xử lý trả lỗi 401 và exit()
        // Dòng này chỉ để rõ ràng là cần userData
         exit();
    }
    // -------------------------

    $cartController = new CartController($pdo);

    // Xử lý GET /cart (không có segment con)
    if ($requestMethod === 'GET' && !isset($pathSegments[1])) {
         $cartController->getCart($userData); // <<< GỌI HÀM MỚI
    }
    // Xử lý POST /cart/items (giữ nguyên)
    elseif (!empty($pathSegments[1]) && $pathSegments[1] === 'items') {
        if ($requestMethod === 'POST') {
             $cartController->addItem($userData);
        } else {
             http_response_code(405);
             echo json_encode(['error' => 'Phương thức không hỗ trợ cho /cart/items. Chỉ hỗ trợ POST.']);
        }
    }
    // Các route con khác của /cart không được hỗ trợ
    else {
         http_response_code(404);
         echo json_encode(['error' => 'Endpoint giỏ hàng không hợp lệ.']);
    }
} // *** KẾT THÚC ROUTE CART ***


// *** THÊM ROUTE MỚI CHO ORDERS ***
elseif (!empty($pathSegments[0]) && $pathSegments[0] === 'orders') {
    // --- Yêu cầu xác thực cho tất cả route /orders ---
    $userData = authenticate();
    if (!$userData) {
         exit(); // authenticate() đã xử lý lỗi
    }
    // -------------------------

    $orderController = new OrderController($pdo);

    // Xử lý POST /orders (tạo đơn hàng - giữ nguyên)
    if ($requestMethod === 'POST' && !isset($pathSegments[1])) {
         $orderController->createOrder($userData);
    }
    // Xử lý GET /orders (lấy lịch sử - THÊM MỚI)
    elseif ($requestMethod === 'GET' && !isset($pathSegments[1])) {
          $orderController->getOrderHistory($userData); // <<< GỌI HÀM MỚI
    }
    else {
         http_response_code(405); // Hoặc 404
         echo json_encode(['error' => 'Phương thức hoặc endpoint đơn hàng không hợp lệ.']);
    }
} // *** KẾT THÚC ROUTE ORDERS ***
// Route không tồn tại
else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint không tồn tại hoặc không được tìm thấy.']);
}
exit();
?>