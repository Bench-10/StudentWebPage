<?php
require_once '../includes/db_connect.php';

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get announcements
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT * FROM announcements ORDER BY is_important DESC, created_at DESC";
        $result = $conn->query($sql);
        
        if (!$result) {
            throw new Exception($conn->error);
        }
        
        $announcements = [];
        while ($row = $result->fetch_assoc()) {
            $announcements[] = $row;
        }
        
        echo json_encode($announcements);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Add announcement
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['title']) || !isset($data['content'])) {
            throw new Exception('Missing required fields');
        }
        
        $title = $data['title'];
        $content = $data['content'];
        $isImportant = isset($data['is_important']) && $data['is_important'] === true ? 1 : 0;
        
        $stmt = $conn->prepare("INSERT INTO announcements (title, content, is_important) VALUES (?, ?, ?)");
        if (!$stmt) {
            throw new Exception($conn->error);
        }
        
        $stmt->bind_param('ssi', $title, $content, $isImportant);
        
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'id' => $conn->insert_id
        ]);
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Delete announcement
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception('Missing announcement ID');
        }
        
        $stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
        if (!$stmt) {
            throw new Exception($conn->error);
        }
        
        $stmt->bind_param('i', $id);
        
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        
        echo json_encode(['success' => true]);
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

$conn->close(); 