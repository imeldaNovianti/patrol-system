<?php
/**
 * seed_admin.php
 *
 * Usage:
 *   php seed_admin.php --username=admin --password=secret123 --full_name="Administrator" --role=Admin --department="EHS"
 *
 * If you omit arguments, defaults will be used:
 *   username: admin
 *   password: admin123
 *   full_name: Administrator
 *   role: Admin
 *   department: --
 *
 * NOTE:
 * - Pastikan konfigurasi DB di bagian CONFIGURATION sesuai environment-mu.
 * - Kolom password di DB pada schema kamu bernama `PASSWORD`, script ini menulis ke kolom tersebut.
 */

$options = getopt("", ["username::", "password::", "full_name::", "role::", "department::", "host::", "db::", "dbuser::", "dbpass::", "port::"]);

$username   = $options['username']   ?? 'admin';
$password   = $options['password']   ?? 'admin123';
$full_name  = $options['full_name']  ?? 'Administrator';
$role       = $options['role']       ?? 'Admin';
$department = $options['department'] ?? null;

// ---------- CONFIGURATION (ubah sesuai lingkunganmu) ----------
$DB_HOST = $options['host']   ?? '127.0.0.1';
$DB_PORT = $options['port']   ?? '3306';
$DB_NAME = $options['db']     ?? 'patrol_db';
$DB_USER = $options['dbuser'] ?? 'root';
$DB_PASS = $options['dbpass'] ?? '';
$CHARSET = 'utf8mb4';
// --------------------------------------------------------------

try {
    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset={$CHARSET}";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, "ERROR: Could not connect to database: " . $e->getMessage() . PHP_EOL);
    exit(2);
}

try {
    // Start transaction for safety
    $pdo->beginTransaction();

    // Check if table exists (basic guard)
    $checkTableStmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($checkTableStmt->rowCount() === 0) {
        throw new Exception("Table `users` not found in database `{$DB_NAME}`. Pastikan schema sudah di-import.");
    }

    // Prepare data
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Check existing user
    $stmt = $pdo->prepare("SELECT user_id, username FROM users WHERE username = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Update existing user: update password, name, role, department, status, updated_at
        $updateSql = "
            UPDATE users SET
                PASSWORD = :password,
                full_name = :full_name,
                ROLE = :role,
                department = :department,
                STATUS = 'active',
                updated_at = NOW()
            WHERE username = :username
        ";
        $uStmt = $pdo->prepare($updateSql);
        $uStmt->execute([
            ':password'   => $passwordHash,
            ':full_name'  => $full_name,
            ':role'       => $role,
            ':department' => $department,
            ':username'   => $username
        ]);

        $pdo->commit();
        echo "OK: Existing user '{$username}' updated successfully." . PHP_EOL;
        exit(0);
    } else {
        // Insert new user
        $insertSql = "
            INSERT INTO users (username, PASSWORD, full_name, ROLE, department, STATUS, created_at, updated_at)
            VALUES (:username, :password, :full_name, :role, :department, 'active', NOW(), NOW())
        ";
        $iStmt = $pdo->prepare($insertSql);
        $iStmt->execute([
            ':username'   => $username,
            ':password'   => $passwordHash,
            ':full_name'  => $full_name,
            ':role'       => $role,
            ':department' => $department
        ]);

        $pdo->commit();
        echo "OK: New admin user '{$username}' inserted successfully (user_id={$pdo->lastInsertId()})." . PHP_EOL;
        exit(0);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "ERROR: " . $e->getMessage() . PHP_EOL);
    exit(3);
}
