<?php
 $host = 'localhost';
 $user = 'root';
 $pass = '';
 $db = 'patrol_db';

 $conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>🔍 Database Diagnostic</h2>";
echo "Connected to: <strong>$db</strong><br><br>";

echo "<h3>1. Database Check</h3>";
 $db_check = $conn->query("SHOW DATABASES LIKE 'patrol_db'");
if ($db_check->num_rows > 0) {
    echo "✅ Database 'patrol_db' exists<br>";
} else {
    echo "❌ Database 'patrol_db' NOT found!<br>";
    echo "<button onclick='createDatabase()'>Create Database</button><br><br>";
}

echo "<h3>2. Table Check</h3>";
 $table_check = $conn->query("SHOW TABLES LIKE 'users'");
if ($table_check->num_rows > 0) {
    echo "✅ Table 'users' exists<br>";
    
    echo "<h4>Current Table Structure:</h4>";
    $structure = $conn->query("DESCRIBE users");
    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
    echo "<tr style='background: #f0f0f0;'><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
    while ($row = $structure->fetch_assoc()) {
        echo "<tr>";
        echo "<td><strong>{$row['Field']}</strong></td>";
        echo "<td>{$row['Type']}</td>";
        echo "<td>{$row['Null']}</td>";
        echo "<td>{$row['Key']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    $id_check = $conn->query("SHOW COLUMNS FROM users LIKE 'id'");
    if ($id_check->num_rows > 0) {
        echo "✅ Column 'id' exists<br>";
    } else {
        echo "❌ Column 'id' NOT found!<br>";
        echo "<button onclick='fixTable()'>Fix Table Structure</button><br>";
    }
    
    echo "<h4>Current Data:</h4>";
    $data = $conn->query("SELECT * FROM users LIMIT 5");
    if ($data->num_rows > 0) {
        echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
        $fields = $data->fetch_fields();
        echo "<tr style='background: #f0f0f0;'>";
        foreach ($fields as $field) {
            echo "<th>{$field->name}</th>";
        }
        echo "</tr>";
        $data->data_seek(0);
        while ($row = $data->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No data in users table<br>";
    }
    
} else {
    echo "❌ Table 'users' NOT found!<br>";
    echo "<button onclick='createTable()'>Create Table</button><br>";
}

echo "<h3>3. Login Query Test</h3>";
try {
    $test_query = $conn->prepare("SELECT id, username, password, fullname, role, department, status FROM users WHERE username = ? AND status = 'active'");
    if ($test_query) {
        echo "✅ Login query syntax is valid<br>";
    } else {
        echo "❌ Login query FAILED: " . $conn->error . "<br>";
    }
} catch (Exception $e) {
    echo "❌ Login query ERROR: " . $e->getMessage() . "<br>";
}

 $conn->close();
?>

<script>
function createDatabase() {
    if(confirm('Create database patrol_db?')) {
        window.location.href = 'setup_database.php';
    }
}

function createTable() {
    if(confirm('Create users table?')) {
        window.location.href = 'setup_database.php';
    }
}

function fixTable() {
    if(confirm('Fix table structure? This will backup and recreate the table.')) {
        window.location.href = 'fix_database.php';
    }
}
</script>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
table { width: 100%; }
th, td { padding: 8px; text-align: left; }
button { padding: 10px 15px; margin: 5px; background: #007cba; color: white; border: none; cursor: pointer; }
button:hover { background: #005a87; }
</style>