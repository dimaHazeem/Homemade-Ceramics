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

$data = json_decode(file_get_contents("php://input"), true);

$firebase_uid = trim($data["firebase_uid"] ?? "");

if ($firebase_uid === "") {
    echo json_encode([
        "success" => false,
        "message" => "Missing firebase_uid."
    ]);
    exit;
}

$allowedFields = ["full_name", "email", "phone", "city", "address", "avatar_data"];

$fields = [];
$params = [];
$types = "";

foreach ($allowedFields as $field) {
    if (array_key_exists($field, $data)) {
        $fields[] = "$field = ?";
        $params[] = $data[$field];
        $types .= "s";
    }
}

if (count($fields) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "No fields to update."
    ]);
    exit;
}

$params[] = $firebase_uid;
$types .= "s";

$sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE firebase_uid = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Update failed: " . $stmt->error
    ]);
    exit;
}

$getUser = $conn->prepare("
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

$getUser->bind_param("s", $firebase_uid);
$getUser->execute();

$result = $getUser->get_result();
$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "message" => "User updated successfully.",
    "user" => $user
]);