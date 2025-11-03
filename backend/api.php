<?php
require_once 'cors.php';
require_once 'db.php';

header('Content-Type: application/json');

 $action = $_GET['action'] ?? '';

switch ($action) {
    case 'create_report':
        createReport();
        break;
    case 'list_reports':
        listReports();
        break;
    case 'get_report':
        getReport();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}

function createReport() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $conn->begin_transaction();
    
    try {
        $stmt = $conn->prepare("INSERT INTO reports (user_id, report_code, tanggal_patrol, area, plant, no_dokumen, no_revisi, tanggal_rilis, pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $report_code = 'RPT-' . date('YmdHis');
        $stmt->bind_param("issssssss", 
            $data['user_id'], 
            $report_code, 
            $data['tanggal_patrol'], 
            $data['area'], 
            $data['plant'], 
            $data['no_dokumen'], 
            $data['no_revisi'], 
            $data['tanggal_rilis'], 
            $data['pic']
        );
        $stmt->execute();
        $report_id = $conn->insert_id;
        
        $rank_a_count = 0;
        $rank_b_count = 0;
        $rank_c_count = 0;
        
        foreach ($data['items'] as $index => $item) {
            $stmt = $conn->prepare("INSERT INTO patrol_items (
                report_id, item_no, problem, before_desc, actual, standard, control_point, 
                kategori_4m, root_cause, kaizen, kaizen_category, progress, after_desc, 
                tingkat_keparahan, frekuensi, kemungkinan, score, rank, action_taken, tanggal_perbaikan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $kategori_4m = is_array($item['kategori_4m']) ? implode(',', $item['kategori_4m']) : $item['kategori_4m'];
            $stmt->bind_param("iisssssssssssiiiiisss", 
                $report_id, 
                $index + 1, 
                $item['problem'], 
                $item['before_desc'], 
                $item['actual'], 
                $item['standard'], 
                $item['control_point'], 
                $kategori_4m, 
                $item['root_cause'], 
                $item['kaizen'], 
                $item['kaizen_category'], 
                $item['progress'], 
                $item['after_desc'], 
                $item['tingkat_keparahan'], 
                $item['frekuensi'], 
                $item['kemungkinan'], 
                $item['score'], 
                $item['rank'], 
                $item['action_taken'], 
                $item['tanggal_perbaikan']
            );
            $stmt->execute();
            $item_id = $conn->insert_id;
            
            if ($item['rank'] === 'A') $rank_a_count++;
            elseif ($item['rank'] === 'B') $rank_b_count++;
            else $rank_c_count++;
            
            if (isset($item['before_image']) && !empty($item['before_image'])) {
                $stmt = $conn->prepare("INSERT INTO attachments (report_id, item_id, type, filename, filepath, uploaded_by) VALUES (?, ?, 'before', ?, ?, ?)");
                $filename = basename($item['before_image']);
                $stmt->bind_param("iisssi", $report_id, $item_id, $filename, $item['before_image'], $data['user_id']);
                $stmt->execute();
            }
            
            if (isset($item['after_image']) && !empty($item['after_image'])) {
                $stmt = $conn->prepare("INSERT INTO attachments (report_id, item_id, type, filename, filepath, uploaded_by) VALUES (?, ?, 'after', ?, ?, ?)");
                $filename = basename($item['after_image']);
                $stmt->bind_param("iisssi", $report_id, $item_id, $filename, $item['after_image'], $data['user_id']);
                $stmt->execute();
            }
        }
        
        $stmt = $conn->prepare("UPDATE reports SET total_rank_a = ?, total_rank_b = ?, total_rank_c = ? WHERE id = ?");
        $stmt->bind_param("iiii", $rank_a_count, $rank_b_count, $rank_c_count, $report_id);
        $stmt->execute();
        
        $total_score = $rank_a_count * 20 + $rank_b_count * 10 + $rank_c_count * 5;
        $stmt = $conn->prepare("INSERT INTO scores_summary (report_id, tanggal, rank_a, rank_b, rank_c, total_score) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isiiii", $report_id, $data['tanggal_patrol'], $rank_a_count, $rank_b_count, $rank_c_count, $total_score);
        $stmt->execute();
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'report_id' => $report_id,
            'report_code' => $report_code
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
}

function listReports() {
    global $conn;
    
    $stmt = $conn->prepare("SELECT r.*, u.fullname FROM reports r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'reports' => $reports
    ]);
}

function getReport() {
    global $conn;
    $report_id = $_GET['id'] ?? 0;
    
    $stmt = $conn->prepare("SELECT r.*, u.fullname FROM reports r JOIN users u ON r.user_id = u.id WHERE r.id = ?");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $report = $stmt->get_result()->fetch_assoc();
    
    if (!$report) {
        echo json_encode(['success' => false, 'message' => 'Report not found']);
        return;
    }
    
    $stmt = $conn->prepare("SELECT * FROM patrol_items WHERE report_id = ? ORDER BY item_no");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $items_result = $stmt->get_result();
    
    $items = [];
    while ($row = $items_result->fetch_assoc()) {
        $stmt = $conn->prepare("SELECT * FROM attachments WHERE item_id = ?");
        $stmt->bind_param("i", $row['id']);
        $stmt->execute();
        $attachments_result = $stmt->get_result();
        
        $attachments = [];
        while ($attachment = $attachments_result->fetch_assoc()) {
            $attachments[$attachment['type']] = $attachment;
        }
        
        $row['attachments'] = $attachments;
        $items[] = $row;
    }
    
    $stmt = $conn->prepare("SELECT * FROM scores_summary WHERE report_id = ?");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $scores_summary = $stmt->get_result()->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'report' => $report,
        'items' => $items,
        'scores_summary' => $scores_summary
    ]);
}
?>