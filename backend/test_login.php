<?php
require_once 'cors.php';
require_once 'db.php';

echo "<h2>🧪 Quick Login Test</h2>";

function testLogin($username, $password) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id, username, password, fullname, role, department, status FROM users WHERE username = ? AND status = 'active'");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            return ['success' => true, 'user' => $user];
        } else {
            return ['success' => false, 'message' => 'Invalid password'];
        }
    } else {
        return ['success' => false, 'message' => 'User not found or inactive'];
    }
}

echo "<h3>Test 1: Correct Credentials</h3>";
 $result1 = testLogin('imelda', 'imelda2323');
echo "<pre>" . json_encode($result1, JSON_PRETTY_PRINT) . "</pre>";

echo "<h3>Test 2: Wrong Password</h3>";
 $result2 = testLogin('imelda', 'wrongpassword');
echo "<pre>" . json_encode($result2, JSON_PRETTY_PRINT) . "</pre>";

echo "<h3>Test 3: Non-existent User</h3>";
 $result3 = testLogin('nonexistent', 'password');
echo "<pre>" . json_encode($result3, JSON_PRETTY_PRINT) . "</pre>";

echo "<h3>✅ Test Complete!</h3>";
echo "<a href='diagnostic.php'>Back to Diagnostic</a>";

 $conn->close();
?>