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
    $email = sanitize_input(mysqli_real_escape_string($conn, $_POST['email']));
    $password = sanitize_input($_POST['password']);
    
    if(!empty($email) && !empty($password)) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Invalid email format");
        }

        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $hashed_password = $row['password'];
            
            if(password_verify($password, $hashed_password)) {
                // Regenerate session ID to prevent session fixation
                session_regenerate_id(true);
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['last_activity'] = time();
                $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];

                // Set secure cookie parameters
                $options = array(
                    'expires' => time() + 3600,
                    'path' => '/',
                    'secure' => true,
                    'httpOnly' => true,
                    'samesite' => 'Strict'
                );
                setcookie('user_session', session_id(), $options);

                header("Location: user_calendar.php");
                exit();
            } else {
                // Use generic error message for security
                $error = "Invalid credentials";
            }
        } else {
            $error = "Invalid credentials";
        }
        $stmt->close();
    } else {
        $error = "All fields are required";
    }
}
?> 