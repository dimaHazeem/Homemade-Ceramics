<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "homemade_ceramics");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$productId = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

if ($productId <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid product id"
    ]);
    exit;
}

/* -----------------------------
   Get selected product
----------------------------- */

$productSql = "
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
    WHERE id = ?
    LIMIT 1
";

$productStmt = $conn->prepare($productSql);
$productStmt->bind_param("i", $productId);
$productStmt->execute();

$productResult = $productStmt->get_result();

if ($productResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Product not found"
    ]);
    exit;
}

$product = $productResult->fetch_assoc();

$product["id"] = intval($product["id"]);
$product["price"] = floatval($product["price"]);
$product["old_price"] = $product["old_price"] !== null ? floatval($product["old_price"]) : null;
$product["sale"] = intval($product["sale"]);

/* -----------------------------
   Get helper images
----------------------------- */

$imagesSql = "
    SELECT image
    FROM product_images
    WHERE product_id = ?
    ORDER BY image_order ASC, id ASC
";

$imagesStmt = $conn->prepare($imagesSql);
$imagesStmt->bind_param("i", $productId);
$imagesStmt->execute();

$imagesResult = $imagesStmt->get_result();

$gallery = [];
$gallery[] = $product["image"];

while ($imageRow = $imagesResult->fetch_assoc()) {
    $gallery[] = $imageRow["image"];
}

$product["images"] = array_values(array_unique($gallery));

/* -----------------------------
   Related products
----------------------------- */

$relatedSql = "
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
        sale,
        (
            CASE WHEN category = ? THEN 5 ELSE 0 END +
            CASE WHEN material = ? THEN 3 ELSE 0 END +
            CASE WHEN color = ? THEN 2 ELSE 0 END +
            CASE WHEN ABS(price - ?) <= (? * 0.35) THEN 1 ELSE 0 END
        ) AS related_score
    FROM products
    WHERE id != ?
    HAVING related_score > 0
    ORDER BY related_score DESC, ABS(price - ?) ASC
    LIMIT 4
";

$relatedStmt = $conn->prepare($relatedSql);

$category = $product["category"];
$material = $product["material"];
$color = $product["color"];
$price = $product["price"];

$relatedStmt->bind_param(
    "sssddid",
    $category,
    $material,
    $color,
    $price,
    $price,
    $productId,
    $price
);

$relatedStmt->execute();
$relatedResult = $relatedStmt->get_result();

$relatedProducts = [];

while ($row = $relatedResult->fetch_assoc()) {
    $row["id"] = intval($row["id"]);
    $row["price"] = floatval($row["price"]);
    $row["old_price"] = $row["old_price"] !== null ? floatval($row["old_price"]) : null;
    $row["sale"] = intval($row["sale"]);
    $row["related_score"] = intval($row["related_score"]);

    $relatedProducts[] = $row;
}

echo json_encode([
    "success" => true,
    "product" => $product,
    "related_products" => $relatedProducts
]);