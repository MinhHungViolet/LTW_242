<?php

class IntroductionController {
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

    // GET - /introduction
    public function getIntroduction(): void {
        try {
            $sql = "SELECT title1, content1, title2, content2, title3, content3 FROM introduction LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $introduction = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($introduction) {
                $this->sendResponse(200, [
                    'status' => 'success',
                    'data' => $introduction
                ]);
            } else {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => 'Không tìm thấy dữ liệu giới thiệu.'
                ]);
            }
        } catch (PDOException $e) {
            error_log("API Error (IntroductionController::getIntroduction): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi truy vấn dữ liệu giới thiệu.'
            ]);
        }
    }

    // PUT - /introduction
    public function updateIntroduction(): void {
        try {
            // Đọc dữ liệu JSON từ body của request
            $input = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->sendResponse(400, [
                    'status' => 'error',
                    'message' => 'Dữ liệu JSON không hợp lệ.'
                ]);
                return;
            }

            // Kiểm tra các trường bắt buộc
            if (!isset($input['title1'], $input['content1'], $input['title2'], $input['content2'], $input['title3'], $input['content3'])) {
                $this->sendResponse(400, [
                    'status' => 'error',
                    'message' => 'Thiếu các trường bắt buộc: title1, content1, title2, content2, title3, content3.'
                ]);
                return;
            }

            // Cập nhật dữ liệu vào bảng introduction
            $sql = "UPDATE introduction SET 
                    title1 = :title1, content1 = :content1, 
                    title2 = :title2, content2 = :content2, 
                    title3 = :title3, content3 = :content3 
                    WHERE id = 1"; // Giả sử bảng có 1 bản ghi duy nhất với id = 1
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':title1' => $input['title1'],
                ':content1' => $input['content1'],
                ':title2' => $input['title2'],
                ':content2' => $input['content2'],
                ':title3' => $input['title3'],
                ':content3' => $input['content3']
            ]);

            $this->sendResponse(200, [
                'status' => 'success',
                'message' => 'Cập nhật nội dung giới thiệu thành công.'
            ]);
        } catch (PDOException $e) {
            error_log("API Error (IntroductionController::updateIntroduction): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi máy chủ nội bộ khi cập nhật dữ liệu giới thiệu.'
            ]);
        }
    }
}