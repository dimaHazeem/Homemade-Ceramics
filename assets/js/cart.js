const CART_STORAGE_KEY = "cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartDropdown();
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function getPagePath(pageName) {
  const isInsidePagesFolder = window.location.pathname.includes("/assets/pages/");

  if (isInsidePagesFolder) {
    return `./${pageName}`;
  }

  return `./assets/pages/${pageName}`;
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  let cart = getCart();

  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
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

function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter(item => item.id !== productId);

  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function getCartTotal() {
  const cart = getCart();

  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function renderCartDropdown() {
  const cartDropdown = document.querySelector("#cartDropdown");

  if (!cartDropdown) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartDropdown.innerHTML = `
      <p class="text-[14px] text-[#8a8a8a] normal-case tracking-normal">
        Your cart is empty.
      </p>
    `;
    return;
  }

  const total = getCartTotal();

  cartDropdown.innerHTML = `
    <div class="space-y-6">
      ${cart.map(item => {
        return `
          <div class="flex items-center gap-6">
            <img 
              src="${getProductImageSrc(item.image)}"
              alt="${item.name}" 
              class="w-[95px] h-[95px] object-cover bg-[#f8f8f8]"
            >

            <div class="flex-1">
              <h4 class="text-[18px] uppercase tracking-[0.12em] text-black">
                ${item.name}
              </h4>

              <p class="mt-3 text-[17px] text-[#8a8a8a] normal-case tracking-normal">
                ${item.quantity} × ${formatPrice(item.price)}
              </p>
            </div>

            <button 
              onclick="removeFromCart(${item.id})"
              class="text-[26px] leading-none hover:text-[#e2b7a8] transition">
              ×
            </button>
          </div>
        `;
      }).join("")}
    </div>

    <div class="flex items-center justify-between mt-10 pt-6">
      <span class="text-[24px] text-[#8a8a8a] normal-case tracking-normal">
        Total:
      </span>

      <span class="text-[22px] text-[#8a8a8a] normal-case tracking-normal">
        ${formatPrice(total)}
      </span>
    </div>

    <a 
      href="${getPagePath("cart.html")}"
      class="block mt-8 bg-[#ffe9e2] py-5 text-center text-[12px] uppercase tracking-[0.35em] hover:bg-black hover:text-white transition">
      Cart
    </a>
  `;
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
renderCartDropdown();