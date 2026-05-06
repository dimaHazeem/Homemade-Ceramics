const productNotFound = document.querySelector("#productNotFound");
const productDetailsContent = document.querySelector("#productDetailsContent");

const productImage = document.querySelector("#productImage");

const productCategory = document.querySelector("#productCategory");
const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const productDescription = document.querySelector("#productDescription");
const productColor = document.querySelector("#productColor");
const productMaterial = document.querySelector("#productMaterial");
const productSku = document.querySelector("#productSku");
const productCategoryBottom = document.querySelector("#productCategoryBottom");

const productQuantity = document.querySelector("#productQuantity");
const increaseQuantityBtn = document.querySelector("#increaseQuantityBtn");
const decreaseQuantityBtn = document.querySelector("#decreaseQuantityBtn");
const addDetailsToCartBtn = document.querySelector("#addDetailsToCartBtn");
const addDetailsToWishlistBtn = document.querySelector("#addDetailsToWishlistBtn");

const relatedProductsContainer = document.querySelector("#relatedProductsContainer");
const productThumbnails = document.querySelector("#productThumbnails");

const productLightbox = document.querySelector("#productLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCounter = document.querySelector("#lightboxCounter");
const closeLightboxBtn = document.querySelector("#closeLightboxBtn");
const prevLightboxBtn = document.querySelector("#prevLightboxBtn");
const nextLightboxBtn = document.querySelector("#nextLightboxBtn");

let selectedProduct = null;
let quantity = 1;

let productImages = [];
let activeImageIndex = 0;

/* -----------------------------
   Helpers
----------------------------- */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function findProductById(productId) {
  return products.find(product => product.id === productId);
}

async function fetchProductFromDatabase(productId) {
  try {
    const response = await fetch(`../../backend/api/product-details.php?id=${productId}`);
    const data = await response.json();

    if (!data.success) {
      return null;
    }

    return data.product;
  } catch (error) {
    console.error("Error fetching product from database:", error);
    return null;
  }
}

/* -----------------------------
   Page State
----------------------------- */

function showProductNotFound() {
  productNotFound.classList.remove("hidden");
  productDetailsContent.classList.add("hidden");
}

function showProductContent() {
  productNotFound.classList.add("hidden");
  productDetailsContent.classList.remove("hidden");
}

/* -----------------------------
   Product Gallery
----------------------------- */

function getProductGallery(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  return [product.image];
}

function updateMainImage(index) {
  activeImageIndex = index;

  const imageSrc = getProductImageSrc(productImages[activeImageIndex]);

  productImage.src = imageSrc;
  productImage.alt = selectedProduct.name;

  const thumbButtons = document.querySelectorAll(".product-thumb-btn");

  thumbButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === activeImageIndex) {
      button.classList.add("border-black");
      button.classList.remove("border-transparent");
    } else {
      button.classList.remove("border-black");
      button.classList.add("border-transparent");
    }
  });
}

function setProductImages(product) {
  productImages = getProductGallery(product);
  activeImageIndex = 0;

  updateMainImage(activeImageIndex);

  if (!productThumbnails) return;

  const sideImages = productImages.slice(1, 5);

  const thumbPositions = [
    "object-right",
    "object-center",
    "object-center",
    "object-left-bottom"
  ];

  productThumbnails.innerHTML = sideImages.map((image, index) => {
    return `
      <button
        type="button"
        class="product-thumb-btn w-[180px] h-[145px] bg-white overflow-hidden border border-transparent hover:border-black transition flex items-center justify-center"
        data-index="${index}">

        <img
          src="${getProductImageSrc(image)}"
          alt="${product.name}"
          class="w-full h-full object-cover ${thumbPositions[index] || "object-center"}"
        >
      </button>
    `;
  }).join("");

  const thumbButtons = document.querySelectorAll(".product-thumb-btn");

  thumbButtons.forEach(button => {
    button.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      updateMainImage(index);
      openLightbox(index);
    });
  });

  productImage.addEventListener("click", function () {
    openLightbox(activeImageIndex);
  });
}

/* -----------------------------
   Lightbox
----------------------------- */

function openLightbox(index) {
  if (!productLightbox) return;

  activeImageIndex = index;
  updateLightboxImage();

  productLightbox.classList.remove("hidden");
  productLightbox.classList.add("flex");

  document.body.classList.add("overflow-hidden");
}

function closeLightbox() {
  if (!productLightbox) return;

  productLightbox.classList.add("hidden");
  productLightbox.classList.remove("flex");

  document.body.classList.remove("overflow-hidden");
}

function updateLightboxImage() {
  const imageSrc = getProductImageSrc(productImages[activeImageIndex]);

  lightboxImage.src = imageSrc;
  lightboxImage.alt = selectedProduct.name;

  lightboxCounter.textContent = `${activeImageIndex + 1}/${productImages.length}`;
}

function showNextImage() {
  activeImageIndex++;

  if (activeImageIndex >= productImages.length) {
    activeImageIndex = 0;
  }

  updateLightboxImage();
  updateMainImage(activeImageIndex);
}

