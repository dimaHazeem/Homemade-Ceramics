<?php
header("Content-Type: application/json");

require_once "../config/database.php";

if (!isset($_GET["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Product id is required"
    ]);
    exit;
}

$productId = intval($_GET["id"]);

$productSql = "
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
    WHERE id = ?
";

$productStmt = $conn->prepare($productSql);
$productStmt->bind_param("i", $productId);
$productStmt->execute();

$productResult = $productStmt->get_result();

if ($productResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Product not found"
    ]);
    exit;
}

$product = $productResult->fetch_assoc();

$imagesSql = "
    SELECT image_name
    FROM product_images
    WHERE product_id = ?
    ORDER BY is_main DESC, sort_order ASC
";

$imagesStmt = $conn->prepare($imagesSql);
$imagesStmt->bind_param("i", $productId);
$imagesStmt->execute();

$imagesResult = $imagesStmt->get_result();

$images = [];

while ($row = $imagesResult->fetch_assoc()) {
    $images[] = $row["image_name"];
}

if (count($images) === 0) {
    $images[] = $product["main_image"];
}

echo json_encode([
    "success" => true,
    "product" => [
        "id" => intval($product["id"]),
        "name" => $product["name"],
        "price" => floatval($product["price"]),
        "oldPrice" => $product["old_price"] !== null ? floatval($product["old_price"]) : null,
        "category" => $product["category"],
        "color" => $product["color"],
        "material" => $product["material"],
        "image" => $product["main_image"],
        "description" => $product["description"],
        "sale" => intval($product["sale"]) === 1,
        "images" => $images
    ]
]);
?>