<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$status = $data['status'] ?? 'closed';
$rank_after = $data['rank_after'] ?? 'C';
$closed_by = $_SESSION['user'] ?? 'admin';

$stmt = $pdo->prepare("UPDATE findings 
                       SET status=?, rank_after=?, closed_by=?, closed_date=NOW()
                       WHERE id=?");
$stmt->execute([$status, $rank_after, $closed_by, $id]);

echo json_encode(["ok" => true]);
