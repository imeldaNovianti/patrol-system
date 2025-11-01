<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->query("SELECT p.*, a.name AS area_name FROM patrols p 
                     LEFT JOIN areas a ON p.area_id = a.id 
                     ORDER BY p.patrol_date DESC");
echo json_encode(["ok" => true, "data" => $stmt->fetchAll()]);
