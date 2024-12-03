<?php
class Database {
    private $hostname = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "user_auth_db";
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->hostname . 
                ";dbname=" . $this->dbname,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}
?> 