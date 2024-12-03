<?php
require_once 'includes/db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    // Add other fields as needed
    
    try {
        // Your database insertion code here
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->execute([$username, $password]);
        
        // Redirect to login page after successful registration
        header("Location: login.html");
        exit();
    } catch (PDOException $e) {
        // Handle errors
        // You might want to redirect back to register.html with an error message
        header("Location: register.html?error=registration_failed");
        exit();
    }
}
?> 