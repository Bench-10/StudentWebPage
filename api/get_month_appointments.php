<?php
require_once '../includes/db_connect.php';

$month = $_GET['month'];
$year = $_GET['year'];

try {
    $query = "SELECT date_string, COUNT(*) as count 
              FROM appointments 
              WHERE MONTH(STR_TO_DATE(date_string, '%a %b %d %Y')) = ? 
              AND YEAR(STR_TO_DATE(date_string, '%a %b %d %Y')) = ?
              GROUP BY date_string";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $appointments = array();
    while ($row = $result->fetch_assoc()) {
        $date = $row['date_string'];
        $appointments[$date] = array_fill(0, $row['count'], true);
    }
    
    header('Content-Type: application/json');
    echo json_encode($appointments);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>