<?php
$conn = new mysqli("localhost", "root", "", "homemade_ceramics");

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]));
}

$conn->set_charset("utf8mb4");
?>