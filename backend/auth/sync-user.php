<?php

header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["firebase_uid"]) ||
    !isset($data["full_name"]) ||
    !isset($data["email"])
) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit;
}

$firebase_uid = trim($data["firebase_uid"]);
$full_name = trim($data["full_name"]);
$email = trim($data["email"]);

try {

    $checkUser = $conn->prepare(
        "SELECT id FROM users WHERE firebase_uid = :firebase_uid"
    );

    $checkUser->execute([
        ":firebase_uid" => $firebase_uid
    ]);

    $existingUser = $checkUser->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {

        $updateUser = $conn->prepare(
            "UPDATE users
             SET full_name = :full_name,
                 email = :email
             WHERE firebase_uid = :firebase_uid"
        );

        $updateUser->execute([
            ":full_name" => $full_name,
            ":email" => $email,
            ":firebase_uid" => $firebase_uid
        ]);

    } else {

        $insertUser = $conn->prepare(
            "INSERT INTO users
            (firebase_uid, full_name, email)
            VALUES
            (:firebase_uid, :full_name, :email)"
        );

        $insertUser->execute([
            ":firebase_uid" => $firebase_uid,
            ":full_name" => $full_name,
            ":email" => $email
        ]);
    }

    echo json_encode([
        "success" => true
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>