<?php

class QnaController {
    private $db;

    public function __construct(?PDO $pdo) {
        if ($pdo === null) {
            $this->sendResponse(500, ['error' => 'Lỗi nghiêm trọng: Không có kết nối cơ sở dữ liệu.']);
            exit();
        }
        $this->db = $pdo;
    }

    private function sendResponse(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($data);
        exit();
    }

    public function getQna(): void {
        $customerId = isset($_GET['customerId']) ? intval($_GET['customerId']) : null;

        try {
            if ($customerId) {
                $query = "SELECT * FROM qna WHERE customerId = :customerId";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':customerId', $customerId, PDO::PARAM_INT);
                $stmt->execute();
                $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $query = "SELECT * FROM qna";
                $stmt = $this->db->query($query);
                $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            $this->sendResponse(200, [
                'status' => 'success',
                'data' => $questions
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::getQna): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi lấy câu hỏi: ' . $e->getMessage()
            ]);
        }
    }

    public function createQna(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['question']) || !isset($data['customerId'])) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'Thiếu thông tin: question, customerId'
            ]);
        }

        $question = trim($data['question']);
        $customerId = intval($data['customerId']);

        if (empty($question)) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'Câu hỏi không được để trống'
            ]);
        }
        if ($customerId <= 0) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'customerId không hợp lệ'
            ]);
        }

        try {
            $query = "INSERT INTO qna (customerId, question) VALUES (:customerId, :question)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':customerId', $customerId, PDO::PARAM_INT);
            $stmt->bindParam(':question', $question, PDO::PARAM_STR);
            $stmt->execute();
            $newQuestionId = $this->db->lastInsertId();
            $this->sendResponse(201, [
                'status' => 'success',
                'data' => [
                    'questionId' => $newQuestionId,
                    'customerId' => $customerId,
                    'question' => $question
                ]
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::createQna): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi thêm câu hỏi: ' . $e->getMessage()
            ]);
        }
    }

    public function updateAnswer(int $questionId): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['answer'])) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'Thiếu thông tin: answer'
            ]);
        }

        $answer = trim($data['answer']);
        if (empty($answer)) {
            $this->sendResponse(400, [
                'status' => 'error',
                'message' => 'Câu trả lời không được để trống'
            ]);
        }

        try {
            $query = "UPDATE qna SET answer = :answer WHERE questionId = :questionId";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
            $stmt->bindParam(':questionId', $questionId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => 'Câu hỏi không tồn tại'
                ]);
            }

            $this->sendResponse(200, [
                'status' => 'success',
                'message' => 'Câu trả lời đã được cập nhật'
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::updateAnswer): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật câu trả lời: ' . $e->getMessage()
            ]);
        }
    }

    public function deleteQna(int $questionId): void {
        // Xác thực token và kiểm tra quyền admin
        $userData = authenticate();
        if (!$userData || $userData->role !== 'admin') {
            $this->sendResponse(403, [
                'status' => 'error',
                'message' => 'Truy cập bị từ chối. Yêu cầu quyền Admin.'
            ]);
        }

        try {
            $query = "DELETE FROM qna WHERE questionId = :questionId";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':questionId', $questionId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                $this->sendResponse(404, [
                    'status' => 'error',
                    'message' => 'Câu hỏi không tồn tại.'
                ]);
            }

            $this->sendResponse(200, [
                'status' => 'success',
                'message' => 'Câu hỏi đã được xóa thành công.'
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::deleteQna): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi xóa câu hỏi: ' . $e->getMessage()
            ]);
        }
    }

    public function getQnaCount(): void {
        try {
            $query = "SELECT COUNT(*) as total FROM qna";
            $stmt = $this->db->query($query);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->sendResponse(200, [
                'status' => 'success',
                'data' => $result['total']
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::getQnaCount): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi đếm câu hỏi: ' . $e->getMessage()
            ]);
        }
    }

    public function getLatestQna(): void {
        try {
            $query = "SELECT questionId, customerId, question FROM qna ORDER BY questionId DESC LIMIT 5";
            $stmt = $this->db->query($query);
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse(200, [
                'status' => 'success',
                'data' => $questions
            ]);
        } catch (PDOException $e) {
            error_log("API Error (QnaController::getLatestQna): " . $e->getMessage());
            $this->sendResponse(500, [
                'status' => 'error',
                'message' => 'Lỗi khi lấy câu hỏi mới nhất: ' . $e->getMessage()
            ]);
        }
    }
}