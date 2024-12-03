<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $query = "INSERT INTO appointments (
        date_string, 
        full_name, 
        program, 
        contact_number, 
        year_level, 
        documentation
    ) VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'ssssss',
        $data['dateString'],
        $data['fullName'],
        $data['program'],
        $data['contactNumber'],
        $data['yearLevel'],
        $data['documentation']
    );
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
    }
}
?> 