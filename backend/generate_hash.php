<?php
$passwords = [
    'admin123',
    'ehs123',
    'zul123'
];

foreach ($passwords as $pw) {
    echo "Password: $pw\n";
    echo "Hash: " . password_hash($pw, PASSWORD_BCRYPT) . "\n\n";
}
