<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$area_id = $_POST['area_id'] ?? 1;
$patrol_id = $_POST['patrol_id'] ?? null;
$title = $_POST['title'] ?? '';
$actual_before = $_POST['actual_before'] ?? '';
$root_cause = $_POST['root_cause'] ?? '';
$four_m_set = $_POST['four_m'] ?? ''; // Material,Machine,...
$control_point = $_POST['control_point'] ?? '';
$severity = intval($_POST['severity'] ?? 1);
$frequency = intval($_POST['frequency'] ?? 1);
$probability = intval($_POST['probability'] ?? 1);
$score_before = $severity * $frequency * $probability;
$rank_before = ($score_before >= 25) ? 'A' : (($score_before >= 10) ? 'B' : 'C');
$reported_by = $_SESSION['user'] ?? 'admin';
$photo_path = null;

// Upload foto
if (!empty($_FILES['photo']['name'])) {
  $dir = __DIR__ . '/../uploads/';
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  $filename = time() . '_' . basename($_FILES['photo']['name']);
  move_uploaded_file($_FILES['photo']['tmp_name'], $dir . $filename);
  $photo_path = 'uploads/' . $filename;
}

$stmt = $pdo->prepare("INSERT INTO findings 
(area_id, patrol_id, title, actual_before, root_cause, four_m_set, control_point, severity, frequency, probability, score_before, rank_before, reported_by, photo_path)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

$stmt->execute([$area_id, $patrol_id, $title, $actual_before, $root_cause, $four_m_set, $control_point, $severity, $frequency, $probability, $score_before, $rank_before, $reported_by, $photo_path]);

echo json_encode(["ok" => true, "id" => $pdo->lastInsertId()]);
