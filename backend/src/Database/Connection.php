<?php
// use PDO;
// use PDOException;
class Connection {

    private static $pdoInstance = null;

    public static function getInstance(): ?PDO {
        if (self::$pdoInstance === null) {
            $configFile = __DIR__ . '/../../config/database.php';

            // Kiểm tra file config tồn tại
            if (!file_exists($configFile)) {
                error_log("Lỗi nghiêm trọng: Không tìm thấy file cấu hình database.php tại: " . $configFile);
                return null;
            }

            require_once $configFile;

            $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_DATABASE . ';charset=' . DB_CHARSET;

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            // Kết nối
            try {
                self::$pdoInstance = new PDO($dsn, DB_USERNAME, DB_PASSWORD, $options);
            } catch (PDOException $exception) {
                error_log("Lỗi Kết Nối CSDL: " . $exception->getMessage());
                return null;
            }
        }
        return self::$pdoInstance;
    }
    private function __construct() {}
    private function __clone() {}
    public function __wakeup() {}

}
?>