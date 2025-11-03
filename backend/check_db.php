<?php
require_once 'db.php';

echo "<h2>Database Connection Test</h2>";
echo "Connected to database: " . $conn->host_info . "<br>";

 $result = $conn->query("SHOW TABLES LIKE 'users'");
if ($result->num_rows > 0) {
    echo "✅ Table 'users' exists<br>";
    
    $result = $conn->query("DESCRIBE users");
    echo "<h3>Users Table Structure:</h3>";
    echo "<table border='1'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr><td>{$row['Field']}</td><td>{$row['Type']}</td><td>{$row['Null']}</td><td>{$row['Key']}</td></tr>";
    }
    echo "</table>";
    
    $result = $conn->query("SELECT * FROM users LIMIT 5");
    if ($result->num_rows > 0) {
        echo "<h3>Sample Data:</h3>";
        echo "<table border='1'>";
        $fields = $result->fetch_fields();
        echo "<tr>";
        foreach ($fields as $field) {
            echo "<th>{$field->name}</th>";
        }
        echo "</tr>";
        $result->data_seek(0);
        while ($row = $result->fetch_assoc()) {
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
    echo "❌ Table 'users' does not exist<br>";
}

 $conn->close();
?>