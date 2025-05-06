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

require_once __DIR__ . '/../src/Controllers/IntroductionController.php';
require_once __DIR__ . '/../src/Controllers/QnaController.php';


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
    $userData = authenticate(); // Gọi hàm xác thực JWT (đã tạo ở bước trước)
    // Kiểm tra xem $userData có tồn tại không VÀ role có phải là 'admin' không
    if (!$userData || !isset($userData->role) ) {
        http_response_code(403); // Forbidden
        echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
        exit(); // Dừng lại ngay nếu không phải Admin
    }
    // --- KẾT THÚC KIỂM TRA QUYỀN ---

    // Nếu đã qua được kiểm tra quyền Admin:
    $adminController = new AdminController($pdo); // Khởi tạo AdminController

    // Phân tích route con dưới /admin (ví dụ: /admin/users)
    if (!empty($pathSegments[1]) && $pathSegments[1] === 'users') {

        // Xử lý /admin/users/{userId}
        if (isset($pathSegments[2]) && is_numeric($pathSegments[2])) {
            $userIdToDelete = (int)$pathSegments[2];
            if ($requestMethod === 'DELETE') {
                // Lấy ID của admin đang đăng nhập từ token để kiểm tra tự xóa
                $loggedInUserId = $userData->userId ?? 0; // Lấy userId từ payload JWT
                $adminController->deleteUser($userIdToDelete, $loggedInUserId);
            } else {
                http_response_code(405); // Method Not Allowed
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users/{id}. Chỉ hỗ trợ DELETE.']);
            }
        }
        // Xử lý /admin/users (không có ID)
        elseif (!isset($pathSegments[2])) {
            if ($requestMethod === 'POST') {
                $adminController->createUser();
            } elseif ($requestMethod === 'GET') { // <<< THÊM ĐIỀU KIỆN NÀY
                $adminController->getAllUsers();  // <<< GỌI HÀM MỚI
            } else {
                 http_response_code(405); // Method Not Allowed
                 // Cập nhật thông báo lỗi cho rõ ràng hơn
                 echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users. Chỉ hỗ trợ POST, GET.']);
            }
        }
        // URL không hợp lệ dưới /admin/users/
        else {
            http_response_code(400);
            echo json_encode(['error' => 'ID người dùng không hợp lệ trong URL /admin/users/.']);
        }
    }
    // Thêm các route admin khác ở đây (ví dụ: /admin/orders) nếu cần
    // else if (!empty($pathSegments[1]) && $pathSegments[1] === 'orders') { ... }
    else {
         // Route con không xác định dưới /admin
         http_response_code(404);
         echo json_encode(['error' => 'Endpoint admin không tồn tại.']);
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

// Route cho introduction
elseif (!empty($pathSegments[0]) && $pathSegments[0] === 'introduction') {
    $introductionController = new IntroductionController($pdo);

    if ($requestMethod === 'GET' && !isset($pathSegments[1])) {
        $introductionController->getIntroduction();
    } elseif ($requestMethod === 'PUT' && !isset($pathSegments[1])) {
        $userData = authenticate();
        if ($userData && $userData->role === 'admin') {
            $introductionController->updateIntroduction();
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức không hợp lệ cho endpoint này.']);
    }
}

//route cho QnA
elseif (!empty($pathSegments[0]) && $pathSegments[0] === 'question') {
    $qnaController = new QnaController($pdo);

    if ($requestMethod === 'GET' && !isset($pathSegments[1])) {
        $qnaController->getQna();
    } elseif ($requestMethod === 'POST' && !isset($pathSegments[1])) {
        $qnaController->createQna();
    } elseif ($requestMethod === 'PUT' && isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
        $userData = authenticate();
        if (!$userData || $userData->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
            exit();
        }
        $questionId = (int)$pathSegments[1];
        $qnaController->updateAnswer($questionId);
    } elseif( $requestMethod === 'DELETE' && isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
        $userData = authenticate();
        if (!$userData || $userData->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
            exit();
        }
        $questionId = (int)$pathSegments[1];
        $qnaController->deleteQna($questionId);
    }
    elseif ($requestMethod === 'GET' && $pathSegments[1] === 'count' && !isset($pathSegments[2])) {
        $qnaController->getQnaCount();
    }
    elseif ($requestMethod === 'GET' && $pathSegments[1] === 'latest' && !isset($pathSegments[2])) {
        $qnaController->getLatestQna();
    }
    else {
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