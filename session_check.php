<?php
session_start();

// Session timeout (30 minutes)
$timeout = 1800;

function check_session() {
    global $timeout;
    
    if (isset($_SESSION['last_activity']) && 
        (time() - $_SESSION['last_activity'] > $timeout)) {
        session_unset();
        session_destroy();
        header("Location: login.html");
        exit();
    }

    // Check if IP address has changed
    if (isset($_SESSION['ip_address']) && 
        $_SESSION['ip_address'] !== $_SERVER['REMOTE_ADDR']) {
        session_unset();
        session_destroy();
        header("Location: login.html");
        exit();
    }

    $_SESSION['last_activity'] = time();
}

// Check if user is logged in
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Force HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
?> 