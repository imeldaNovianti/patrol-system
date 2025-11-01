<?php
// config/db.php
header('Content-Type: application/json');

$DB_HOST = 'localhost';
$DB_NAME = 'safety_db';
$DB_USER = 'root';
$DB_PASS = ''; // kosong bawaan XAMPP

try {
  $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Koneksi DB gagal: " . $e->getMessage()]);
  exit;
}
