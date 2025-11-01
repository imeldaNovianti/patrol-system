<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->query("SELECT f.*, a.name AS area_name, p.patrol_date 
                     FROM findings f 
                     LEFT JOIN areas a ON f.area_id = a.id
                     LEFT JOIN patrols p ON f.patrol_id = p.id
                     ORDER BY f.reported_date DESC");

echo json_encode(["ok" => true, "data" => $stmt->fetchAll()]);
