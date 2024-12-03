<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

$query = "SELECT * FROM appointments WHERE status = 'pending'";
$result = mysqli_query($conn, $query);

$appointments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $appointments[$row['date_string']][] = [
        'fullName' => $row['full_name'],
        'program' => $row['program'],
        'contactNumber' => $row['contact_number'],
        'yearLevel' => $row['year_level'],
        'documentation' => $row['documentation']
    ];
}

echo json_encode($appointments);
?> 