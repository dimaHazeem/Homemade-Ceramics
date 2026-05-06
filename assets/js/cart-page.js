const emptyCartSection = document.querySelector("#emptyCartSection");
const cartContentSection = document.querySelector("#cartContentSection");
const cartItemsContainer = document.querySelector("#cartItemsContainer");

const cartSubtotal = document.querySelector("#cartSubtotal");
const cartTotal = document.querySelector("#cartTotal");
const cartDiscount = document.querySelector("#cartDiscount");
const discountRow = document.querySelector("#discountRow");

const updateCartBtn = document.querySelector("#updateCartBtn");
const applyCouponBtn = document.querySelector("#applyCouponBtn");
const couponInput = document.querySelector("#couponInput");
const couponMessage = document.querySelector("#couponMessage");

/*
  Temporary fake coupons.
  Later, this array will be replaced by MySQL/PHP.
*/
const coupons = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10
  },
  {
    code: "CERAMIC15",
    type: "percentage",
    value: 15
  },
  {
    code: "WELCOME5",
    type: "fixed",
    value: 5
  }
];

let appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;

function renderCartPage() {
  const cart = getCart();

  if (!cart || cart.length === 0) {
    emptyCartSection.classList.remove("hidden");
    cartContentSection.classList.add("hidden");

    localStorage.removeItem("appliedCoupon");
    appliedCoupon = null;

    return;
  }

  emptyCartSection.classList.add("hidden");
  cartContentSection.classList.remove("hidden");

  cartItemsContainer.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;

    return `
      <tr class="border-b border-[#e5e5e5]">
        <td class="py-8 w-[60px]">
          <button 
            onclick="removeCartItemFromPage(${item.id})"
            class="text-[28px] text-[#555] hover:text-black transition">
            ×
          </button>
        </td>

        <td class="py-8">
          <div class="flex items-center gap-6">
            <img 
              src="${getProductImageSrc(item.image)}" 
              alt="${item.name}" 
              class="w-[110px] h-[110px] object-cover bg-[#f8f8f8]"
            >

            <h3 class="text-[18px] normal-case tracking-normal">
              ${item.name}
            </h3>
          </div>
        </td>

        <td class="py-8 text-[18px] text-[#8a8a8a]">
          $${item.price}.00
        </td>

        <td class="py-8">
          <div class="inline-flex items-center border border-[#e5e5e5]">
            <button 
              onclick="decreaseCartQuantity(${item.id})"
              class="px-5 py-4 text-[18px] text-[#8a8a8a] hover:text-black transition">
              -
            </button>

            <span class="px-5 py-4 text-[18px] text-[#8a8a8a]">
              ${item.quantity}
            </span>

            <button 
              onclick="increaseCartQuantity(${item.id})"
              class="px-5 py-4 text-[18px] text-[#8a8a8a] hover:text-black transition">
              +
            </button>
          </div>
        </td>

        <td class="py-8 text-[18px] text-[#8a8a8a]">
          $${subtotal}.00
        </td>
      </tr>
    `;
  }).join("");

  updateCartTotals();
}

function getCartSubtotal() {
  const cart = getCart();

  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function calculateDiscount(subtotal) {
  if (!appliedCoupon) return 0;

  if (appliedCoupon.type === "percentage") {
    return subtotal * (appliedCoupon.value / 100);
  }

  if (appliedCoupon.type === "fixed") {
    return appliedCoupon.value;
  }

  return 0;
}

function updateCartTotals() {
  const subtotal = getCartSubtotal();
  const discount = calculateDiscount(subtotal);
  const safeDiscount = Math.min(discount, subtotal);
  const total = subtotal - safeDiscount;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  if (safeDiscount > 0) {
    discountRow.classList.remove("hidden");
    cartDiscount.textContent = `-$${safeDiscount.toFixed(2)}`;
  } else {
    discountRow.classList.add("hidden");
    cartDiscount.textContent = "-$0.00";
  }

  updateCartCount();

  if (typeof renderCartDropdown === "function") {
    renderCartDropdown();
  }
}

function applyCoupon(code) {
  const normalizedCode = code.trim().toUpperCase();

  const foundCoupon = coupons.find(coupon => {
    return coupon.code === normalizedCode;
  });

  if (!foundCoupon) {
    appliedCoupon = null;
    localStorage.removeItem("appliedCoupon");

    couponMessage.textContent = "Invalid coupon code.";
    couponMessage.className = "mt-4 text-[14px] normal-case tracking-normal text-red-500";

    updateCartTotals();
    return;
  }

  appliedCoupon = foundCoupon;
  localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));

  couponMessage.textContent = `Coupon ${foundCoupon.code} applied successfully.`;
  couponMessage.className = "mt-4 text-[14px] normal-case tracking-normal text-green-600";

  updateCartTotals();
  showCartPageToast(`Coupon ${foundCoupon.code} applied`);
}

function removeCartItemFromPage(productId) {
  let cart = getCart();

  cart = cart.filter(item => item.id !== productId);

  saveCart(cart);
  renderCartPage();
}

function increaseCartQuantity(productId) {
  let cart = getCart();

  const item = cart.find(product => product.id === productId);

  if (item) {
    item.quantity += 1;
  }

  saveCart(cart);
  renderCartPage();
}

function decreaseCartQuantity(productId) {
  let cart = getCart();

  const item = cart.find(product => product.id === productId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter(product => product.id !== productId);
  }

  saveCart(cart);
  renderCartPage();
}

if (updateCartBtn) {
  updateCartBtn.addEventListener("click", function () {
    renderCartPage();
    showCartPageToast("Cart updated");
  });
}

if (applyCouponBtn) {
  applyCouponBtn.addEventListener("click", function () {
    const coupon = couponInput.value;

    if (coupon.trim() === "") {
      couponMessage.textContent = "Please enter a coupon code.";
      couponMessage.className = "mt-4 text-[14px] normal-case tracking-normal text-red-500";
      return;
    }

    applyCoupon(coupon);
  });
}

function showCartPageToast(message) {
  const oldToast = document.querySelector(".cart-page-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className =
    "cart-page-toast fixed top-8 left-1/2 -translate-x-1/2 bg-[#211f1f] text-white px-8 py-4 text-[12px] uppercase tracking-[0.18em] z-50 shadow-lg";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

renderCartPage();