const emptyWishlistSection = document.querySelector("#emptyWishlistSection");
const wishlistContentSection = document.querySelector("#wishlistContentSection");
const wishlistItemsContainer = document.querySelector("#wishlistItemsContainer");

function renderWishlistPage() {
  const wishlist = getWishlist();

  if (!wishlist || wishlist.length === 0) {
    emptyWishlistSection.classList.remove("hidden");
    wishlistContentSection.classList.add("hidden");
    return;
  }

  emptyWishlistSection.classList.add("hidden");
  wishlistContentSection.classList.remove("hidden");

  wishlistItemsContainer.innerHTML = wishlist.map(item => {
    return `
      <tr class="border-b border-[#e5e5e5]">
        <td class="py-8 w-[60px]">
          <button 
            onclick="removeWishlistItemFromPage(${item.id})"
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
          ${formatPrice(item.price)}
        </td>

        <td class="py-8 text-[18px] text-[#8a8a8a]">
          In Stock
        </td>

        <td class="py-8 text-right">
          <button 
            onclick="moveWishlistItemToCart(${item.id})"
            class="bg-[#ffe9e2] px-10 py-5 text-[12px] uppercase tracking-[0.28em] hover:bg-black hover:text-white transition">
            Add To Cart
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function removeWishlistItemFromPage(productId) {
  let wishlist = getWishlist();

  wishlist = wishlist.filter(item => item.id !== productId);

  saveWishlist(wishlist);
  renderWishlistPage();
}

function moveWishlistItemToCart(productId) {
  const wishlist = getWishlist();
  const item = wishlist.find(product => product.id === productId);

  if (!item) return;

  addToCart(item.id);
  removeWishlistItemFromPage(item.id);

  showWishlistPageToast(`${item.name} moved to cart`);
}

function showWishlistPageToast(message) {
  const oldToast = document.querySelector(".wishlist-page-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className =
    "wishlist-page-toast fixed top-8 left-1/2 -translate-x-1/2 bg-[#211f1f] text-white px-8 py-4 text-[12px] uppercase tracking-[0.18em] z-50 shadow-lg";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

renderWishlistPage();