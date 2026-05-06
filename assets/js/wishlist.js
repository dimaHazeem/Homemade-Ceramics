function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function toggleWishlist(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  let wishlist = getWishlist();

  const exists = wishlist.find(item => item.id === productId);

  if (exists) {
    wishlist = wishlist.filter(item => item.id !== productId);
    alert(`${product.name} removed from wishlist`);
  } else {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    alert(`${product.name} added to wishlist`);
  }

  saveWishlist(wishlist);
}

function updateWishlistCount() {
  const wishlistCountElements = document.querySelectorAll(".wishlist-count");
  const wishlist = getWishlist();

  wishlistCountElements.forEach(element => {
    element.textContent = wishlist.length;
  });
}

updateWishlistCount();