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
require_once __DIR__ . '/../src/Controllers/UserController.php'; 
require_once __DIR__ . '/../src/Controllers/QnaController.php';
require_once __DIR__ . '/../src/Controllers/IntroductionController.php'; 
require_once __DIR__ . '/../src/Controllers/BlogController.php';

if (function_exists('authenticate') === false && file_exists(__DIR__ . '/../src/helpers.php')) {
    require_once __DIR__ . '/../src/helpers.php';
} elseif (function_exists('authenticate') === false) {
    function authenticate(): ?object {
        http_response_code(500);
        echo json_encode(['error' => 'Lỗi cấu hình: Hàm authenticate() không tìm thấy.']);
        exit();
    }
}

$pdo = Connection::getInstance();

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);
$basePath = '/backend/public';
if (!empty($basePath) && strpos($requestPath, $basePath) === 0) {
    $routePath = substr($requestPath, strlen($basePath));
} else {
    $routePath = $requestPath;
}
$routePath = trim($routePath, '/');
$pathSegments = explode('/', $routePath);

if (!$pdo) {
    http_response_code(503);
    echo json_encode(['error' => 'Không thể kết nối đến dịch vụ cơ sở dữ liệu.']);
    exit();
}

$mainRoute = $pathSegments[0] ?? '';

