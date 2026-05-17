<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "homemade_ceramics");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

$firebase_uid = trim($_GET["firebase_uid"] ?? "");

if ($firebase_uid === "") {
    echo json_encode([
        "success" => false,
        "message" => "Missing firebase_uid."
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        id,
        firebase_uid,
        full_name,
        email,
        role,
        phone,
        city,
        address,
        avatar_data,
        created_at
    FROM users
    WHERE firebase_uid = ?
    LIMIT 1
");

$stmt->bind_param("s", $firebase_uid);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "user" => $user
]);