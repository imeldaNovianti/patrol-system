<?php
require_once 'cors.php';
require_once 'db.php';

header('Content-Type: application/json');

 $targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $type = $_POST['type'] ?? 'before';
    $item_id = $_POST['item_id'] ?? 0;
    $report_id = $_POST['report_id'] ?? 0;
    $uploaded_by = $_POST['uploaded_by'] ?? 0;
    
    $filename = time() . '_' . basename($_FILES['file']['name']);
    $targetFile = $targetDir . $filename;
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        $path = 'uploads/' . $filename;
        
        if ($item_id > 0 && $report_id > 0) {
            $stmt = $conn->prepare("INSERT INTO attachments (report_id, item_id, type, filename, filepath, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("iisssi", $report_id, $item_id, $type, $filename, $path, $uploaded_by);
            $stmt->execute();
        }
        
        echo json_encode([
            'success' => true,
            'filepath' => $path,
            'filename' => $filename
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Upload failed'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}
?>