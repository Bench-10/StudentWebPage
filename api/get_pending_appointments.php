<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

$query = "SELECT * FROM appointments WHERE status = 'pending'";
$result = mysqli_query($conn, $query);

$appointments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $appointments[] = [
        'id' => $row['id'],
        'date_string' => $row['date_string'],
        'status' => $row['status']
    ];
}

echo json_encode($appointments);
?> 