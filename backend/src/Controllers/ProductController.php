<?php
// use PDO;
// use PDOException;

class ProductController {

    private $db;
    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi nghiêm trọng: Không có kết nối cơ sở dữ liệu.']);
            exit();
        }
        $this->db = $pdo;
    }

    /**
     * Hàm tiện ích để gửi JSON response chuẩn hóa
     * @param int $statusCode Mã trạng thái HTTP (vd: 200, 404, 500)
     * @param array $data Dữ liệu cần gửi (mảng PHP)
     */
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($data);
    }
    // GET - /products
    public function getAll(): void {
        try {
            $sql = "SELECT productId, name, price, image, category FROM product ORDER BY created_at DESC";
            $stmt = $this->db->query($sql);

            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(200, $products);
    
        } catch (PDOException $e) {
            error_log("API Error (ProductController::getAll): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi truy vấn danh sách sản phẩm.']);
        }
    }
    // GET - /products/{id}
    public function getById(int $id, int $statusCode = 200): void {
        if ($id <= 0) {
            $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']);
            return;
        }
        try {
            $sql = "SELECT productId, name, number AS stock_quantity, price, image, category, color, description, size, created_at
                    FROM product
                    WHERE productId = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($product) {
                $this->sendResponse($statusCode, $product);
            } else {
                $this->sendResponse(404, ['error' => "Không tìm thấy sản phẩm với ID = {$id}."]);
            }
        } catch (PDOException $e) {
            error_log("API Error (ProductController::getById {$id}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi truy vấn chi tiết sản phẩm.']);
        }
    }

    // POST - /products
    public function create(): void {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
            return;
        }

        $requiredFields = ['name', 'price', 'stock_quantity']; // Thêm các trường bắt buộc khác(chỉnh sau)
        foreach ($requiredFields as $field) {
            if (empty($inputData[$field])) {
                $this->sendResponse(400, ['error' => "Thiếu trường bắt buộc: {$field}"]);
                return;
            }
        }
        if (!is_numeric($inputData['price']) || $inputData['price'] < 0) {
             $this->sendResponse(400, ['error' => 'Giá sản phẩm không hợp lệ.']);
             return;
        }
         if (!is_int($inputData['stock_quantity']) || $inputData['stock_quantity'] < 0) {
              $this->sendResponse(400, ['error' => 'Số lượng tồn kho không hợp lệ.']);
              return;
         }

        $sql = "INSERT INTO product (name, number, price, image, category, color, description, size, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
        try {
            $stmt = $this->db->prepare($sql);

            $success = $stmt->execute([
                $inputData['name'],
                $inputData['stock_quantity'],
                $inputData['price'],
                $inputData['image'] ?? null,
                $inputData['category'] ?? null,
                $inputData['color'] ?? null,
                $inputData['description'] ?? null,
                $inputData['size'] ?? null
            ]);
    
            if ($success) {
                $newProductId = $this->db->lastInsertId();
                $this->getById((int)$newProductId, 201);
    
            } else {
                $this->sendResponse(500, ['error' => 'Không thể tạo sản phẩm do lỗi không xác định.']);
            }
    
        } catch (PDOException $e) {
            error_log("API Error (ProductController::create): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi tạo sản phẩm.']);
        }
    }
    // PUT - /products/{id}
    public function update(int $id): void {
        if ($id <= 0) {
             $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']);
             return;
        }

        $inputData = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
             $this->sendResponse(400, ['error' => 'Dữ liệu JSON không hợp lệ.']);
             return;
        }

        if (empty($inputData)) {
             $this->sendResponse(400, ['error' => 'Không có dữ liệu để cập nhật.']);
             return;
        }

        if (isset($inputData['price']) && (!is_numeric($inputData['price']) || $inputData['price'] < 0)) {
             $this->sendResponse(400, ['error' => 'Giá sản phẩm không hợp lệ.']);
             return;
        }
        if (isset($inputData['stock_quantity']) && (!is_int($inputData['stock_quantity']) || $inputData['stock_quantity'] < 0)) {
              $this->sendResponse(400, ['error' => 'Số lượng tồn kho không hợp lệ.']);
              return;
        }

        $fieldsToUpdate = []; // Mảng lưu các phần 'column = ?'
        $params = [];       // Mảng lưu các giá trị tương ứng cho placeholder

        $allowedFields = ['name', 'number', 'price', 'image', 'category', 'color', 'description', 'size'];
        foreach ($allowedFields as $field) {
            $inputKey = ($field === 'number') ? 'stock_quantity' : $field;
    
            if (array_key_exists($inputKey, $inputData)) {
                $fieldsToUpdate[] = "`{$field}` = ?";
                $params[] = $inputData[$inputKey];
            }
        }
        if (empty($fieldsToUpdate)) {
             $this->sendResponse(400, ['error' => 'Không có trường dữ liệu hợp lệ nào để cập nhật.']);
             return;
        }
        $params[] = $id;

        $setClause = implode(', ', $fieldsToUpdate);
        $sql = "UPDATE product SET {$setClause} WHERE productId = ?";
    
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            $rowCount = $stmt->rowCount();
    
            if ($rowCount > 0) {
                $this->getById($id, 200);
            } else {
                $checkStmt = $this->db->prepare("SELECT productId FROM product WHERE productId = ?");
                $checkStmt->execute([$id]);
                if ($checkStmt->fetch()) {
                     $this->getById($id, 200);
                } else {
                    $this->sendResponse(404, ['error' => "Không tìm thấy sản phẩm với ID = {$id} để cập nhật."]);
                }
            }
    
        } catch (PDOException $e) {
            error_log("API Error (ProductController::update {$id}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi cập nhật sản phẩm.']);
        }
    }

    // DEL - /products/{id}
    public function delete(int $id): void {
        if ($id <= 0) {
             $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']);
             return;
        }

        $sql = "DELETE FROM product WHERE productId = ?";
   
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);

            $rowCount = $stmt->rowCount();
   
            if ($rowCount > 0) {
                $this->sendResponse(200, ['message' => "Đã xóa thành công sản phẩm với ID = {$id}."]);
            } else {
                $this->sendResponse(404, ['error' => "Không tìm thấy sản phẩm với ID = {$id} để xóa."]);
            }
   
        } catch (PDOException $e) {
            error_log("API Error (ProductController::delete {$id}): " . $e->getMessage());
            if ($e->getCode() == 23000) {
                 $this->sendResponse(409, ['error' => "Không thể xóa sản phẩm ID {$id} do có ràng buộc dữ liệu (ví dụ: sản phẩm nằm trong đơn hàng)."]); // 409 Conflict
            } else {
                 $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xóa sản phẩm.']);
            }
        }
    }

} 
?>