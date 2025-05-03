<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Xử lý yêu cầu preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Import file kết nối database
require_once '../Database/Connection.php';

function sendResponse($status, $data, $code = 200) {
    http_response_code($code);
    echo json_encode(['status' => $status, 'data' => $data]);
    exit;
}

function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}

$pdo = Connection::getInstance();
if ($pdo === null) {
    sendError('Không thể kết nối đến cơ sở dữ liệu', 500);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $customerId = isset($_GET['customerId']) ? intval($_GET['customerId']) : null;

        try {
            if ($customerId) {
                $query = "SELECT * FROM qna WHERE customerId = :customerId";
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':customerId', $customerId, PDO::PARAM_INT);
                $stmt->execute();
                $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $query = "SELECT * FROM qna";
                $stmt = $pdo->query($query);
                $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            sendResponse('success', $questions);
        } catch (PDOException $e) {
            sendError('Lỗi khi lấy câu hỏi: ' . $e->getMessage(), 500);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['question']) || !isset($data['customerId'])) {
            sendError('Thiếu thông tin: question, customerId', 400);
        }

        $question = $data['question'];
        $customerId = intval($data['customerId']);

        try {
            $query = "INSERT INTO qna (customerId, question) VALUES (:customerId, :question)";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':customerId', $customerId, PDO::PARAM_INT);
            $stmt->bindParam(':question', $question, PDO::PARAM_STR);
            $stmt->execute();
            $newQuestionId = $pdo->lastInsertId();
            sendResponse('success', ['questionId' => $newQuestionId, 'customerId' => $customerId, 'question' => $question], 201);
        } catch (PDOException $e) {
            sendError('Lỗi khi thêm câu hỏi: ' . $e->getMessage(), 500);
        }
        break;

    default:
        sendError('Phương thức không được hỗ trợ', 405);
        break;
}
?>