if ($mainRoute === 'products') {
    $productController = new ProductController($pdo);
    if (isset($pathSegments[1]) && is_numeric($pathSegments[1])) {
        $productId = (int)$pathSegments[1];
        switch ($requestMethod) {
            case 'GET':
                $productController->getById($productId);
                break;
            case 'POST':
                $userData = authenticate();
                if ($userData && $userData->role === 'admin') {
                    $productController->update($productId);
                }
                break;
            case 'DELETE':
                $userData = authenticate();
                if ($userData && $userData->role === 'admin') {
                    $productController->delete($productId);
                } else {
                    http_response_code(403);
                    echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /products/{id}.']);
                break;
        }
    } elseif (!isset($pathSegments[1])) {
        switch ($requestMethod) {
            case 'GET':
                $productController->getAll();
                break;
            case 'POST':
                $userData = authenticate();
                if ($userData && $userData->role === 'admin') {
                    $productController->create();
                } else {
                    http_response_code(403);
                    echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /products.']);
                break;
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'ID sản phẩm không hợp lệ.']);
    }
} elseif ($mainRoute === 'register') {
    // === Route cho Register ===
    if ($requestMethod === 'POST') {
        $authController = new AuthController($pdo);
        $authController->register();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức chỉ hỗ trợ POST cho /register.']);
    }
} elseif ($mainRoute === 'login') {
    // === Route cho Login ===
    if ($requestMethod === 'POST') {
        $authController = new AuthController($pdo);
        $authController->login();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức chỉ hỗ trợ POST cho /login.']);
    }
} elseif ($mainRoute === 'admin') {
    // === Route cho Admin ===
    $userData = authenticate();
    if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
        exit();
    }

    $adminController = new AdminController($pdo);
    $adminResource = $pathSegments[1] ?? null;

    if ($adminResource === 'users') {
        if (isset($pathSegments[2]) && is_numeric($pathSegments[2])) {
            $userIdParam = (int)$pathSegments[2];
            if ($requestMethod === 'DELETE') {
                $loggedInUserId = $userData->userId ?? 0;
                $adminController->deleteUser($userIdParam, $loggedInUserId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users/{id}. Chỉ hỗ trợ DELETE.']);
            }
        } elseif (!isset($pathSegments[2])) {
            if ($requestMethod === 'POST') {
                $adminController->createUser();
            } elseif ($requestMethod === 'GET') {
                $adminController->getAllUsers();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/users. Chỉ hỗ trợ POST, GET.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID người dùng không hợp lệ trong URL /admin/users/.']);
        }
    } elseif ($adminResource === 'orders') {
        $orderId = isset($pathSegments[2]) && is_numeric($pathSegments[2]) ? (int)$pathSegments[2] : null;
        $actionOrStatus = $pathSegments[3] ?? null;

        if ($orderId !== null && $actionOrStatus === 'status') {
            if ($requestMethod === 'PUT') {
                $adminController->updateOrderStatus($orderId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders/{id}/status. Chỉ hỗ trợ PUT.']);
            }
        } elseif ($orderId !== null && $actionOrStatus === null) {
            if ($requestMethod === 'GET') {
                $adminController->getOrderDetailAsAdmin($orderId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders/{id}. Chỉ hỗ trợ GET.']);
            }
        } elseif ($orderId === null && $actionOrStatus === null && !isset($pathSegments[2])) {
            if ($requestMethod === 'GET') {
                $adminController->getAllOrders();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /admin/orders. Chỉ hỗ trợ GET.']);
            }
        } else {
            if (isset($pathSegments[2]) && !is_numeric($pathSegments[2])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID đơn hàng trong URL không hợp lệ (phải là số).']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint admin orders không hợp lệ hoặc không được tìm thấy.']);
            }
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => "Tài nguyên admin '{$adminResource}' không tồn tại."]);
    }
} elseif ($mainRoute === 'cart') {
    $userData = authenticate();
    if (!$userData) {
        exit();
    }

    $cartController = new CartController($pdo);
    $subResource = $pathSegments[1] ?? null;
    $itemId = isset($pathSegments[2]) && is_numeric($pathSegments[2]) ? (int)$pathSegments[2] : null;

    if ($subResource === 'items') {
        if ($itemId !== null) {
            if ($requestMethod === 'DELETE') {
                $cartController->removeItem($userData, $itemId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /cart/items/{id}. Chỉ hỗ trợ DELETE.']);
            }
        } elseif ($requestMethod === 'POST' && $itemId === null) {
            $cartController->addItem($userData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint /cart/items không hợp lệ hoặc phương thức không đúng (chỉ hỗ trợ POST /cart/items và DELETE /cart/items/{id}).']);
        }
    } elseif ($subResource === null) {
        if ($requestMethod === 'GET') {
            $cartController->getCart($userData);
        } elseif ($requestMethod === 'PUT') {
            $cartController->updateCart($userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /cart. Chỉ hỗ trợ GET, PUT.']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint giỏ hàng không hợp lệ.']);
    }
} elseif ($mainRoute === 'orders') {
    $userData = authenticate();
    if (!$userData) exit();
    $orderController = new OrderController($pdo);
    $orderId = isset($pathSegments[1]) && is_numeric($pathSegments[1]) ? (int)$pathSegments[1] : null;
    if ($requestMethod === 'POST' && !isset($pathSegments[1])) {
        $orderController->createOrder($userData);
    } elseif ($requestMethod === 'GET') {
        if ($orderId !== null) {
            $orderController->getOrderDetail($userData, $orderId);
        } else {
            $orderController->getOrderHistory($userData);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức hoặc endpoint đơn hàng không hợp lệ.']);
    }
} elseif ($mainRoute === 'user') {
    $userData = authenticate();
    if (!$userData) {
        exit();
    }

    $userController = new UserController($pdo);
    $userResource = $pathSegments[1] ?? null;

    if ($userResource === 'profile') {
        if ($requestMethod === 'GET') {
            $userController->getProfile($userData);
        } elseif ($requestMethod === 'POST') {
            $userController->updateProfile($userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /user/profile. Chỉ hỗ trợ GET, PUT.']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint người dùng không hợp lệ hoặc không được tìm thấy.']);
    }
} elseif ($mainRoute === 'introduction') {
    $introductionController = new IntroductionController($pdo);
    $actionSegment = $pathSegments[1] ?? null;

    if ($actionSegment === null) {
        switch ($requestMethod) {
            case 'GET':
                $introductionController->getIntroduction();
                break;
            case 'PUT':
                $userData = authenticate();
                if ($userData && $userData->role === 'admin') {
                    $introductionController->updateIntroduction();
                } else {
                    http_response_code(403);
                    echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /introduction. Chỉ hỗ trợ GET, PUT.']);
                break;
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint introduction không hợp lệ.']);
    }
} elseif ($mainRoute === 'question') {
    $qnaController = new QnaController($pdo);
    $actionOrId = $pathSegments[1] ?? null;
    $qnaId = is_numeric($actionOrId) ? (int)$actionOrId : null;
    $qnaAction = is_string($actionOrId) && !$qnaId ? $actionOrId : null;
    $extraSegment = $pathSegments[2] ?? null;

    if ($actionOrId === null) {
        if ($requestMethod === 'GET') {
            $qnaController->getQna();
        } elseif ($requestMethod === 'POST') {
            $qnaController->createQna();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /question. Chỉ hỗ trợ GET, POST.']);
        }
    } elseif ($qnaId !== null) {
        if ($extraSegment === null) {
            if ($requestMethod === 'PUT') {
                $userData = authenticate();
                if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
                    http_response_code(403);
                    echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                    exit();
                }
                $qnaController->updateAnswer($qnaId);
            } elseif ($requestMethod === 'DELETE') {
                $userData = authenticate();
                if (!$userData || !isset($userData->role) || $userData->role !== 'admin') {
                    http_response_code(403);
                    echo json_encode(['error' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.']);
                    exit();
                }
                $qnaController->deleteQna($qnaId);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Phương thức không hỗ trợ cho /question/{id}. Chỉ hỗ trợ PUT, DELETE.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint QnA không hợp lệ.']);
        }
    } elseif ($qnaAction !== null && $extraSegment === null) {
        if ($requestMethod === 'GET') {
            if ($qnaAction === 'count') {
                $qnaController->getQnaCount();
            } elseif ($qnaAction === 'latest') {
                $qnaController->getLatestQna();
            } else {
                http_response_code(404);
                echo json_encode(['error' => "Hành động '{$qnaAction}' không hợp lệ cho QnA."]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => "Phương thức không hỗ trợ cho /question/{$qnaAction}. Chỉ hỗ trợ GET."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint QnA không hợp lệ hoặc không được tìm thấy.']);
    }
} elseif ($mainRoute === 'blog') {
    // === Route cho Blog ===
    $blogController = new BlogController($pdo);
    
    // Phân tích các segment của URL
    $blogIdOrAction = $pathSegments[1] ?? null;
    $blogId = is_numeric($blogIdOrAction) ? (int)$blogIdOrAction : null;
    $extraSegment = $pathSegments[2] ?? null;
    
    // Trường hợp 1: /blog - Lấy danh sách bài viết
    if ($blogIdOrAction === null) {
        if ($requestMethod === 'GET') {
            $blogController->getAll();
        } elseif ($requestMethod === 'POST') {
            // Yêu cầu xác thực cho việc tạo bài viết
            $userData = authenticate();
            if (!$userData) {
                exit();
            }
            $blogController->create($userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /blog. Chỉ hỗ trợ GET, POST.']);
        }
    }
    // Trường hợp 2: /blog/{id} - Thao tác với một bài viết cụ thể
    elseif ($blogId !== null && $extraSegment === null) {
        if ($requestMethod === 'GET') {
            $blogController->getById($blogId);
        } elseif ($requestMethod === 'PUT') {
            // Yêu cầu xác thực cho việc cập nhật bài viết
            $userData = authenticate();
            if (!$userData) {
                exit();
            }
            $blogController->update($blogId, $userData);
        } elseif ($requestMethod === 'DELETE') {
            // Yêu cầu xác thực cho việc xóa bài viết
            $userData = authenticate();
            if (!$userData) {
                exit();
            }
            $blogController->delete($blogId, $userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /blog/{id}. Chỉ hỗ trợ GET, PUT, DELETE.']);
        }
    }
    // Trường hợp 3: /blog/{id}/comments - Thao tác với bình luận của bài viết
    elseif ($blogId !== null && $extraSegment === 'comments') {
        if ($requestMethod === 'GET') {
            $blogController->getComments($blogId);
        } elseif ($requestMethod === 'POST') {
            // Yêu cầu xác thực cho việc thêm bình luận
            $userData = authenticate();
            if (!$userData) {
                exit();
            }
            $blogController->addComment($blogId, $userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /blog/{id}/comments. Chỉ hỗ trợ GET, POST.']);
        }
    }
    // Trường hợp 4: /blog/comments/{id} - Xóa bình luận
    elseif ($blogIdOrAction === 'comments' && is_numeric($extraSegment)) {
        $commentId = (int)$extraSegment;
        if ($requestMethod === 'DELETE') {
            // Yêu cầu xác thực cho việc xóa bình luận
            $userData = authenticate();
            if (!$userData) {
                exit();
            }
            $blogController->deleteComment($commentId, $userData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Phương thức không hỗ trợ cho /blog/comments/{id}. Chỉ hỗ trợ DELETE.']);
        }
    }
    // Trường hợp 5: Các route khác không hợp lệ
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint blog không hợp lệ.']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint không tồn tại hoặc không được tìm thấy.']);
}

exit();
?>
