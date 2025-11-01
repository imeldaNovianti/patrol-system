<?php
session_start();
require_once __DIR__ . '/../config/db.php';

$action = $_GET['action'] ?? '';

if ($action === 'login') {
  $data = json_decode(file_get_contents('php://input'), true);
  $username = $data['username'] ?? '';
  $password = $data['password'] ?? '';

  if ($username === 'admin' && $password === 'admin123') {
    $_SESSION['user'] = 'admin';
    echo json_encode(['ok' => true, 'user' => 'admin']);
    exit;
  } else {
    echo json_encode(['ok' => false, 'error' => 'Username atau password salah']);
    exit;
  }
}

if ($action === 'logout') {
  session_destroy();
  echo json_encode(['ok' => true]);
  exit;
}

echo json_encode(['ok' => false, 'error' => 'Aksi tidak valid']);
