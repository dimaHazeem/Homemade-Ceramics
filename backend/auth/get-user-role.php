<?php

header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["firebase_uid"])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing firebase_uid"
    ]);
    exit;
}

$firebase_uid = trim($data["firebase_uid"]);

try {
    $stmt = $conn->prepare(
        "SELECT role FROM users WHERE firebase_uid = :firebase_uid LIMIT 1"
    );

    $stmt->execute([
        ":firebase_uid" => $firebase_uid
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "role" => $user["role"]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>