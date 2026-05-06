function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  renderWishlistDropdown();
}

function toggleWishlist(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  let wishlist = getWishlist();

  const existingProduct = wishlist.find(item => item.id === productId);

  if (existingProduct) {
    wishlist = wishlist.filter(item => item.id !== productId);
    showWishlistToast(`${product.name} removed from wishlist`);
  } else {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });

    showWishlistToast(`${product.name} added to wishlist`);
  }

  saveWishlist(wishlist);
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist();

  wishlist = wishlist.filter(item => item.id !== productId);

  saveWishlist(wishlist);
}

function updateWishlistCount() {
  const wishlist = getWishlist();

  document.querySelectorAll(".wishlist-count").forEach(element => {
    element.textContent = wishlist.length;
  });
}

function renderWishlistDropdown() {
  const wishlistDropdown = document.querySelector("#wishlistDropdown");

  if (!wishlistDropdown) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistDropdown.innerHTML = `
      <p class="text-[14px] text-[#8a8a8a] normal-case tracking-normal">
        Your wishlist is empty.
      </p>
    `;
    return;
  }

  wishlistDropdown.innerHTML = `
    <div class="space-y-6">
      ${wishlist.map(item => {
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
                $${item.price}.00
              </p>
            </div>

            <button 
              onclick="removeFromWishlist(${item.id})"
              class="text-[26px] leading-none hover:text-[#e2b7a8] transition">
              ×
            </button>
          </div>
        `;
      }).join("")}
    </div>

    <a 
      href="./wishlist.html"
      class="block mt-8 bg-[#ffe9e2] py-5 text-center text-[12px] uppercase tracking-[0.35em] hover:bg-black hover:text-white transition">
      Wishlist
    </a>
  `;
}

function showWishlistToast(message) {
  const oldToast = document.querySelector(".wishlist-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className =
    "wishlist-toast fixed top-8 left-1/2 -translate-x-1/2 bg-[#211f1f] text-white px-8 py-4 text-[12px] uppercase tracking-[0.18em] z-50 shadow-lg";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

updateWishlistCount();
renderWishlistDropdown();