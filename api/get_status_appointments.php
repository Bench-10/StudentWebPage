<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');

try {
    // Get paid appointments
    $paidQuery = "SELECT * FROM appointments WHERE status = 'paid' ORDER BY paid_date DESC";
    $paidResult = mysqli_query($conn, $paidQuery);
    
    $paid = [];
    while ($row = mysqli_fetch_assoc($paidResult)) {
        $paid[] = [
            'id' => $row['id'],
            'fullName' => $row['full_name'],
            'program' => $row['program'],
            'contactNumber' => $row['contact_number'],
            'yearLevel' => $row['year_level'],
            'documentation' => $row['documentation'],
            'status' => $row['status'],
            'dateString' => $row['date_string'],
            'paidDate' => $row['paid_date'],
            'expectedClaimDate' => $row['expected_claim_date']
        ];
    }
    
    // Get missed appointments
    $missedQuery = "SELECT * FROM appointments WHERE status = 'missed' ORDER BY created_at DESC";
    $missedResult = mysqli_query($conn, $missedQuery);
    
    $missed = [];
    while ($row = mysqli_fetch_assoc($missedResult)) {
        $missed[] = [
            'id' => $row['id'],
            'fullName' => $row['full_name'],
            'program' => $row['program'],
            'contactNumber' => $row['contact_number'],
            'yearLevel' => $row['year_level'],
            'documentation' => $row['documentation'],
            'status' => $row['status'],
            'dateString' => $row['date_string'],
            'paidDate' => $row['paid_date'],
            'expectedClaimDate' => $row['expected_claim_date']
        ];
    }
    
    echo json_encode([
        'paid' => $paid,
        'missed' => $missed
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 