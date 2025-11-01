<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->query("SELECT * FROM areas ORDER BY id ASC");
echo json_encode(["ok" => true, "data" => $stmt->fetchAll()]);
