<?php
require_once __DIR__ . "/../app/controllers/UserController.php";

$userController = new UserController();

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["route"])) {
    if ($_GET["route"] === "users") {
        $userController->getAllUsers();
    } elseif ($_GET["route"] === "user" && isset($_GET["id"])) {
        $userController->getUserById($_GET["id"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && $_GET["route"] === "user") {
    $data = json_decode(file_get_contents("php://input"), true);
    $userController->createUser($data);
}
?>
