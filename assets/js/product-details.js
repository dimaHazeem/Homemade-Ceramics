const productNotFound = document.querySelector("#productNotFound");
const productDetailsContent = document.querySelector("#productDetailsContent");

const productImage = document.querySelector("#productImage");
const productThumbnails = document.querySelector("#productThumbnails");

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

const productLightbox = document.querySelector("#productLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCounter = document.querySelector("#lightboxCounter");
const closeLightboxBtn = document.querySelector("#closeLightboxBtn");
const prevLightboxBtn = document.querySelector("#prevLightboxBtn");
const nextLightboxBtn = document.querySelector("#nextLightboxBtn");

let selectedProduct = null;
let relatedProducts = [];
let quantity = 1;

let productImages = [];
let activeImageIndex = 0;

/* -----------------------------
   Backend Path
----------------------------- */

function getApiPath(fileName) {
  const isInsidePagesFolder = window.location.pathname.includes("/assets/pages/");

  if (isInsidePagesFolder) {
    return `../../backend/api/${fileName}`;
  }

  return `./backend/api/${fileName}`;
}

const PRODUCT_DETAILS_API = getApiPath("product-details.php");

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

function getProductImageSrc(imageName) {
  if (!imageName) return "";

  const fileName = String(imageName).split("/").pop();

  const isInsidePagesFolder = window.location.pathname.includes("/assets/pages/");

  if (isInsidePagesFolder) {
    return `../images/shop-img/${fileName}`;
  }

  return `./assets/images/shop-img/${fileName}`;
}

function normalizeProduct(product) {
  return {
    id: Number(product.id),
    name: product.name || "",
    price: Number(product.price) || 0,
    oldPrice: product.old_price ? Number(product.old_price) : null,
    category: product.category || "",
    color: product.color || "",
    material: product.material || "",
    image: product.image || "",
    description: product.description || "",
    sale: Number(product.sale) === 1 || product.sale === true || product.sale === "1",
    images: Array.isArray(product.images) ? product.images : []
  };
}

/* -----------------------------
   Page State
----------------------------- */

function showProductNotFound() {
  if (productNotFound) productNotFound.classList.remove("hidden");
  if (productDetailsContent) productDetailsContent.classList.add("hidden");
}

function showProductContent() {
  if (productNotFound) productNotFound.classList.add("hidden");
  if (productDetailsContent) productDetailsContent.classList.remove("hidden");
}

function showLoadingState() {
  if (productNotFound) productNotFound.classList.add("hidden");
  if (productDetailsContent) productDetailsContent.classList.add("hidden");
}

/* -----------------------------
   Fetch Product Details
----------------------------- */

async function fetchProductDetails(productId) {
  try {
    showLoadingState();

    const response = await fetch(`${PRODUCT_DETAILS_API}?id=${productId}`);

    if (!response.ok) {
      throw new Error("Product could not be loaded.");
    }

    const data = await response.json();

    if (!data.success || !data.product) {
      throw new Error(data.message || "Product not found.");
    }

    selectedProduct = normalizeProduct(data.product);

    relatedProducts = Array.isArray(data.related_products)
      ? data.related_products.map(normalizeProduct)
      : [];

    window.products = [selectedProduct, ...relatedProducts];

    quantity = 1;

    showProductContent();
    renderProductDetails(selectedProduct);
    renderRelatedProducts();

  } catch (error) {
    console.error(error);
    showProductNotFound();
  }
}

/* -----------------------------
   Product Gallery
----------------------------- */

function getProductGallery(product) {
  if (!product) return [];

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  return [product.image];
}

function updateActiveThumbnail() {
  const thumbButtons = document.querySelectorAll(".product-thumb-btn");

  thumbButtons.forEach(button => {
    const buttonIndex = Number(button.dataset.index);

    if (buttonIndex === activeImageIndex) {
      button.classList.add("border-black");
      button.classList.remove("border-transparent");
    } else {
      button.classList.remove("border-black");
      button.classList.add("border-transparent");
    }
  });
}

function updateMainImage(index) {
  activeImageIndex = index;

  if (!productImage || productImages.length === 0) return;

  productImage.src = getProductImageSrc(productImages[activeImageIndex]);
  productImage.alt = selectedProduct.name;

  updateActiveThumbnail();
}

function setProductImages(product) {
  productImages = getProductGallery(product);
  activeImageIndex = 0;

  if (!productImage || !productThumbnails || productImages.length === 0) return;

  productImage.src = getProductImageSrc(productImages[0]);
  productImage.alt = product.name;

  const sideImages = productImages.slice(0, 5);

  productThumbnails.innerHTML = sideImages.map((image, index) => {
    return `
      <button
        type="button"
        class="product-thumb-btn w-[180px] h-[145px] bg-white overflow-hidden border border-transparent hover:border-black transition flex items-center justify-center"
        data-index="${index}">
        <img
          src="${getProductImageSrc(image)}"
          alt="${product.name}"
          class="w-full h-full object-cover object-center"
        >
      </button>
    `;
  }).join("");

  document.querySelectorAll(".product-thumb-btn").forEach(button => {
    button.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      updateMainImage(index);
    });
  });

  productImage.onclick = function () {
    openLightbox(activeImageIndex);
  };

  updateActiveThumbnail();
}

/* -----------------------------
   Lightbox
----------------------------- */