function showPrevImage() {
  activeImageIndex--;

  if (activeImageIndex < 0) {
    activeImageIndex = productImages.length - 1;
  }

  updateLightboxImage();
  updateMainImage(activeImageIndex);
}

/* -----------------------------
   Product Details
----------------------------- */

function renderProductDetails(product) {
  document.title = `${product.name} | Homemade Ceramics`;

  setProductImages(product);

  productCategory.textContent = product.category;
  productName.textContent = product.name;
  productPrice.textContent = formatPrice(product.price);
  productDescription.textContent = product.description;

  productColor.textContent = capitalize(product.color);
  productMaterial.textContent = capitalize(product.material);

  productSku.textContent = `HC-${String(product.id).padStart(4, "0")}`;
  productCategoryBottom.textContent = product.category;

  productQuantity.textContent = quantity;
}

/* -----------------------------
   Related Products
----------------------------- */

function getRelatedProducts(product) {
  if (!product || !Array.isArray(products)) return [];

  const related = products
    .filter(item => item.id !== product.id)
    .map(item => {
      let score = 0;

      if (item.category === product.category) score += 5;
      if (item.material === product.material) score += 3;
      if (item.color === product.color) score += 2;

      const priceDifference = Math.abs(Number(item.price) - Number(product.price));
      const allowedDifference = Number(product.price) * 0.35;

      if (priceDifference <= allowedDifference) score += 1;

      return {
        ...item,
        relatedScore: score
      };
    })
    .filter(item => item.relatedScore > 0)
    .sort((a, b) => {
      if (b.relatedScore !== a.relatedScore) {
        return b.relatedScore - a.relatedScore;
      }

      return Math.abs(a.price - product.price) - Math.abs(b.price - product.price);
    });

  return related.slice(0, 4);
}

function renderRelatedProducts(product) {
  if (!relatedProductsContainer) return;

  const related = getRelatedProducts(product);

  if (related.length === 0) {
    relatedProductsContainer.innerHTML = `
      <p class="col-span-full text-[#8a8a8a]">
        No related products found.
      </p>
    `;
    return;
  }

  relatedProductsContainer.innerHTML = related.map(item => {
    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden bg-white">
          <a href="./product-details.html?id=${item.id}" class="block relative z-0">
            <img 
              src="${getProductImageSrc(item.image)}"
              alt="${item.name}"
              class="w-full aspect-square object-contain transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </a>

          <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

          <button
            type="button"
            onclick="toggleWishlist(${item.id})"
            class="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white z-20">
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out z-10 pointer-events-none">

            <button 
              onclick="addToCart(${item.id})"
              class="pointer-events-auto bg-[#ffe9e2] h-[54px] border border-transparent text-[11px] uppercase tracking-[0.18em] px-12 py-2 hover:bg-black hover:text-white transition duration-300">
              Add to cart
            </button>

          </div>
        </div>

        <div class="pt-5">
          <a href="./product-details.html?id=${item.id}">
            <h3 class="text-[13px] uppercase tracking-[0.15em] mb-2 hover:text-[#e2b7a8] transition">
              ${item.name}
            </h3>
          </a>

          <p class="text-[13px] text-[#6f6f6f]">
            ${formatPrice(item.price)}
          </p>
        </div>

      </div>
    `;
  }).join("");
}

/* -----------------------------
   Cart / Wishlist
----------------------------- */

function addSelectedProductToCart() {
  if (!selectedProduct) return;

  let cart = getCart();
  const existingProduct = cart.find(item => item.id === selectedProduct.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${selectedProduct.name} added to cart`);
}

/* -----------------------------
   Init
----------------------------- */

async function initProductDetailsPage() {
  const productId = getProductIdFromUrl();

  selectedProduct = await fetchProductFromDatabase(productId);

  if (!selectedProduct) {
    showProductNotFound();
    return;
  }

  quantity = 1;

  showProductContent();
  renderProductDetails(selectedProduct);
  renderRelatedProducts(selectedProduct);
}

/* -----------------------------
   Events
----------------------------- */

if (increaseQuantityBtn) {
  increaseQuantityBtn.addEventListener("click", function () {
    quantity += 1;
    productQuantity.textContent = quantity;
  });
}

if (decreaseQuantityBtn) {
  decreaseQuantityBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity -= 1;
      productQuantity.textContent = quantity;
    }
  });
}

if (addDetailsToCartBtn) {
  addDetailsToCartBtn.addEventListener("click", addSelectedProductToCart);
}

if (addDetailsToWishlistBtn) {
  addDetailsToWishlistBtn.addEventListener("click", function () {
    if (!selectedProduct) return;
    toggleWishlist(selectedProduct.id);
  });
}

if (closeLightboxBtn) {
  closeLightboxBtn.addEventListener("click", closeLightbox);
}

if (nextLightboxBtn) {
  nextLightboxBtn.addEventListener("click", showNextImage);
}

if (prevLightboxBtn) {
  prevLightboxBtn.addEventListener("click", showPrevImage);
}

if (productLightbox) {
  productLightbox.addEventListener("click", function (event) {
    if (event.target === productLightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (!productLightbox || productLightbox.classList.contains("hidden")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "ArrowLeft") {
    showPrevImage();
  }
});

initProductDetailsPage();