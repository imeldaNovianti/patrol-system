<?php
 $host = 'localhost';
 $user = 'root';
 $pass = '';
 $db = 'patrol_db';

 $conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>🔧 Fix Database Structure</h2>";

echo "<h3>1. Backing up existing data...</h3>";
 $backup_data = [];
 $backup_result = $conn->query("SELECT * FROM users");
if ($backup_result) {
    while ($row = $backup_result->fetch_assoc()) {
        $backup_data[] = $row;
    }
    echo "✅ Backed up " . count($backup_data) . " records<br>";
}

echo "<h3>2. Dropping existing table...</h3>";
 $conn->query("DROP TABLE IF EXISTS users");
echo "✅ Dropped existing table<br>";

echo "<h3>3. Creating correct table structure...</h3>";
 $sql = "CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(150) NOT NULL,
  role ENUM('EHS','Leader','Supervisor','Admin') NOT NULL DEFAULT 'Leader',
  department VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if ($conn->query($sql)) {
    echo "✅ Created new table structure<br>";
} else {
    echo "❌ Error creating table: " . $conn->error . "<br>";
    exit;
}

echo "<h3>4. Migrating data...</h3>";
foreach ($backup_data as $old_user) {
    $username = $old_user['username'];
    
    $password = $old_user['PASSWORD'];
    if (strlen($password) < 60) { // Not a bcrypt hash
        $password = password_hash($password, PASSWORD_DEFAULT);
    }
    
    $fullname = $old_user['full_name'];
    $role = $old_user['ROLE'];
    $department = $old_user['department'];
    $status = $old_user['STATUS'] ?? 'active';
    
    $stmt = $conn->prepare("INSERT INTO users (username, password, fullname, role, department, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $username, $password, $fullname, $role, $department, $status);
    $stmt->execute();
}
echo "✅ Migrated " . count($backup_data) . " records<br>";

echo "<h3>5. Ensuring default user exists...</h3>";
 $stmt = $conn->prepare("SELECT * FROM users WHERE username = 'imelda'");
 $stmt->execute();
 $result = $stmt->get_result();

if ($result->num_rows == 0) {
    $default_password = password_hash('imelda2323', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, password, fullname, role) VALUES (?, ?, ?, ?)");
    
    $username = 'imelda';
    $fullname = 'Imelda Novianti';
    $role = 'Admin';
    
    $stmt->bind_param("ssss", $username, $default_password, $fullname, $role);
    
    if ($stmt->execute()) {
        echo "✅ Created default user 'imelda'<br>";
    } else {
        echo "❌ Error creating default user: " . $conn->error . "<br>";
    }
} else {
    echo "ℹ️ User 'imelda' already exists<br>";
}

echo "<h3>6. Testing login query...</h3>";
try {
    $test_query = $conn->prepare("SELECT id, username, password, fullname, role, department, status FROM users WHERE username = ? AND status = 'active'");
    $test_username = 'imelda';
    $test_query->bind_param("s", $test_username);
    $test_query->execute();
    $result = $test_query->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo "✅ Login query SUCCESS!<br>";
        echo "Found user: " . $user['fullname'] . " (" . $user['role'] . ")<br>";
        
        if (password_verify('imelda2323', $user['password'])) {
            echo "✅ Password verification SUCCESS!<br>";
        } else {
            echo "❌ Password verification FAILED!<br>";
        }
    } else {
        echo "❌ Login query returned no results<br>";
    }
} catch (Exception $e) {
    echo "❌ Login query ERROR: " . $e->getMessage() . "<br>";
}

echo "<h3>✅ Database Structure Fix Complete!</h3>";
echo "<a href='test_login.php'>Test Login</a> | ";
echo "<a href='diagnostic.php'>Run Diagnostic Again</a>";

 $conn->close();
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h2, h3 { color: #333; }
a { color: #007cba; text-decoration: none; padding: 5px 10px; border: 1px solid #007cba; border-radius: 3px; margin-right: 10px; }
a:hover { background: #007cba; color: white; }
</style>