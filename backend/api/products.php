<?php
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
    SELECT 
        id,
        name,
        price,
        old_price,
        category,
        color,
        material,
        main_image,
        description,
        sale
    FROM products
    ORDER BY id ASC
";

$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = [
        "id" => intval($row["id"]),
        "name" => $row["name"],
        "price" => floatval($row["price"]),
        "oldPrice" => $row["old_price"] !== null ? floatval($row["old_price"]) : null,
        "category" => $row["category"],
        "color" => $row["color"],
        "material" => $row["material"],
        "image" => $row["main_image"],
        "description" => $row["description"],
        "sale" => intval($row["sale"]) === 1
    ];
}

echo json_encode([
    "success" => true,
    "products" => $products
]);
?>