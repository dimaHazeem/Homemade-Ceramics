function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  let cart = getCart();

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${product.name} added to cart`);
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count");
  const cart = getCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElements.forEach(element => {
    element.textContent = totalQuantity;
  });
}

updateCartCount();