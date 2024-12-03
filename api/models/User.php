<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $role;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        // Start transaction
        $this->conn->beginTransaction();

        try {
            // Insert into users table
            $query = "INSERT INTO " . $this->table_name . "
                    SET
                        username = :username,
                        email = :email,
                        password = :password,
                        role = :role";

            $stmt = $this->conn->prepare($query);

            // Sanitize and validate input
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->role = htmlspecialchars(strip_tags($this->role));
            
            // Validate email
            if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            // Hash password
            $this->password = password_hash($this->password, PASSWORD_ARGON2ID);

            // Bind values
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $this->password);
            $stmt->bindParam(":role", $this->role);

            if($stmt->execute()) {
                $user_id = $this->conn->lastInsertId();
                
                // Insert into role-specific table
                if($this->role === 'student') {
                    $this->createStudentInfo($user_id);
                } else if($this->role === 'employee') {
                    $this->createEmployeeInfo($user_id);
                }
                
                // Commit transaction
                $this->conn->commit();
                return true;
            }
            return false;
        } catch(Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    private function createStudentInfo($user_id) {
        $query = "INSERT INTO student_info (user_id, student_id) VALUES (:user_id, :student_id)";
        $stmt = $this->conn->prepare($query);
        $student_id = 'STU' . str_pad($user_id, 6, '0', STR_PAD_LEFT);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":student_id", $student_id);
        return $stmt->execute();
    }

    private function createEmployeeInfo($user_id) {
        $query = "INSERT INTO employee_info (user_id, employee_id) VALUES (:user_id, :employee_id)";
        $stmt = $this->conn->prepare($query);
        $employee_id = 'EMP' . str_pad($user_id, 6, '0', STR_PAD_LEFT);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":employee_id", $employee_id);
        return $stmt->execute();
    }

    public function login($email, $password) {
        $query = "SELECT u.id, u.username, u.password, u.role, u.status,
                        COALESCE(s.student_id, e.employee_id) as identifier
                 FROM " . $this->table_name . " u
                 LEFT JOIN student_info s ON u.id = s.user_id AND u.role = 'student'
                 LEFT JOIN employee_info e ON u.id = e.user_id AND u.role = 'employee'
                 WHERE u.email = :email AND u.status = 1";

        $stmt = $this->conn->prepare($query);
        $email = htmlspecialchars(strip_tags($email));
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $row['password'])) {
                unset($row['password']); // Remove password from response
                return $row;
            }
        }
        return false;
    }

    public function getUserDetails($user_id) {
        $query = "SELECT u.*, 
                        ud.*,
                        CASE 
                            WHEN u.role = 'student' THEN s.student_id
                            WHEN u.role = 'employee' THEN e.employee_id
                        END as identifier,
                        s.course, s.year_level, s.department as student_department,
                        e.position, e.department as employee_department, e.hire_date
                 FROM users u
                 LEFT JOIN user_details ud ON u.id = ud.user_id
                 LEFT JOIN student_info s ON u.id = s.user_id AND u.role = 'student'
                 LEFT JOIN employee_info e ON u.id = e.user_id AND u.role = 'employee'
                 WHERE u.id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
}
?> 