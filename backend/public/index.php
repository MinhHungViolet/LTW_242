<?php


 // Nạp autoloader của Composer (Quan trọng cho thư viện JWT)
 require_once __DIR__ . '/../vendor/autoload.php';

 // --- Headers Cơ Bản Cho API ---
 header("Content-Type: application/json; charset=UTF-8");
 header("Access-Control-Allow-Origin: *"); // Thay * bằng domain frontend khi deploy
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 // Xử lý request OPTIONS CORS Preflight
 if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
     http_response_code(200);
     exit();
 }

 // --- Include các file cần thiết ---
 require_once __DIR__ . '/../src/Database/Connection.php';
 require_once __DIR__ . '/../src/Controllers/ProductController.php';
 require_once __DIR__ . '/../src/Controllers/AuthController.php';
 require_once __DIR__ . '/../src/helpers.php'; // Include nếu hàm authenticate() ở đây
 require_once __DIR__ . '/../src/Controllers/AdminController.php';
 require_once __DIR__ . '/../src/Controllers/CartController.php';
 require_once __DIR__ . '/../src/Controllers/OrderController.php';
 require_once __DIR__ . '/../src/Controllers/UserController.php'; // Đã có UserController
 require_once __DIR__ . '/../src/Controllers/QnaController.php'; // Đã có UserController
 require_once __DIR__ . '/../src/Controllers/IntroductionController.php'; // Đã có UserController

 // --- Hàm Xác Thực JWT (Giả định đã có trong helpers.php hoặc được include đúng cách) ---
 // Nếu hàm authenticate() chưa được include, bạn cần đảm bảo nó được nạp vào ở đây
 // Ví dụ: Lấy từ helpers.php
 if (function_exists('authenticate') === false && file_exists(__DIR__ . '/../src/helpers.php')) {
      require_once __DIR__ . '/../src/helpers.php';
 } elseif (function_exists('authenticate') === false) {
      // Định nghĩa tạm thời ở đây nếu không có file helpers
      // !!! Nên tách ra file riêng !!!
      function authenticate(): ?object {
           // Dán code hàm authenticate() đầy đủ vào đây nếu cần
           // Ví dụ:
           // $jwtSecretKey = 'YOUR_REALLY_STRONG_AND_SECRET_KEY_HERE_12345!';
           // ... (phần còn lại của hàm authenticate) ...
           // return $decoded;
           // Hoặc báo lỗi nếu không tìm thấy hàm
           http_response_code(500); echo json_encode(['error' => 'Lỗi cấu hình: Hàm authenticate() không tìm thấy.']); exit();
      }
 }


 // --- Lấy kết nối Database ---
 $pdo = Connection::getInstance();

 // --- Phân tích URL và Phương thức HTTP ---
 $requestUri = $_SERVER['REQUEST_URI'];
 $requestMethod = $_SERVER['REQUEST_METHOD'];
 $requestPath = parse_url($requestUri, PHP_URL_PATH);
 $basePath = '/backend/public'; // Đảm bảo đúng basePath của bạn
 if (!empty($basePath) && strpos($requestPath, $basePath) === 0) { $routePath = substr($requestPath, strlen($basePath)); } else { $routePath = $requestPath; }
 $routePath = trim($routePath, '/');
 $pathSegments = explode('/', $routePath);

 // --- Routing Logic ---
 if (!$pdo) { http_response_code(503); echo json_encode(['error' => 'Không thể kết nối đến dịch vụ cơ sở dữ liệu.']); exit(); }

 $mainRoute = $pathSegments[0] ?? '';

 if ($mainRoute === 'products') {
     // === Route cho Products ===
     $productController = new ProductController($pdo);
     // /products/{id}
     if (isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
         $productId = (int)$pathSegments[1];
         switch ($requestMethod) {
             case 'GET': $productController->getById($productId); break;
             case 'POST':
                $userData = authenticate();
                if ($userData && $userData->role === 'admin') {
                    if ($requestMethod === 'POST') $productController->update($productId);
                }
             case 'DELETE':
                 $userData = authenticate();
                 if ($userData && $userData->role === 'admin') {
                    //  if ($requestMethod === 'POST') $productController->update($productId);
                     if ($requestMethod === 'DELETE') $productController->delete($productId);
                 } else { http_response_code(403); echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']); }
                 break;
             default: http_response_code(405); echo json_encode(['error' => 'Phương thức không hỗ trợ cho /products/{id}.']); break;

         }
     }
     // /products
     elseif (!isset($pathSegments[1])) {
          switch ($requestMethod) {
              case 'GET': $productController->getAll(); break;
              case 'POST':
                  $userData = authenticate();
                  if ($userData && $userData->role === 'admin') { $productController->create(); }
                  else { http_response_code(403); echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']); }
                  break;
              default: http_response_code(405); echo json_encode(['error' => 'Phương thức không hỗ trợ cho /products.']); break;
          }
     } else { http_response_code(400); echo json_encode(['error' => 'ID sản phẩm không hợp lệ.']); }

 } elseif ($mainRoute === 'register') {
     // === Route cho Register ===
     if ($requestMethod === 'POST') { $authController = new AuthController($pdo); $authController->register(); }
     else { http_response_code(405); echo json_encode(['error' => 'Phương thức chỉ hỗ trợ POST cho /register.']); }

 } elseif ($mainRoute === 'login') {
     // === Route cho Login ===
      if ($requestMethod === 'POST') { $authController = new AuthController($pdo); $authController->login(); }
      else { http_response_code(405); echo json_encode(['error' => 'Phương thức chỉ hỗ trợ POST cho /login.']); }

 } elseif ($mainRoute === 'admin') {
     // === Route cho Admin ===
     $userData = authenticate();
     if (!$userData || !isset($userData->role) || $userData->role !== 'admin') { http_response_code(403); echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']); exit(); }

     $adminController = new AdminController($pdo);
     $adminResource = $pathSegments[1] ?? null;

     if ($adminResource === 'users') { // /admin/users...
         if (isset($pathSegments[2]) && is_numeric($pathSegments[2])) { // /admin/users/{id}
             $userIdParam = (int)$pathSegments[2];
             if ($requestMethod === 'DELETE') { $loggedInUserId = $userData->userId ?? 0; $adminController->deleteUser($userIdParam, $loggedInUserId); }
             else { http_response_code(405); echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users/{id}. Chỉ hỗ trợ DELETE.']); }
         } elseif (!isset($pathSegments[2])) { // /admin/users
             if ($requestMethod === 'POST') { $adminController->createUser(); }
             elseif ($requestMethod === 'GET') { $adminController->getAllUsers(); }
             else { http_response_code(405); echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users. Chỉ hỗ trợ POST, GET.']); }
         } else { http_response_code(400); echo json_encode(['error' => 'ID người dùng không hợp lệ trong URL /admin/users/.']); }
     } elseif ($adminResource === 'orders') { // Xử lý các request bắt đầu bằng /admin/orders

        // Phân tích các phần tiếp theo của URL
        // $pathSegments[0] là 'admin'
        // $pathSegments[1] là 'orders'
        $orderId = isset($pathSegments[2]) && is_numeric($pathSegments[2]) ? (int)$pathSegments[2] : null; // Lấy ID đơn hàng (nếu có và là số)
        $actionOrStatus = $pathSegments[3] ?? null; // Lấy phần tử thứ 4 (ví dụ: 'status')

        // --- Phân loại và xử lý dựa trên cấu trúc URL và Method ---

        // Trường hợp 1: URL là /admin/orders/{orderId}/status (Cập nhật trạng thái)
        if ($orderId !== null && $actionOrStatus === 'status') {
            if ($requestMethod === 'PUT') {
                // Gọi hàm cập nhật status trong AdminController
                $adminController->updateOrderStatus($orderId);
            } else {
                // Chỉ hỗ trợ PUT cho URL này
                http_response_code(405); // Method Not Allowed
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders/{id}/status. Chỉ hỗ trợ PUT.']);
            }
        }

        // Trường hợp 2: URL là /admin/orders/{orderId} (Xem chi tiết đơn hàng)
        elseif ($orderId !== null && $actionOrStatus === null) { // Có ID nhưng không có action 'status' theo sau
             if ($requestMethod === 'GET') {
                 // Gọi hàm lấy chi tiết đơn hàng trong AdminController
                 $adminController->getOrderDetailAsAdmin($orderId);
             } else {
                  // Chỉ hỗ trợ GET cho URL này
                  http_response_code(405); // Method Not Allowed
                  echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders/{id}. Chỉ hỗ trợ GET.']);
             }
        }

        // Trường hợp 3: URL là /admin/orders (Xem danh sách tất cả đơn hàng)
        elseif ($orderId === null && $actionOrStatus === null && !isset($pathSegments[2])) { // Không có ID và không có action
             if ($requestMethod === 'GET') {
                 // Gọi hàm lấy tất cả đơn hàng trong AdminController
                 $adminController->getAllOrders();
             } else {
                 // Chỉ hỗ trợ GET cho URL này
                 http_response_code(405); // Method Not Allowed
                 echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders. Chỉ hỗ trợ GET.']);
             }
        }

        // Trường hợp 4: Các cấu trúc URL khác dưới /admin/orders không hợp lệ
        else {
             // Kiểm tra xem segment thứ 3 có tồn tại nhưng không phải là số không (lỗi ID)
             if (isset($pathSegments[2]) && !is_numeric($pathSegments[2])) {
                  http_response_code(400); // Bad Request
                  echo json_encode(['error' => 'ID đơn hàng trong URL không hợp lệ (phải là số).']);
             } else {
                  // Các trường hợp khác (vd: /admin/orders/1/abc, /admin/orders/abc/status)
                  http_response_code(404); // Not Found
                  echo json_encode(['error' => 'Endpoint admin orders không hợp lệ hoặc không được tìm thấy.']);
             }
        }

   } else { http_response_code(404); echo json_encode(['error' => "Tài nguyên admin '{$adminResource}' không tồn tại."]); }

 } elseif ($mainRoute === 'cart') {
    // === Route cho Cart ===
    // --- Yêu cầu xác thực cho tất cả /cart/* ---
    $userData = authenticate(); // Lấy thông tin user từ token

    if (!$userData) {
        // Hàm authenticate() đã tự xử lý trả lỗi 401 và exit()
        exit(); // Dừng lại nếu không xác thực được
    }
    // --- Kết thúc kiểm tra xác thực ---

    // Khởi tạo CartController
    $cartController = new CartController($pdo);

    // Phân tích các phần con của đường dẫn (sub-resource và item ID)
    $subResource = $pathSegments[1] ?? null;
    $itemId = isset($pathSegments[2]) && is_numeric($pathSegments[2]) ? (int)$pathSegments[2] : null;

    // --- Xử lý các route con ---

    // 1. Xử lý các route dưới /cart/items
    if ($subResource === 'items') {

        // 1a. Xử lý /cart/items/{productId} (Chỉ cho phép DELETE)
        if ($itemId !== null) { // Có segment thứ 3 là ID sản phẩm
            if ($requestMethod === 'DELETE') {
                // Gọi hàm xóa sản phẩm khỏi giỏ hàng
                $cartController->removeItem($userData, $itemId);
            } else {
                // Các phương thức khác (GET, PUT, POST) cho /cart/items/{id} không được hỗ trợ
                http_response_code(405); // Method Not Allowed
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /cart/items/{id}. Chỉ hỗ trợ DELETE.']);
            }
        }
        // 1b. Xử lý /cart/items (Không có ID - Chỉ cho phép POST để thêm mới)
        elseif ($requestMethod === 'POST' && $itemId === null) {
             // Giữ lại chức năng thêm sản phẩm vào giỏ
             $cartController->addItem($userData);
        }
        // 1c. Các trường hợp khác dưới /cart/items không hợp lệ
        else {
              http_response_code(404); // Hoặc 405
              echo json_encode(['error' => 'Endpoint /cart/items không hợp lệ hoặc phương thức không đúng (chỉ hỗ trợ POST /cart/items và DELETE /cart/items/{id}).']);
        }
    }

    // 2. Xử lý route /cart (Không có sub-resource - Cho phép GET và PUT)
    elseif ($subResource === null) {
         if ($requestMethod === 'GET') {
             // Gọi hàm xem giỏ hàng
             $cartController->getCart($userData);
         } elseif ($requestMethod === 'PUT') {
             // Gọi hàm cập nhật toàn bộ giỏ hàng (dùng cho nút "Cập nhật giỏ hàng")
             $cartController->updateCart($userData);
         } else {
              // Các phương thức khác (POST, DELETE...) cho /cart không được hỗ trợ
              http_response_code(405);
              echo json_encode(['error' => 'Phương thức không hỗ trợ cho /cart. Chỉ hỗ trợ GET, PUT.']);
         }
    }

    // 3. Các route con khác dưới /cart không được hỗ trợ (ví dụ: /cart/history)
    else {
         http_response_code(404);
         echo json_encode(['error' => 'Endpoint giỏ hàng không hợp lệ.']);
    }

} elseif ($mainRoute === 'orders') {
     // === Route cho Orders (User) ===
     $userData = authenticate();
     if (!$userData) exit();
     $orderController = new OrderController($pdo);
     $orderId = isset($pathSegments[1]) && is_numeric($pathSegments[1]) ? (int)$pathSegments[1] : null;
     if ($requestMethod === 'POST' && !isset($pathSegments[1])) { // POST /orders
          $orderController->createOrder($userData);
     } elseif ($requestMethod === 'GET') {
        if ($orderId !== null) {
            // *** Gọi hàm xem chi tiết đơn hàng ***
            $orderController->getOrderDetail($userData, $orderId);
        } else {
            // *** Gọi hàm xem lịch sử đơn hàng (không có ID) ***
            $orderController->getOrderHistory($userData);
        }
   } else { http_response_code(405); echo json_encode(['error' => 'Phương thức hoặc endpoint đơn hàng không hợp lệ.']); }

 // *** ↓↓↓ BẮT ĐẦU PHẦN BỔ SUNG CHO USER PROFILE ↓↓↓ ***
 } elseif ($mainRoute === 'user') {
     // === Route cho User Profile (Của chính người dùng) ===
     // --- Yêu cầu xác thực ---
     $userData = authenticate(); // Lấy thông tin user từ token
     if (!$userData) { exit(); } // Hàm authenticate đã xử lý lỗi 401

     $userController = new UserController($pdo); // Khởi tạo UserController

     // Phân tích route con dưới /user
     $userResource = $pathSegments[1] ?? null;

     if ($userResource === 'profile') {
         // Xử lý /user/profile
         if ($requestMethod === 'GET') {
             // Gọi hàm lấy thông tin profile
             $userController->getProfile($userData);
         } elseif ($requestMethod === 'POST') {
             // Gọi hàm cập nhật profile (nhận multipart/form-data)
             $userController->updateProfile($userData);
         } else {
             // Phương thức khác không được hỗ trợ
             http_response_code(405); echo json_encode(['error' => 'Phương thức không hỗ trợ cho /user/profile. Chỉ hỗ trợ GET, PUT.']);
         }
     }
     // Các đường dẫn con khác dưới /user không hợp lệ
     else {
          http_response_code(404); echo json_encode(['error' => 'Endpoint người dùng không hợp lệ hoặc không được tìm thấy.']);
     }
 // *** ↑↑↑ KẾT THÚC PHẦN BỔ SUNG USER PROFILE ↑↑↑ ***

 } 
 elseif ($mainRoute === 'introduction') {
    // === Route cho Introduction ===
    $introductionController = new IntroductionController($pdo); // Khởi tạo Controller
    $actionSegment = $pathSegments[1] ?? null; // Kiểm tra xem có segment con không

    // Chỉ xử lý route gốc /introduction, không có segment con
    if ($actionSegment === null) {
         switch ($requestMethod) {
             case 'GET':
                 // Lấy thông tin introduction (Public)
                 $introductionController->getIntroduction();
                 break;
             case 'PUT':
                 // Cập nhật introduction (Yêu cầu Admin)
                 $userData = authenticate(); // Xác thực
                 if ($userData && $userData->role === 'admin') { // Phân quyền
                     $introductionController->updateIntroduction();
                 } else {
                     http_response_code(403);
                     echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                 }
                 break;
             default:
                 // Các phương thức khác không được hỗ trợ
                 http_response_code(405);
                 echo json_encode(['error' => 'Phương thức không hỗ trợ cho /introduction. Chỉ hỗ trợ GET, PUT.']);
                 break;
         }
    } else {
         // Không hỗ trợ các đường dẫn con dưới /introduction
         http_response_code(404);
         echo json_encode(['error' => 'Endpoint introduction không hợp lệ.']);
    }
} elseif ($mainRoute === 'question') { // Xử lý các request bắt đầu bằng /question
    // === Route cho QnA ===
    $qnaController = new QnaController($pdo); // Khởi tạo QnaController

    // Phân tích các segment con
    $actionOrId = $pathSegments[1] ?? null; // Lấy segment thứ 2
    $qnaId = is_numeric($actionOrId) ? (int)$actionOrId : null; // Lấy ID nếu là số
    $qnaAction = is_string($actionOrId) && !$qnaId ? $actionOrId : null; // Lấy action nếu là chữ
    $extraSegment = $pathSegments[2] ?? null; // Kiểm tra segment thứ 3

    // --- Xử lý dựa trên cấu trúc URL và Method ---

    // Trường hợp 1: URL là /question (Không có segment con)
    if ($actionOrId === null) {
        if ($requestMethod === 'GET') {
            $qnaController->getQna(); // Giữ nguyên lời gọi hàm
        } elseif ($requestMethod === 'POST') {
             // Giữ nguyên logic xác thực cho POST nếu bạn muốn (hoặc bỏ đi nếu không cần)
             // $userData = authenticate();
             // if (!$userData) { exit(); }
            $qnaController->createQna(); // Giữ nguyên lời gọi hàm createQna
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /question. Chỉ hỗ trợ GET, POST.']);
        }
    }
    // Trường hợp 2: URL là /question/{id} (Có ID là số)
    elseif ($qnaId !== null) {
         // Đảm bảo không có segment nào sau ID
         if ($extraSegment === null) {
               if ($requestMethod === 'PUT') {
                   // Giữ nguyên logic xác thực và phân quyền Admin
                   $userData = authenticate();
                   if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
                       http_response_code(403); echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']); exit();
                   }
                   $qnaController->updateAnswer($qnaId); // Giữ nguyên lời gọi hàm
               } elseif ($requestMethod === 'DELETE') {
                    // Giữ nguyên logic xác thực và phân quyền Admin
                    $userData = authenticate();
                    if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
                        http_response_code(403); echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']); exit();
                    }
                    $qnaController->deleteQna($qnaId); // Giữ nguyên lời gọi hàm
               } else {
                   // Các phương thức khác cho /question/{id} không được hỗ trợ trong logic bạn cung cấp
                   http_response_code(405);
                   echo json_encode(['error' => 'Phương thức không hỗ trợ cho /question/{id}. Chỉ hỗ trợ PUT, DELETE.']);
               }
         } else {
              // URL dạng /question/123/abc không hợp lệ
              http_response_code(404); echo json_encode(['error' => 'Endpoint QnA không hợp lệ.']);
         }
    }
    // Trường hợp 3: URL là /question/count hoặc /question/latest
    elseif ($qnaAction !== null && $extraSegment === null) {
        if ($requestMethod === 'GET') {
            if ($qnaAction === 'count') {
                $qnaController->getQnaCount(); // Giữ nguyên lời gọi hàm
            } elseif ($qnaAction === 'latest') {
                $qnaController->getLatestQna(); // Giữ nguyên lời gọi hàm
            } else {
                 // Action không phải 'count' hay 'latest'
                 http_response_code(404); echo json_encode(['error' => "Hành động '{$qnaAction}' không hợp lệ cho QnA."]);
            }
        } else {
             // Chỉ hỗ trợ GET cho /question/count và /question/latest
             http_response_code(405); echo json_encode(['error' => "Phương thức không hỗ trợ cho /question/{$qnaAction}. Chỉ hỗ trợ GET."]);
        }
    }
    // Trường hợp 4: Các cấu trúc URL khác không hợp lệ
    else {
         http_response_code(404); echo json_encode(['error' => 'Endpoint QnA không hợp lệ hoặc không được tìm thấy.']);
    }
}
 else {
     // === Route không tồn tại ===
     http_response_code(404);
     echo json_encode(['error' => 'Endpoint không tồn tại hoặc không được tìm thấy.']);
 }

 exit(); // Đảm bảo script dừng lại

 ?>
