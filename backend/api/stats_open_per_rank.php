<?php
require_once __DIR__ . '/../config/db.php';

$start = $_GET['start'] ?? '2024-07-01';
$end = $_GET['end'] ?? '2024-08-30';

$stmt = $pdo->prepare("SELECT
  DATE(reported_date) as dt,
  SUM(CASE WHEN rank_before='A' AND status!='closed' THEN 1 ELSE 0 END) as open_A,
  SUM(CASE WHEN rank_before='B' AND status!='closed' THEN 1 ELSE 0 END) as open_B,
  SUM(CASE WHEN rank_before='C' AND status!='closed' THEN 1 ELSE 0 END) as open_C
FROM findings
WHERE DATE(reported_date) BETWEEN ? AND ?
GROUP BY DATE(reported_date)
ORDER BY dt");
$stmt->execute([$start, $end]);

echo json_encode(["ok" => true, "data" => $stmt->fetchAll()]);
