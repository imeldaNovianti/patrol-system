<?php
require_once __DIR__ . '/../config/db.php';

$start = $_GET['start'] ?? '2024-07-01';
$end = $_GET['end'] ?? '2024-08-30';

$stmt = $pdo->prepare("SELECT DATE(reported_date) as dt, COUNT(*) as new_reported
                       FROM findings 
                       WHERE DATE(reported_date) BETWEEN ? AND ?
                       GROUP BY DATE(reported_date)
                       ORDER BY dt");
$stmt->execute([$start, $end]);

$rows = $stmt->fetchAll();
$cumulative = 0;
$result = [];
foreach ($rows as $r) {
  $cumulative += $r['new_reported'];
  $result[] = ["date" => $r['dt'], "new_reported" => $r['new_reported'], "cumulative" => $cumulative];
}

echo json_encode(["ok" => true, "data" => $result]);
