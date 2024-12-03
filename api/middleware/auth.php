<?php
function checkAuth($allowed_roles = []) {
    session_start();
    
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        header('Location: /login.html');
        exit();
    }

    // If specific roles are required
    if (!empty($allowed_roles)) {
        if (!in_array($_SESSION['role'], $allowed_roles)) {
            http_response_code(403);
            echo json_encode(array(
                "message" => "Access denied. Insufficient privileges."
            ));
            exit();
        }
    }

    return true;
}
?> 