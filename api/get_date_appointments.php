<?php
require_once '../includes/db_connect.php';

$date = $_GET['date'];

try {
    $query = "SELECT * FROM appointments WHERE date_string = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $appointments = array();
    while ($row = $result->fetch_assoc()) {
        $appointments[] = array(
            'full_name' => $row['full_name'],
            'program' => $row['program'],
            'contact_number' => $row['contact_number'],
            'year_level' => $row['year_level'],
            'documentation' => $row['documentation'],
            'status' => $row['status']
        );
    }
    
    header('Content-Type: application/json');
    echo json_encode($appointments);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 