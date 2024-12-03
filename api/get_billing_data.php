<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

$date = isset($_GET['date']) ? $_GET['date'] : date('D M d Y');

$query = "SELECT * FROM appointments WHERE date_string = ? AND status = 'pending' ORDER BY created_at DESC";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, 's', $date);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$appointments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $appointments[] = [
        'id' => $row['id'],
        'fullName' => $row['full_name'],
        'program' => $row['program'],
        'contactNumber' => $row['contact_number'],
        'yearLevel' => $row['year_level'],
        'documentation' => $row['documentation'],
        'status' => $row['status'],
        'createdAt' => $row['created_at'],
        'dateString' => $row['date_string'],
        'paidDate' => $row['paid_date'],
        'expectedClaimDate' => $row['expected_claim_date']
    ];
}

echo json_encode($appointments);
?> 