<?php
// src/Controllers/BlogController.php

class BlogController {
    private $db;
    private $blogImageUploadDir;

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(['error' => 'Lỗi nghiêm trọng: Không có kết nối cơ sở dữ liệu trong BlogController.']);
            exit();
        }
        $this->db = $pdo;
        // Định nghĩa đường dẫn upload cho ảnh blog
        $this->blogImageUploadDir = __DIR__ . '/../../public/uploads/blog/';
        
        // Đảm bảo thư mục tồn tại
        if (!is_dir($this->blogImageUploadDir)) {
            mkdir($this->blogImageUploadDir, 0775, true);
        }
    }

    /**
     * Hàm tiện ích gửi JSON response chuẩn hóa
     */
    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        if (!headers_sent()) {
             header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode($data);
    }

    /**
     * Lấy danh sách bài viết blog (GET /blog)
     * Hỗ trợ phân trang với tham số page và limit
     */
    public function getAll(): void {
        try {
            // Xử lý tham số phân trang
            $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(50, intval($_GET['limit']))) : 10;
            $offset = ($page - 1) * $limit;
            
            // Truy vấn tổng số bài viết để tính tổng số trang
            $countSql = "SELECT COUNT(*) FROM post";
            $totalItems = (int) $this->db->query($countSql)->fetchColumn();
            $totalPages = ceil($totalItems / $limit);
            
            // Truy vấn lấy bài viết với phân trang và join với bảng user để lấy thông tin tác giả
            $sql = "SELECT p.postId, p.title, p.content, p.date, p.category, p.numberComment, 
                    u.name AS author 
                    FROM post p 
                    JOIN user u ON p.authorId = u.userId 
                    ORDER BY p.date DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Trả về dữ liệu cùng với metadata phân trang
            $this->sendResponse(200, [
                'status' => 'success',
                'data' => $posts,
                'page' => $page,
                'limit' => $limit,
                'totalItems' => $totalItems,
                'totalPages' => $totalPages
            ]);
        } catch (PDOException $e) {
            error_log("API Error (BlogController::getAll): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi truy vấn danh sách bài viết.'
            ]);
        }
    }

    /**
     * Lấy chi tiết một bài viết (GET /blog/{id})
     */
    public function getById(int $id): void {
        if ($id <= 0) {
            $this->sendResponse(400, [
                'status' => 'error', 
                'message' => 'ID bài viết không hợp lệ.'
            ]);
            return;
        }
        
        try {
            // Truy vấn chi tiết bài viết với thông tin tác giả
            $sql = "SELECT p.postId, p.title, p.content, p.date, p.category, p.numberComment, 
                    u.name AS author 
                    FROM post p 
                    JOIN user u ON p.authorId = u.userId 
                    WHERE p.postId = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($post) {
                $this->sendResponse(200, [
                    'status' => 'success',
                    'data' => $post
                ]);
            } else {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bài viết với ID = {$id}."
                ]);
            }
        } catch (PDOException $e) {
            error_log("API Error (BlogController::getById {$id}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi truy vấn chi tiết bài viết.'
            ]);
        }
    }

    /**
     * Thêm bài viết mới (POST /blog)
     * Yêu cầu quyền admin
     */
    public function create(object $userPayload): void {
        $inputData = json_decode(file_get_contents('php://input'), true);
        
        // Lấy dữ liệu từ request body
        $title = trim($inputData['title'] ?? '');
        $content = trim($inputData['content'] ?? '');
        $category = trim($inputData['category'] ?? '');
        
        // Validate dữ liệu
        if (empty($title)) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => "Thiếu trường bắt buộc: title"
            ]);
            return;
        }
        
        if (empty($content)) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => "Thiếu trường bắt buộc: content"
            ]);
            return;
        }
        
        $authorId = $userPayload->userId;
        
        // Thực hiện insert vào DB
        try {
            $sql = "INSERT INTO post (title, content, category, authorId) 
                    VALUES (?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute([
                $title, 
                $content,
                $category ?: null,
                $authorId
            ]);
            
            if ($success) {
                $newPostId = $this->db->lastInsertId();
                $this->getById((int)$newPostId);
            } else {
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể tạo bài viết do lỗi không xác định.'
                ]);
            }
        } catch (PDOException $e) {
            error_log("API Error (BlogController::create): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi tạo bài viết.'
            ]);
        }
    }

    /**
     * Cập nhật bài viết (PUT /blog/{id})
     * Yêu cầu quyền admin
     */
    public function update(int $id, object $userPayload): void {
        if ($id <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'ID bài viết không hợp lệ.'
            ]);
            return;
        }
        
        // Kiểm tra bài viết tồn tại
        try {
            $checkSql = "SELECT postId, authorId FROM post WHERE postId = ?";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([$id]);
            $existingPost = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$existingPost) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bài viết với ID = {$id}."
                ]);
                return;
            }
            
            // Kiểm tra người dùng có quyền sửa bài viết này không
            $currentUserId = $userPayload->userId;
            $currentUserRole = $userPayload->role;
            
            // Chỉ admin hoặc chính tác giả mới có thể sửa
            if ($currentUserRole !== 'admin' && $currentUserId !== (int)$existingPost['authorId']) {
                $this->sendResponse(403, [
                    'status' => 'error',
                    'message' => 'Bạn không có quyền sửa bài viết này.'
                ]);
                return;
            }
            
            $inputData = json_decode(file_get_contents('php://input'), true);
            
            // Lấy dữ liệu từ request body
            $title = isset($inputData['title']) ? trim($inputData['title']) : null;
            $content = isset($inputData['content']) ? trim($inputData['content']) : null;
            $category = isset($inputData['category']) ? trim($inputData['category']) : null;
            
            // Chuẩn bị câu lệnh UPDATE
            $fieldsToUpdate = [];
            $params = [];
            
            if ($title !== null) {
                if (empty($title)) {
                    $this->sendResponse(400, [
                        'status' => 'error',
                        'message' => 'Tiêu đề không được để trống.'
                    ]);
                    return;
                }
                $fieldsToUpdate[] = "title = ?";
                $params[] = $title;
            }
            
            if ($content !== null) {
                if (empty($content)) {
                    $this->sendResponse(400, [
                        'status' => 'error',
                        'message' => 'Nội dung không được để trống.'
                    ]);
                    return;
                }
                $fieldsToUpdate[] = "content = ?";
                $params[] = $content;
            }
            
            if ($category !== null) {
                $fieldsToUpdate[] = "category = ?";
                $params[] = $category ?: null;
            }
            
            // Kiểm tra có trường cần cập nhật không
            if (empty($fieldsToUpdate)) {
                $this->sendResponse(400, [
                    'status' => 'error',
                    'message' => 'Không có thông tin nào để cập nhật.'
                ]);
                return;
            }
            
            // Thêm id vào cuối params
            $params[] = $id;
            
            // Thực hiện cập nhật
            $sql = "UPDATE post SET " . implode(', ', $fieldsToUpdate) . " WHERE postId = ?";
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute($params);
            
            if ($success) {
                // Trả về thông tin bài viết đã cập nhật
                $this->getById($id);
            } else {
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể cập nhật bài viết.'
                ]);
            }
            
        } catch (PDOException $e) {
            error_log("API Error (BlogController::update {$id}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi cập nhật bài viết.'
            ]);
        }
    }

    /**
     * Xóa bài viết (DELETE /blog/{id})
     * Yêu cầu quyền admin
     */
    public function delete(int $id, object $userPayload): void {
        if ($id <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'ID bài viết không hợp lệ.'
            ]);
            return;
        }
        
        try {
            // Lấy thông tin bài viết
            $sql = "SELECT authorId FROM post WHERE postId = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$post) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bài viết với ID = {$id}."
                ]);
                return;
            }
            
            // Kiểm tra người dùng có quyền xóa bài viết này không
            $currentUserId = $userPayload->userId;
            $currentUserRole = $userPayload->role;
            
            // Chỉ admin hoặc chính tác giả mới có thể xóa
            if ($currentUserRole !== 'admin' && $currentUserId !== (int)$post['authorId']) {
                $this->sendResponse(403, [
                    'status' => 'error',
                    'message' => 'Bạn không có quyền xóa bài viết này.'
                ]);
                return;
            }
            
            // Thực hiện xóa bài viết
            $deleteSql = "DELETE FROM post WHERE postId = ?";
            $deleteStmt = $this->db->prepare($deleteSql);
            $deleteStmt->execute([$id]);
            
            if ($deleteStmt->rowCount() > 0) {
                $this->sendResponse(200, [
                    'status' => 'success',
                    'message' => "Đã xóa thành công bài viết với ID = {$id}."
                ]);
            } else {
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => "Không thể xóa bài viết ID = {$id}."
                ]);
            }
        } catch (PDOException $e) {
            error_log("API Error (BlogController::delete {$id}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi xóa bài viết.'
            ]);
        }
    }
    
    /**
     * Lấy danh sách bình luận cho một bài viết (GET /blog/{id}/comments)
     */
    public function getComments(int $postId): void {
        if ($postId <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'ID bài viết không hợp lệ.'
            ]);
            return;
        }
        
        try {
            // Kiểm tra bài viết tồn tại
            $checkSql = "SELECT postId FROM post WHERE postId = ?";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([$postId]);
            
            if (!$checkStmt->fetch()) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bài viết với ID = {$postId}."
                ]);
                return;
            }
            
            // Lấy danh sách bình luận
            $sql = "SELECT c.commentId, c.content, c.date, 
                    u.userId, u.name, u.avatar
                    FROM comment c 
                    JOIN user u ON c.userId = u.userId
                    WHERE c.postId = ? 
                    ORDER BY c.date DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$postId]);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->sendResponse(200, [
                'status' => 'success',
                'data' => $comments
            ]);
        } catch (PDOException $e) {
            error_log("API Error (BlogController::getComments for post {$postId}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi lấy danh sách bình luận.'
            ]);
        }
    }
    
    /**
     * Thêm bình luận cho bài viết (POST /blog/{id}/comments)
     */
    public function addComment(int $postId, object $userPayload): void {
        if ($postId <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'ID bài viết không hợp lệ.'
            ]);
            return;
        }
        
        $inputData = json_decode(file_get_contents('php://input'), true);
        $content = trim($inputData['content'] ?? '');
        
        if (empty($content)) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'Nội dung bình luận không được để trống.'
            ]);
            return;
        }
        
        $userId = $userPayload->userId;
        
        try {
            // Kiểm tra bài viết tồn tại
            $checkSql = "SELECT postId FROM post WHERE postId = ?";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([$postId]);
            
            if (!$checkStmt->fetch()) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bài viết với ID = {$postId}."
                ]);
                return;
            }
            
            // Thêm bình luận
            $this->db->beginTransaction();
            
            $sql = "INSERT INTO comment (userId, postId, content) VALUES (?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute([$userId, $postId, $content]);
            
            if (!$success) {
                $this->db->rollBack();
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể thêm bình luận.'
                ]);
                return;
            }
            
            $commentId = $this->db->lastInsertId();
            
            // Cập nhật số lượng bình luận trong bài viết
            $updateSql = "UPDATE post SET numberComment = numberComment + 1 WHERE postId = ?";
            $updateStmt = $this->db->prepare($updateSql);
            $updateSuccess = $updateStmt->execute([$postId]);
            
            if (!$updateSuccess) {
                $this->db->rollBack();
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể cập nhật số lượng bình luận.'
                ]);
                return;
            }
            
            $this->db->commit();
            
            // Lấy thông tin bình luận vừa thêm
            $selectSql = "SELECT c.commentId, c.content, c.date, 
                         u.userId, u.name, u.avatar
                         FROM comment c 
                         JOIN user u ON c.userId = u.userId
                         WHERE c.commentId = ?";
            $selectStmt = $this->db->prepare($selectSql);
            $selectStmt->execute([$commentId]);
            $comment = $selectStmt->fetch(PDO::FETCH_ASSOC);
            
            $this->sendResponse(201, [
                'status' => 'success',
                'message' => 'Đã thêm bình luận thành công.',
                'data' => $comment
            ]);
        } catch (PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            
            error_log("API Error (BlogController::addComment for post {$postId}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi thêm bình luận.'
            ]);
        }
    }
    
    /**
     * Xóa bình luận (DELETE /blog/comments/{id})
     */
    public function deleteComment(int $commentId, object $userPayload): void {
        if ($commentId <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'ID bình luận không hợp lệ.'
            ]);
            return;
        }
        
        try {
            // Lấy thông tin bình luận
            $sql = "SELECT c.userId, c.postId FROM comment c WHERE c.commentId = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$commentId]);
            $comment = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$comment) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => "Không tìm thấy bình luận với ID = {$commentId}."
                ]);
                return;
            }
            
            // Kiểm tra quyền xóa
            $currentUserId = $userPayload->userId;
            $currentUserRole = $userPayload->role;
            
            // Chỉ admin hoặc chính người viết bình luận mới có thể xóa
            if ($currentUserRole !== 'admin' && $currentUserId !== (int)$comment['userId']) {
                $this->sendResponse(403, [
                    'status' => 'error',
                    'message' => 'Bạn không có quyền xóa bình luận này.'
                ]);
                return;
            }
            
            $postId = $comment['postId'];
            
            // Xóa bình luận trong giao dịch
            $this->db->beginTransaction();
            
            $deleteSql = "DELETE FROM comment WHERE commentId = ?";
            $deleteStmt = $this->db->prepare($deleteSql);
            $deleteSuccess = $deleteStmt->execute([$commentId]);
            
            if (!$deleteSuccess) {
                $this->db->rollBack();
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể xóa bình luận.'
                ]);
                return;
            }
            
            // Cập nhật số lượng bình luận trong bài viết
            $updateSql = "UPDATE post SET numberComment = GREATEST(numberComment - 1, 0) WHERE postId = ?";
            $updateStmt = $this->db->prepare($updateSql);
            $updateSuccess = $updateStmt->execute([$postId]);
            
            if (!$updateSuccess) {
                $this->db->rollBack();
                $this->sendResponse(500, [
                    'status' => 'error',
                    'message' => 'Không thể cập nhật số lượng bình luận.'
                ]);
                return;
            }
            
            $this->db->commit();
            
            $this->sendResponse(200, [
                'status' => 'success',
                'message' => 'Đã xóa bình luận thành công.'
            ]);
        } catch (PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            
            error_log("API Error (BlogController::deleteComment {$commentId}): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi xóa bình luận.'
            ]);
        }
    }
}