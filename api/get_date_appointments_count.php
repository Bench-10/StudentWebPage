<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

$date = isset($_GET['date']) ? $_GET['date'] : null;

if ($date) {
    $query = "SELECT COUNT(*) as count FROM appointments WHERE date_string = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 's', $date);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    
    echo json_encode(['count' => (int)$row['count']]);
} else {
    echo json_encode(['error' => 'No date provided']);
}
?> 