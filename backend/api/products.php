<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("127.0.0.1", "root", "", "homemade_ceramics");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

$sql = "
SELECT 
    p.id,
    p.name,
    p.price,
    p.old_price AS oldPrice,
    p.category,
    p.color,
    p.material,
    p.image,
    p.description,
    p.sale,
    pi.image AS galleryImage,
    pi.sort_order
FROM products p
LEFT JOIN product_images pi
ON p.id = pi.product_id
ORDER BY p.id, pi.sort_order
";

$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $id = $row["id"];

    if (!isset($products[$id])) {
        $products[$id] = [
            "id" => (int)$row["id"],
            "name" => $row["name"],
            "price" => (float)$row["price"],
            "oldPrice" => $row["oldPrice"] !== null ? (float)$row["oldPrice"] : null,
            "category" => $row["category"],
            "color" => $row["color"],
            "material" => $row["material"],
            "image" => $row["image"],
            "description" => $row["description"],
            "sale" => (bool)$row["sale"],
            "images" => []
        ];
    }

    if ($row["galleryImage"]) {
        $products[$id]["images"][] = $row["galleryImage"];
    }
}

echo json_encode(array_values($products));
$conn->close();
?>