function openLightbox(index) {
  if (!productLightbox || productImages.length === 0) return;

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
  if (!lightboxImage || productImages.length === 0) return;

  lightboxImage.src = getProductImageSrc(productImages[activeImageIndex]);
  lightboxImage.alt = selectedProduct ? selectedProduct.name : "Product image";

  if (lightboxCounter) {
    lightboxCounter.textContent = `${activeImageIndex + 1}/${productImages.length}`;
  }

  updateActiveThumbnail();
}

function showNextImage() {
  if (productImages.length === 0) return;

  activeImageIndex++;

  if (activeImageIndex >= productImages.length) {
    activeImageIndex = 0;
  }

  updateMainImage(activeImageIndex);
  updateLightboxImage();
}

function showPrevImage() {
  if (productImages.length === 0) return;

  activeImageIndex--;

  if (activeImageIndex < 0) {
    activeImageIndex = productImages.length - 1;
  }

  updateMainImage(activeImageIndex);
  updateLightboxImage();
}

/* -----------------------------
   Product Details
----------------------------- */

function renderProductDetails(product) {
  document.title = `${product.name} | Homemade Ceramics`;

  setProductImages(product);

  if (productCategory) productCategory.textContent = product.category;
  if (productName) productName.textContent = product.name;
  if (productPrice) productPrice.textContent = formatPrice(product.price);
  if (productDescription) productDescription.textContent = product.description;

  if (productColor) productColor.textContent = capitalize(product.color);
  if (productMaterial) productMaterial.textContent = capitalize(product.material);

  if (productSku) productSku.textContent = `HC-${String(product.id).padStart(4, "0")}`;
  if (productCategoryBottom) productCategoryBottom.textContent = product.category;

  if (productQuantity) productQuantity.textContent = quantity;
}

/* -----------------------------
   Related Products
----------------------------- */

function renderRelatedProducts() {
  if (!relatedProductsContainer) return;

  if (relatedProducts.length === 0) {
    relatedProductsContainer.innerHTML = `
      <p class="col-span-full text-[#8a8a8a]">
        No related products found.
      </p>
    `;
    return;
  }

  relatedProductsContainer.innerHTML = relatedProducts.map(item => {
    const oldPriceHTML = item.oldPrice
      ? `<span class="line-through text-[#8a8a8a] mr-2">${formatPrice(item.oldPrice)}</span>`
      : "";

    const saleHTML = item.sale
      ? `<span class="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-[#b35b4b] bg-white px-3 py-1 z-20">Sale</span>`
      : "";

    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden bg-white">
          <a href="./product-details.html?id=${item.id}" class="block relative z-0">
            <img 
              src="${getProductImageSrc(item.image)}"
              alt="${item.name}"
              class="w-full aspect-square object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </a>

          ${saleHTML}

          <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

          <button
            type="button"
            onclick="handleRelatedWishlist(${item.id})"
            class="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white z-20">
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out z-10 pointer-events-none">

            <button 
              type="button"
              onclick="handleRelatedAddToCart(${item.id})"
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
            ${oldPriceHTML}${formatPrice(item.price)}
          </p>
        </div>

      </div>
    `;
  }).join("");
}

/* -----------------------------
   Cart / Wishlist
----------------------------- */

function getLocalCartFallback() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    return [];
  }
}

function saveLocalCartFallback(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addSelectedProductToCart() {
  if (!selectedProduct) return;

  let cart;

  if (typeof getCart === "function") {
    cart = getCart();
  } else {
    cart = getLocalCartFallback();
  }

  const existingProduct = cart.find(item => Number(item.id) === Number(selectedProduct.id));

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

  if (typeof saveCart === "function") {
    saveCart(cart);
  } else {
    saveLocalCartFallback(cart);
  }

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }

  if (typeof renderCartDropdown === "function") {
    renderCartDropdown();
  }

  if (typeof showToast === "function") {
    showToast(`${selectedProduct.name} added to cart`);
  }
}

function handleRelatedAddToCart(productId) {
  if (typeof addToCart === "function") {
    addToCart(productId);
    return;
  }

  const product = window.products.find(item => Number(item.id) === Number(productId));

  if (!product) return;

  let cart = getLocalCartFallback();

  const existingProduct = cart.find(item => Number(item.id) === Number(product.id));

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

  saveLocalCartFallback(cart);
}

function handleRelatedWishlist(productId) {
  if (typeof toggleWishlist === "function") {
    toggleWishlist(productId);
  }
}

/* -----------------------------
   Init
----------------------------- */

function initProductDetailsPage() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    showProductNotFound();
    return;
  }

  fetchProductDetails(productId);
}

/* -----------------------------
   Events
----------------------------- */

if (increaseQuantityBtn) {
  increaseQuantityBtn.addEventListener("click", function () {
    quantity += 1;
    if (productQuantity) productQuantity.textContent = quantity;
  });
}

if (decreaseQuantityBtn) {
  decreaseQuantityBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity -= 1;
      if (productQuantity) productQuantity.textContent = quantity;
    }
  });
}

if (addDetailsToCartBtn) {
  addDetailsToCartBtn.addEventListener("click", addSelectedProductToCart);
}

if (addDetailsToWishlistBtn) {
  addDetailsToWishlistBtn.addEventListener("click", function () {
    if (!selectedProduct) return;

    if (typeof toggleWishlist === "function") {
      toggleWishlist(selectedProduct.id);
    }
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