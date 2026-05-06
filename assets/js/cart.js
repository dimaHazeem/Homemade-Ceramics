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
  showToast(`${product.name} added to cart`);
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count");
  const cart = getCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElements.forEach(element => {
    element.textContent = totalQuantity;
  });
}

function showToast(message) {
  const oldToast = document.querySelector(".cart-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className =
    "cart-toast fixed top-8 left-1/2 -translate-x-1/2 bg-[#211f1f] text-white px-8 py-4 text-[12px] uppercase tracking-[0.18em] z-50 shadow-lg";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

updateCartCount();