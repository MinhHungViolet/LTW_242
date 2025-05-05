<?php
require_once __DIR__ . '/../Database/Connection.php';
require_once __DIR__ . '/../helpers.php';

class PostController {
    private $conn;

    public function __construct() {
        $this->conn = Connection::getInstance();
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        // Handle different HTTP methods
        switch ($method) {
            case 'GET':
                // Get single post
                if (isset($_GET['postId'])) {
                    $this->getPostById($_GET['postId']);
                }
                // Get posts by category
                else if (isset($_GET['category'])) {
                    $this->getPostsByCategory($_GET['category']);
                }
                // Get posts by author
                else if (isset($_GET['authorId'])) {
                    $this->getPostsByAuthor($_GET['authorId']);
                }
                // Get all posts
                else {
                    $this->getAllPosts();
                }
                break;
            case 'POST':
                // Create a new post
                $this->createPost();
                break;
            case 'PUT':
                // Update an existing post
                $this->updatePost();
                break;
            case 'DELETE':
                // Delete a post
                $this->deletePost();
                break;
            default:
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                break;
        }
    }

    private function getAllPosts() {
        try {
            $query = "SELECT p.*, u.name as authorName 
                     FROM post p 
                     JOIN user u ON p.authorId = u.userId 
                     ORDER BY p.date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode(['status' => 'success', 'data' => $posts]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function getPostById($postId) {
        try {
            $query = "SELECT p.*, u.name as authorName,
                     (SELECT COUNT(*) FROM comment WHERE postId = p.postId) as commentCount
                     FROM post p 
                     JOIN user u ON p.authorId = u.userId 
                     WHERE p.postId = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$postId]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'data' => $post]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Post not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function getPostsByCategory($category) {
        try {
            $query = "SELECT p.*, u.name as authorName 
                     FROM post p 
                     JOIN user u ON p.authorId = u.userId 
                     WHERE p.category = ?
                     ORDER BY p.date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$category]);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode(['status' => 'success', 'data' => $posts]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function getPostsByAuthor($authorId) {
        try {
            $query = "SELECT p.*, u.name as authorName 
                     FROM post p 
                     JOIN user u ON p.authorId = u.userId 
                     WHERE p.authorId = ?
                     ORDER BY p.date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$authorId]);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode(['status' => 'success', 'data' => $posts]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function createPost() {
        try {
            // Check if the content type is multipart/form-data
            $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
            $isFormData = strpos($contentType, 'multipart/form-data') !== false;
            
            // Get data based on request type
            if ($isFormData) {
                // Handle form data submission
                $data = $_POST;
                
                // Handle file upload if present
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    // Process uploaded file - you might want to save it to a specific directory
                    // This is a simplified example - in production, add more validation and security checks
                    $uploadDir = '../../uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
                    $uploadFile = $uploadDir . $fileName;
                    
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                        $data['image'] = $fileName; // or full URL path to the image
                    }
                }
            } else {
                // Handle JSON data
                $data = json_decode(file_get_contents('php://input'), true);
            }
            
            // Check if required fields exist
            if (!isset($data['title']) || !isset($data['content'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields: title and content are required']);
                return;
            }
            
            // Get authorId from authenticated user or from data
            $authorId = null;
            
            // If using JWT authentication, get user from token
            if (function_exists('authenticate')) {
                $user = authenticate(false); // Don't exit if auth fails
                if ($user && isset($user->userId)) {
                    $authorId = $user->userId;
                }
            }
            
            // If not set from authentication, try to get from request data
            if (!$authorId && isset($data['authorId'])) {
                $authorId = $data['authorId'];
            }
            
            // If still no authorId, return error
            if (!$authorId) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing authorId: User not authenticated']);
                return;
            }
            
            // Prepare query
            $query = "INSERT INTO post (title, content, authorId, category, image, date) 
                     VALUES (?, ?, ?, ?, ?, NOW())";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['title'],
                $data['content'],
                $authorId,
                $data['category'] ?? null,
                $data['image'] ?? null
            ]);
            
            $postId = $this->conn->lastInsertId();
            
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Post created successfully', 'postId' => $postId]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    private function updatePost() {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Check if postId exists
            if (!isset($data['postId'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing post ID']);
                return;
            }
            
            // Check if post exists
            $checkQuery = "SELECT * FROM post WHERE postId = ?";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([$data['postId']]);
            
            if ($checkStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Post not found']);
                return;
            }
            
            // Build update query dynamically based on provided fields
            $updateFields = [];
            $params = [];
            
            if (isset($data['title'])) {
                $updateFields[] = 'title = ?';
                $params[] = $data['title'];
            }
            
            if (isset($data['content'])) {
                $updateFields[] = 'content = ?';
                $params[] = $data['content'];
            }
            
            if (isset($data['category'])) {
                $updateFields[] = 'category = ?';
                $params[] = $data['category'];
            }
            
            if (isset($data['image'])) {
                $updateFields[] = 'image = ?';
                $params[] = $data['image'];
            }
            
            // If no fields to update
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'No fields to update']);
                return;
            }
            
            // Add postId to params
            $params[] = $data['postId'];
            
            $query = "UPDATE post SET " . implode(', ', $updateFields) . " WHERE postId = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Post updated successfully']);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    private function deletePost() {
        try {
            // Get postId from URL or request body
            $data = json_decode(file_get_contents('php://input'), true);
            $postId = isset($data['postId']) ? $data['postId'] : null;
            
            // If postId is not in the request body, check if it's in the URL
            if (!$postId && isset($_GET['postId'])) {
                $postId = $_GET['postId'];
            }
            
            if (!$postId) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing post ID']);
                return;
            }
            
            // Check if post exists
            $checkQuery = "SELECT * FROM post WHERE postId = ?";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([$postId]);
            
            if ($checkStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Post not found']);
                return;
            }
            
            // Delete associated comments first (foreign key constraint)
            $deleteCommentsQuery = "DELETE FROM comment WHERE postId = ?";
            $deleteCommentsStmt = $this->conn->prepare($deleteCommentsQuery);
            $deleteCommentsStmt->execute([$postId]);
            
            // Delete the post
            $query = "DELETE FROM post WHERE postId = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$postId]);
            
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Post deleted successfully']);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
}