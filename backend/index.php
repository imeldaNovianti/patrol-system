<?php
header('Content-Type: application/json');
echo json_encode([
  "ok" => true,
  "message" => "Safety System API aktif di http://localhost/safety-system/api/"
]);
