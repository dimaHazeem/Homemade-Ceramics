function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function toggleWishlist(productId) {
  console.log("Heart clicked, product id:", productId);

  const product = products.find(item => item.id === productId);

  if (!product) {
    console.log("Product not found");
    return;
  }

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

function updateWishlistCount() {
  const wishlist = getWishlist();
  const countElements = document.querySelectorAll(".wishlist-count");

  console.log("Wishlist count:", wishlist.length);
  console.log("Wishlist count elements found:", countElements.length);

  countElements.forEach(element => {
    element.textContent = wishlist.length;
  });
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