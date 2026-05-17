<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "homemade_ceramics");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$sql = "
    SELECT
        id,
        name,
        price,
        old_price,
        category,
        color,
        material,
        image,
        description,
        sale
    FROM products
    ORDER BY id ASC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "SQL error: " . $conn->error
    ]);
    exit;
}

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = [
        "id" => (int) $row["id"],
        "name" => $row["name"],
        "price" => (float) $row["price"],
        "old_price" => $row["old_price"] !== null ? (float) $row["old_price"] : null,
        "category" => $row["category"],
        "color" => $row["color"],
        "material" => $row["material"],
        "image" => $row["image"],
        "description" => $row["description"],
        "sale" => (int) $row["sale"]
    ];
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);

$conn->close();
?>