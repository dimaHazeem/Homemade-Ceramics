const products = [
  {
    id: 1,
    name: "Bowl for Lunch",
    price: 165,
    category: "Bowls",
    color: "brown",
    material: "wood",
    image: "../images/shop-img/product-16-550x550.jpg",
    description: "A warm bowl designed for simple lunch serving and natural table styling."
  },
  {
    id: 2,
    name: "Brown Jar",
    price: 60,
    oldPrice: 100,
    category: "Jars",
    color: "beige",
    material: "ceramic",
    image: "../images/shop-img/product-14-1-550x550 (1).jpg",
    description: "A minimal brown jar with a clean handmade finish.",
    sale: true
  },
  {
    id: 3,
    name: "Ceramic Plate",
    price: 65,
    category: "Plates",
    color: "white",
    material: "ceramic",
    image: "../images/shop-img/product-10-550x550.jpg",
    description: "A simple ceramic plate with a soft elegant shape for everyday use."
  },
  {
    id: 4,
    name: "Clay Mug",
    price: 265,
    category: "Mugs",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-9-550x550.jpg",
    description: "A handmade clay mug with a soft tone and a comfortable handle."
  },
  {
    id: 5,
    name: "Clay Plate",
    price: 65,
    category: "Plates",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-3-550x550.jpg",
    description: "A delicate clay plate with a pale accent and smooth ceramic surface."
  },
  {
    id: 6,
    name: "Cutting Board",
    price: 65,
    category: "Boards",
    color: "brown",
    material: "wood",
    image: "../images/shop-img/product-8-550x550.jpg",
    description: "A wooden cutting board with a practical handle and natural finish."
  },
  {
    id: 7,
    name: "Designed Plate",
    price: 165,
    category: "Plates",
    color: "beige",
    material: "ceramic",
    image: "../images/shop-img/product-7-550x550.jpg",
    description: "A designed ceramic plate with a soft organic shape and artistic look."
  },
  {
    id: 8,
    name: "Desk Chair",
    price: 187,
    category: "Furniture",
    color: "brown",
    material: "wood",
    image: "../images/shop-img/product-6-550x550.jpg",
    description: "A wooden desk chair with a natural handmade style."
  },
  {
    id: 9,
    name: "Dessert Blue Plate",
    price: 120,
    category: "Plates",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-5-550x550.jpg",
    description: "A blue dessert plate with a calm modern finish."
  },
  {
    id: 10,
    name: "Dessert Plate",
    price: 65,
    category: "Plates",
    color: "beige",
    material: "ceramic",
    image: "../images/shop-img/product-14-1-550x550.jpg",
    description: "A simple dessert plate suitable for sweets, snacks, and small servings."
  },
  {
    id: 11,
    name: "Golden Decor",
    price: 250,
    category: "Decor",
    color: "gold",
    material: "metal",
    image: "../images/shop-img/product-25-new-300x300.jpg",
    description: "A golden decorative piece that adds elegance to interior spaces."
  },
  {
    id: 12,
    name: "Golden Plate",
    price: 250,
    category: "Plates",
    color: "gold",
    material: "ceramic",
    image: "../images/shop-img/product-57-550x550.jpg",
    description: "A ceramic plate with golden edges and a refined handmade finish."
  },

  {
    id: 13,
    name: "Marine Plate",
    price: 169,
    category: "Plates",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-16-550x550.jpg",
    description: "A marine-inspired plate with a bold ceramic texture."
  },
  {
    id: 14,
    name: "Milk Jug",
    price: 169,
    category: "Jugs",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-14-1-550x550 (1).jpg",
    description: "A soft ceramic milk jug designed for elegant table serving."
  },
  {
    id: 15,
    name: "Nordic Vase",
    price: 452,
    category: "Vases",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-10-550x550.jpg",
    description: "A Nordic-style vase with a calm tone and smooth finish."
  },
  {
    id: 16,
    name: "Ocean Plate",
    price: 250,
    category: "Plates",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-9-550x550.jpg",
    description: "An ocean-inspired ceramic plate with soft aqua tones."
  },
  {
    id: 17,
    name: "Pastel Vase",
    price: 178,
    category: "Vases",
    color: "brown",
    material: "wood",
    image: "../images/shop-img/product-3-550x550.jpg",
    description: "A pastel-inspired vase with a warm handmade design."
  },
  {
    id: 18,
    name: "Pink Mug",
    price: 452,
    category: "Mugs",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-8-550x550.jpg",
    description: "A pink ceramic mug with a soft modern shape."
  },
  {
    id: 19,
    name: "Pink Oval Plate",
    price: 354,
    category: "Plates",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-7-550x550.jpg",
    description: "A pink oval ceramic plate with golden edging and a delicate finish."
  },
  {
    id: 20,
    name: "Porcelain Jar",
    price: 300,
    category: "Jars",
    color: "pink",
    material: "porcelain",
    image: "../images/shop-img/product-6-550x550.jpg",
    description: "A porcelain jar with a soft surface and elegant handmade details."
  },
  {
    id: 21,
    name: "Retro Table",
    price: 154,
    category: "Furniture",
    color: "gold",
    material: "metal",
    image: "../images/shop-img/product-5-550x550.jpg",
    description: "A retro decorative table piece with a golden artistic structure."
  },
  {
    id: 22,
    name: "Rose Cutlery",
    price: 150,
    category: "Cutlery",
    color: "gold",
    material: "metal",
    image: "../images/shop-img/product-14-1-550x550.jpg",
    description: "A rose-inspired golden cutlery set for elegant table styling."
  },
  {
    id: 23,
    name: "Rose Dinnerwear",
    price: 311,
    category: "Dinnerware",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-25-new-300x300.jpg",
    description: "A rose dinnerware piece with soft ceramic tones."
  },
  {
    id: 24,
    name: "Rose Jug",
    price: 452,
    category: "Jugs",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-57-550x550.jpg",
    description: "A soft ceramic jug designed for modern serving."
  },

  {
    id: 25,
    name: "Rose Oval Plate",
    price: 300,
    category: "Plates",
    color: "pink",
    material: "ceramic",
    image: "../images/shop-img/product-16-550x550.jpg",
    description: "A rose oval plate with a delicate pink tone and gold edge."
  },
  {
    id: 26,
    name: "Sand Plate",
    price: 264,
    category: "Plates",
    color: "gold",
    material: "ceramic",
    image: "../images/shop-img/product-14-1-550x550 (1).jpg",
    description: "A sand-inspired ceramic plate with subtle golden details."
  },
  {
    id: 27,
    name: "Skyblue Plate",
    price: 250,
    category: "Plates",
    color: "blue",
    material: "ceramic",
    image: "../images/shop-img/product-10-550x550.jpg",
    description: "A sky-blue ceramic plate with a smooth modern finish."
  },
  {
    id: 28,
    name: "Soup Set",
    price: 140,
    category: "Sets",
    color: "gold",
    material: "metal",
    image: "../images/shop-img/product-9-550x550.jpg",
    description: "A golden soup set designed for elegant serving moments."
  },
  {
    id: 29,
    name: "Stylo Table",
    price: 180,
    category: "Furniture",
    color: "brown",
    material: "wood",
    image: "../images/shop-img/product-3-550x550.jpg",
    description: "A wooden stylo table with a simple handmade furniture style."
  },
  {
    id: 30,
    name: "Tea Set",
    price: 165,
    category: "Sets",
    color: "beige",
    material: "ceramic",
    image: "../images/shop-img/product-8-550x550.jpg",
    description: "A soft ceramic tea set with an organic handmade shape."
  },
  {
    id: 31,
    name: "Wooden Bowl",
    price: 150,
    category: "Bowls",
    color: "black",
    material: "wood",
    image: "../images/shop-img/product-7-550x550.jpg",
    description: "A wooden bowl set with a dark elegant finish."
  }
];