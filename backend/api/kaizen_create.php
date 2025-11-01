<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$finding_id = $data['finding_id'];
$category = $data['category'];
$action_description = $data['action_description'];
$pic = $data['pic'];
$action_date = $data['action_date'];

$stmt = $pdo->prepare("INSERT INTO kaizen_actions (finding_id, category, action_description, pic, action_date)
VALUES (?,?,?,?,?)");
$stmt->execute([$finding_id, $category, $action_description, $pic, $action_date]);

echo json_encode(["ok" => true]);
