<?php
/**
 * Heaven Furniture Mart - PHP CMS Website Framework
 * Database Connection via PDO
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: 'localhost';
            $port = getenv('DB_PORT') ?: '3306';
            $dbName = getenv('DB_NAME') ?: 'heaven_furniture_mart';
            $username = getenv('DB_USER') ?: 'root';
            $password = getenv('DB_PASS') ?: '';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $username, $password, $options);
            } catch (PDOException $e) {
                // Fallback or log error
                error_log("Database connection failed: " . $e->getMessage());
                throw new Exception("Database connection failure: " . $e->getMessage());
            }
        }

        return self::$instance;
    }
}
