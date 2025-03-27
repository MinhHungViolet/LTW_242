<?php
require_once __DIR__ . "/../models/User.php";

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    // ✅ API: Lấy danh sách user (Admin)
    public function getAllUsers() {
        $users = $this->userModel->getAllUsers();
        echo json_encode($users);
    }

    // ✅ API: Lấy user theo ID
    public function getUserById($id) {
        $user = $this->userModel->getUserById($id);
        echo json_encode($user);
    }

    // ✅ API: Thêm user (Admin)
    public function createUser($data) {
        if ($this->userModel->createUser($data['name'], $data['email'], $data['password'], $data['role'])) {
            echo json_encode(["message" => "User created successfully"]);
        } else {
            echo json_encode(["error" => "Failed to create user"]);
        }
    }

    // ✅ API: Cập nhật user (User)
    public function updateUser($id, $data) {
        if ($this->userModel->updateUser($id, $data['name'], $data['email'])) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update user"]);
        }
    }

    // ✅ API: Đổi mật khẩu user (User)
    public function updatePassword($id, $new_password) {
        if ($this->userModel->updatePassword($id, $new_password)) {
            echo json_encode(["message" => "Password updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update password"]);
        }
    }

    // ✅ API: Xóa user (Admin)
    public function deleteUser($id) {
        if ($this->userModel->deleteUser($id)) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            echo json_encode(["error" => "Failed to delete user"]);
        }
    }
}
?>
