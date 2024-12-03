<?php
session_start();
include_once "config.php";

// Verify CSRF token
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        die('CSRF token validation failed');
    }
}

if(isset($_POST['submit'])) {
    $username = sanitize_input(mysqli_real_escape_string($conn, $_POST['username']));
    $email = sanitize_input(mysqli_real_escape_string($conn, $_POST['email']));
    $password = sanitize_input($_POST['password']);
    
    if(!empty($username) && !empty($email) && !empty($password)) {
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Invalid email format");
        }

        // Validate password strength
        if (strlen($password) < 8) {
            die("Password must be at least 8 characters long");
        }
        if (!preg_match("/[A-Z]/", $password)) {
            die("Password must contain at least one uppercase letter");
        }
        if (!preg_match("/[a-z]/", $password)) {
            die("Password must contain at least one lowercase letter");
        }
        if (!preg_match("/[0-9]/", $password)) {
            die("Password must contain at least one number");
        }

        // Use prepared statement to check existing email
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            echo "This email already exists!";
        } else {
            // Hash the password with strong options
            $hashed_password = password_hash($password, PASSWORD_ARGON2ID);
            
            // Use prepared statement for insertion
            $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $email, $hashed_password);
            
            if($stmt->execute()) {
                header("Location: login.html");
                exit();
            } else {
                echo "Something went wrong!";
            }
        }
        $stmt->close();
    } else {
        echo "All fields are required!";
    }
}
?> 