<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$area_id = $data['area_id'] ?? 1;
$patrol_date = $data['patrol_date'] ?? date('Y-m-d');
$conducted_by = $data['conducted_by'] ?? 'Admin';
$notes = $data['notes'] ?? '';

$stmt = $pdo->prepare("INSERT INTO patrols (patrol_date, area_id, conducted_by, notes) VALUES (?, ?, ?, ?)");
$stmt->execute([$patrol_date, $area_id, $conducted_by, $notes]);

echo json_encode(["ok" => true, "id" => $pdo->lastInsertId()]);
