<?php

class ProductController {

    private $db;
    private $productImageUploadDir; // Thêm biến lưu đường dẫn thư mục upload

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(['error' => 'Lỗi nghiêm trọng: Không có kết nối cơ sở dữ liệu trong ProductController.']);
            exit();
        }
        $this->db = $pdo;
        $this->productImageUploadDir = __DIR__ . '/../../public/uploads/products/';
        if (!is_dir($this->productImageUploadDir)) {
            mkdir($this->productImageUploadDir, 0775, true);
        }
    }

    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        if (!headers_sent()) {
             header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode($data);
    }

    // GET - /products (Giữ nguyên)
    public function getAll(): void {
        try {
            $sql = "SELECT productId, name, price, image, category, number as stock_quantity, color FROM product ORDER BY created_at DESC";
            $stmt = $this->db->query($sql);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(200, $products);
        } catch (PDOException $e) {
            error_log("API Error (ProductController::getAll): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi truy vấn danh sách sản phẩm.']);
        }
    }

    // GET - /products/{id} (Giữ nguyên, có thể thêm imageUrl như getAll)
    public function getById(int $id, int $statusCode = 200): void {
        if ($id <= 0) { $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']); return; }
        try {
            // Đổi tên cột 'number' thành 'stock_quantity' cho rõ ràng khi trả về
            $sql = "SELECT productId, name, number AS stock_quantity, price, image, category, color, description, size, created_at
                    FROM product WHERE productId = ?";
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

    // *** HÀM CREATE ĐỂ NHẬN FORM-DATA VÀ FILE ***
    public function create(): void {
        // 1. Đọc dữ liệu text từ $_POST
        $name = trim($_POST['name'] ?? '');
        $stock_quantity = filter_var($_POST['stock_quantity'] ?? null, FILTER_VALIDATE_INT); 
        $price = filter_var($_POST['price'] ?? null, FILTER_VALIDATE_FLOAT); 
        $category = trim($_POST['category'] ?? '');
        $color = trim($_POST['color'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $size = trim($_POST['size'] ?? '');

        // 2. Validate dữ liệu bắt buộc
        if (empty($name)) { $this->sendResponse(400, ['error' => "Thiếu trường bắt buộc: name"]); return; }
        if ($stock_quantity === false || $stock_quantity < 0) { $this->sendResponse(400, ['error' => "Số lượng tồn kho (stock_quantity) không hợp lệ."]); return; }
        if ($price === false || $price < 0) { $this->sendResponse(400, ['error' => "Giá sản phẩm (price) không hợp lệ."]); return; }

        // 3. Xử lý file ảnh sản phẩm 
        $imageFileName = null;
        $destinationPath = null;
        if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['productImage'];
            error_log("DEBUG Product Create: Received productImage: " . print_r($file, true));

            $maxSize = 5 * 1024 * 1024; 
            if ($file['size'] > $maxSize) { $this->sendResponse(400, ['error' => 'Ảnh sản phẩm quá lớn (> 5MB).']); return; }
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $fileType = mime_content_type($file['tmp_name']);
            if (!in_array($fileType, $allowedTypes)) { $this->sendResponse(400, ['error' => 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP).']); return; }

            // Tạo tên file mới, duy nhất
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            // Thêm prefix 'prod_' để phân biệt với avatar
            $newFileName = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . strtolower($extension);
            $destinationPath = $this->productImageUploadDir . $newFileName;

            // Di chuyển file upload
            if (move_uploaded_file($file['tmp_name'], $destinationPath)) {
                error_log("DEBUG Product Create: Image file moved to: " . $destinationPath);
                $imageFileName = $newFileName; // Lưu tên file để insert vào DB
            } else {
                 error_log("ERROR Product Create: Failed to move uploaded file.");
                 $this->sendResponse(500, ['error' => 'Không thể lưu file ảnh sản phẩm.']); return;
            }
        } elseif (isset($_FILES['productImage']) && $_FILES['productImage']['error'] !== UPLOAD_ERR_NO_FILE) {
            error_log("ERROR Product Create: File upload error code: " . $_FILES['productImage']['error']);
            $this->sendResponse(400, ['error' => 'Có lỗi xảy ra khi tải file ảnh lên.', 'upload_error_code' => $_FILES['productImage']['error']]); return;
        } else {
             error_log("DEBUG Product Create: No product image uploaded.");
        }

        // 4. Thực thi INSERT vào CSDL
        // Cột `number` trong DB tương ứng với `$stock_quantity`
        $sql = "INSERT INTO product (name, number, price, image, category, color, description, size, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        try {
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute([
                $name,
                $stock_quantity,
                $price,
                $imageFileName, 
                $category ?: null,
                $color ?: null,
                $description ?: null,
                $size ?: null
            ]);

            if ($success) {
                $newProductId = $this->db->lastInsertId();
                // Gọi lại getById để trả về thông tin sản phẩm vừa tạo
                $this->getById((int)$newProductId, 201); 
            } else {
                if ($destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); }
                $this->sendResponse(500, ['error' => 'Không thể tạo sản phẩm do lỗi không xác định.']);
            }

        } catch (PDOException $e) {
            if ($destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); }
            error_log("API Error (ProductController::create): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi tạo sản phẩm.']);
        }
    }

    // *** HÀM UPDATE ĐỂ NHẬN FORM-DATA VÀ FILE ***
    public function update(int $id): void {
        if ($id <= 0) { $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']); return; }

        // 1. Đọc dữ liệu text từ $_POST

        $inputName = filter_input(INPUT_POST, 'name', FILTER_DEFAULT) ?? null;
        $inputStock = filter_input(INPUT_POST, 'stock_quantity', FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]);
        $inputPrice = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT, ['options' => ['min_range' => 0]]);
        $inputCategory = isset($_POST['category']) ? trim($_POST['category']) : null;
        $inputColor = isset($_POST['color']) ? trim($_POST['color']) : null;
        $inputDescription = isset($_POST['description']) ? trim($_POST['description']) : null;
        $inputSize = isset($_POST['size']) ? trim($_POST['size']) : null;

        error_log("DEBUG Product Update {$id} - Received POST: " . print_r($_POST, true));

        // 2. Chuẩn bị dữ liệu cập nhật
        $fieldsToUpdate = [];
        $params = [];
        $newImageFileName = null;
        $destinationPath = null;

        // Validate và thêm các trường text (chỉ thêm nếu key tồn tại trong $_POST)
        if ($inputName !== null) {
             if(!empty(trim($inputName))) { $fieldsToUpdate[] = "name = ?"; $params[] = trim($inputName); }
        }
        if ($inputStock !== null && $inputStock !== false) { 
             $fieldsToUpdate[] = "number = ?"; $params[] = $inputStock;
        } elseif (isset($_POST['stock_quantity']) && $inputStock === false) {
            $this->sendResponse(400, ['error' => 'Số lượng tồn kho không hợp lệ.']); return;
        }
        if ($inputPrice !== null && $inputPrice !== false) {
             $fieldsToUpdate[] = "price = ?"; $params[] = $inputPrice;
        } elseif (isset($_POST['price']) && $inputPrice === false) {
            $this->sendResponse(400, ['error' => 'Giá sản phẩm không hợp lệ.']); return;
        }
        if ($inputCategory !== null) { $fieldsToUpdate[] = "category = ?"; $params[] = $inputCategory ?: null; }
        if ($inputColor !== null) { $fieldsToUpdate[] = "color = ?"; $params[] = $inputColor ?: null; }
        if ($inputDescription !== null) { $fieldsToUpdate[] = "description = ?"; $params[] = $inputDescription ?: null; }
        if ($inputSize !== null) { $fieldsToUpdate[] = "size = ?"; $params[] = $inputSize ?: null; }

        // 3. Xử lý file ảnh mới (nếu có) - key là 'productImage'
        if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
             $file = $_FILES['productImage'];
             error_log("DEBUG Product Update {$id}: Received productImage: " . print_r($file, true));

             $maxSize = 5 * 1024 * 1024; // 5MB
             if ($file['size'] > $maxSize) { $this->sendResponse(400, ['error' => 'Ảnh sản phẩm quá lớn (> 5MB).']); return; }
             $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
             $fileType = mime_content_type($file['tmp_name']);
             if (!in_array($fileType, $allowedTypes)) { $this->sendResponse(400, ['error' => 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP).']); return; }

             // Tạo tên file mới
             $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
             $newFileName = 'prod_' . $id . '_' . time() . '.' . strtolower($extension); // Dùng productId trong tên file
             $destinationPath = $this->productImageUploadDir . $newFileName;

             // Di chuyển file upload
             if (move_uploaded_file($file['tmp_name'], $destinationPath)) {
                  error_log("DEBUG Product Update {$id}: New image file moved to: " . $destinationPath);
                  $newImageFileName = $newFileName;
                  $fieldsToUpdate[] = "image = ?";
                  $params[] = $newImageFileName;

                   // Xóa ảnh cũ
                   try {
                       $sqlGetOld = "SELECT image FROM product WHERE productId = ?";
                       $stmtGetOld = $this->db->prepare($sqlGetOld);
                       $stmtGetOld->execute([$id]);
                       $oldImageData = $stmtGetOld->fetch(PDO::FETCH_ASSOC);
                       if ($oldImageData && !empty($oldImageData['image'])) {
                            $oldImagePath = $this->productImageUploadDir . $oldImageData['image'];
                            if (file_exists($oldImagePath) && $oldImageData['image'] !== $newImageFileName) {
                                 @unlink($oldImagePath); error_log("DEBUG Product Update {$id}: Deleted old image: " . $oldImagePath);
                            }
                       }
                   } catch(PDOException $e) { error_log("API Warning (ProductController::update - delete old image prod {$id}): " . $e->getMessage()); }

             } else {
                  error_log("ERROR Product Update {$id}: Failed to move uploaded file.");
                  $this->sendResponse(500, ['error' => 'Không thể lưu file ảnh sản phẩm.']); return;
             }
        } elseif (isset($_FILES['productImage']) && $_FILES['productImage']['error'] !== UPLOAD_ERR_NO_FILE) {
             error_log("ERROR Product Update {$id}: File upload error code: " . $_FILES['productImage']['error']);
             $this->sendResponse(400, ['error' => 'Có lỗi xảy ra khi tải file ảnh lên.', 'upload_error_code' => $_FILES['productImage']['error']]); return;
        } else {
            error_log("DEBUG Product Update {$id}: No new product image uploaded.");
        }

        // 4. Kiểm tra xem có gì để cập nhật không
        error_log("DEBUG Product Update {$id} - Fields to update array: " . print_r($fieldsToUpdate, true));
        if (empty($fieldsToUpdate)) {
            error_log("DEBUG Product Update {$id}: No valid fields to update. Returning current profile.");
            $this->getById($id, 200); // Trả về thông tin hiện tại
            return;
        }

        // 5. Thực thi UPDATE
        $params[] = $id; // Thêm productId vào cuối cho WHERE
        $setClause = implode(', ', $fieldsToUpdate);
        $sql = "UPDATE product SET {$setClause} WHERE productId = ?";
        error_log("DEBUG Product Update {$id} - Executing SQL: " . $sql);
        error_log("DEBUG Product Update {$id} - With Params: " . print_r($params, true));

        try {
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute($params);
            $rowCount = $stmt->rowCount();
            error_log("DEBUG Product Update {$id} - Execute status: " . ($success ? 'true' : 'false') . ", Row count: " . $rowCount);

            // 6. Trả về kết quả (luôn lấy lại data mới nhất)
            if ($success) {
                $this->getById($id, 200); // Gọi lại getById để lấy và trả về data mới nhất
            } else {
                // Lỗi execute trả về false
                error_log("ERROR Product Update {$id}: Execute returned false.");
                if ($newImageFileName && $destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); } // Xóa file mới upload nếu lỗi DB
                $this->sendResponse(500, ['error' => 'Không thể thực thi cập nhật sản phẩm.']);
            }
        } catch (PDOException $e) {
            if ($newImageFileName && $destinationPath && file_exists($destinationPath)) { @unlink($destinationPath); } // Xóa file mới upload nếu lỗi DB
            error_log("API Error (ProductController::update DB {$id}): " . $e->getMessage());
            $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi cập nhật sản phẩm.']);
        }
    }


    // DEL - /products/{id} (Giữ nguyên)
    public function delete(int $id): void {
         if ($id <= 0) { $this->sendResponse(400, ['error' => 'ID sản phẩm không hợp lệ.']); return; }
         $sql = "DELETE FROM product WHERE productId = ?";
         try {
             // Trước khi xóa, lấy tên file ảnh để xóa file vật lý
             $sqlGetImage = "SELECT image FROM product WHERE productId = ?";
             $stmtGetImage = $this->db->prepare($sqlGetImage);
             $stmtGetImage->execute([$id]);
             $imageData = $stmtGetImage->fetch(PDO::FETCH_ASSOC);

             // Thực hiện xóa record trong DB
             $stmt = $this->db->prepare($sql);
             $stmt->execute([$id]);
             $rowCount = $stmt->rowCount();

             if ($rowCount > 0) {
                  // Nếu xóa DB thành công, xóa file ảnh vật lý (nếu có)
                  if ($imageData && !empty($imageData['image'])) {
                      $imagePath = $this->productImageUploadDir . $imageData['image'];
                      if (file_exists($imagePath)) {
                           @unlink($imagePath);
                           error_log("DEBUG Product Delete {$id}: Deleted image file: " . $imagePath);
                      }
                  }
                  $this->sendResponse(200, ['message' => "Đã xóa thành công sản phẩm với ID = {$id}."]);
             } else {
                  $this->sendResponse(404, ['error' => "Không tìm thấy sản phẩm với ID = {$id} để xóa."]);
             }
         } catch (PDOException $e) {
             error_log("API Error (ProductController::delete {$id}): " . $e->getMessage());
             if ($e->getCode() == 23000) {
                  $this->sendResponse(409, ['error' => "Không thể xóa sản phẩm ID {$id} do có ràng buộc dữ liệu (ví dụ: sản phẩm nằm trong đơn hàng)."]);
             } else {
                  $this->sendResponse(500, ['error' => 'Lỗi máy chủ nội bộ khi xóa sản phẩm.']);
             }
         }
    }

}
?>