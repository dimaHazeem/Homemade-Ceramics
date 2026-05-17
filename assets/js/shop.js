const productsContainer = document.querySelector("#productsContainer");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultsText = document.querySelector("#resultsText");
const paginationContainer = document.querySelector("#paginationContainer");

const colorFilters = document.querySelector("#colorFilters");
const materialFilters = document.querySelector("#materialFilters");
const resetColorBtn = document.querySelector("#resetColorBtn");
const resetMaterialBtn = document.querySelector("#resetMaterialBtn");

const minPriceRange = document.querySelector("#minPriceRange");
const maxPriceRange = document.querySelector("#maxPriceRange");
const priceTrack = document.querySelector("#priceTrack");
const priceText = document.querySelector("#priceText");
const applyFiltersBtn = document.querySelector("#applyFiltersBtn");
const resetFiltersBtn = document.querySelector("#resetFiltersBtn");
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");

const productsPerPage = 12;

let products = [];
let currentProducts = [];

let currentPage = 1;
let selectedColor = "all";
let selectedMaterial = "all";

let defaultMinPrice = 0;
let defaultMaxPrice = 500;

let minPrice = defaultMinPrice;
let maxPrice = defaultMaxPrice;

/* -----------------------------
   Path Helpers
----------------------------- */

function isInsidePagesFolder() {
  return window.location.pathname.includes("/assets/pages/");
}

function getApiPath(fileName) {
  if (isInsidePagesFolder()) {
    return `../../backend/api/${fileName}`;
  }

  return `./backend/api/${fileName}`;
}

function getProductImageSrc(imageName) {
  if (!imageName) return "";

  const fileName = String(imageName).split("/").pop();

  if (isInsidePagesFolder()) {
    return `../images/shop-img/${fileName}`;
  }

  return `./assets/images/shop-img/${fileName}`;
}

function getProductDetailsPath(productId) {
  if (isInsidePagesFolder()) {
    return `./product-details.html?id=${productId}`;
  }

  return `./assets/pages/product-details.html?id=${productId}`;
}

const PRODUCTS_API = getApiPath("products.php");

/* -----------------------------
   General Helpers
----------------------------- */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizeProduct(product) {
  return {
    id: Number(product.id),
    name: product.name || "",
    price: Number(product.price) || 0,
    oldPrice: product.old_price !== null && product.old_price !== undefined
      ? Number(product.old_price)
      : null,
    category: product.category || "",
    color: product.color || "",
    material: product.material || "",
    image: product.image || "",
    description: product.description || "",
    sale: Number(product.sale) === 1 || product.sale === true || product.sale === "1"
  };
}

function showShopMessage(message) {
  if (!productsContainer) return;

  productsContainer.innerHTML = `
    <div class="col-span-full border border-[#ededed] px-8 py-8 text-center">
      <p class="text-[16px] text-[#8a8a8a] normal-case tracking-normal">
        ${message}
      </p>
    </div>
  `;
}

/* -----------------------------
   Fetch Products From Backend
----------------------------- */

async function fetchProducts() {
  try {
    showShopMessage("Loading products...");

    const response = await fetch(PRODUCTS_API, {
      cache: "no-store"
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Backend response:", text);
      throw new Error(`Products API failed with status ${response.status}`);
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Backend did not return JSON. It returned:", text);
      throw new Error("Invalid JSON from products.php");
    }

    if (!Array.isArray(data)) {
      console.error("Expected array, received:", data);
      throw new Error("products.php must return an array");
    }

    products = data.map(normalizeProduct);

    window.products = products;

    setupPriceDefaults();

    currentProducts = [...products];

    updateShop();

  } catch (error) {
    console.error("Products API path:", PRODUCTS_API);
    console.error(error);

    products = [];
    window.products = [];

    showShopMessage("Products could not be loaded. Check backend/api/products.php and database connection.");

    if (resultsText) {
      resultsText.textContent = "Showing 0 results";
    }

    if (paginationContainer) {
      paginationContainer.innerHTML = "";
    }
  }
}

/* -----------------------------
   Price Defaults
----------------------------- */

function setupPriceDefaults() {
  if (products.length === 0) {
    defaultMinPrice = 0;
    defaultMaxPrice = 500;
  } else {
    const prices = products.map(product => Number(product.price));

    defaultMinPrice = Math.floor(Math.min(...prices));
    defaultMaxPrice = Math.ceil(Math.max(...prices));

    if (defaultMinPrice === defaultMaxPrice) {
      defaultMaxPrice = defaultMinPrice + 1;
    }
  }

  minPrice = defaultMinPrice;
  maxPrice = defaultMaxPrice;

  if (minPriceRange) {
    minPriceRange.min = defaultMinPrice;
    minPriceRange.max = defaultMaxPrice;
    minPriceRange.value = defaultMinPrice;
  }

  if (maxPriceRange) {
    maxPriceRange.min = defaultMinPrice;
    maxPriceRange.max = defaultMaxPrice;
    maxPriceRange.value = defaultMaxPrice;
  }

  updatePriceUI();
}

/* -----------------------------
   Filtering / Sorting
----------------------------- */

function getFilteredProducts() {
  let filtered = [...products];

  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

  if (searchValue !== "") {
    filtered = filtered.filter(product => {
      return (
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.color.toLowerCase().includes(searchValue) ||
        product.material.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue)
      );
    });
  }

  if (selectedColor !== "all") {
    filtered = filtered.filter(product => product.color === selectedColor);
  }

  if (selectedMaterial !== "all") {
    filtered = filtered.filter(product => product.material === selectedMaterial);
  }

  filtered = filtered.filter(product => {
    return Number(product.price) >= minPrice && Number(product.price) <= maxPrice;
  });

  if (sortSelect) {
    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortValue === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortValue === "latest") {
      filtered.sort((a, b) => Number(b.id) - Number(a.id));
    }
  }

  return filtered;
}

/* -----------------------------
   Render Products
----------------------------- */

function renderProducts(productsList) {
  if (!productsContainer) return;

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;

  const paginatedProducts = productsList.slice(start, end);

  if (paginatedProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-span-full border border-[#ededed] px-8 py-8 text-right">
        <p class="text-[18px] text-[#8a8a8a] normal-case tracking-normal">
          No products were found matching your selection.
        </p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = paginatedProducts.map(product => {
    const oldPriceHTML = product.oldPrice
      ? `<span class="line-through text-[#8a8a8a] mr-2">${formatPrice(product.oldPrice)}</span>`
      : "";

    const saleHTML = product.sale
      ? `<span class="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-[#b35b4b] bg-white px-3 py-1 z-20">Sale</span>`
      : "";

    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden">

          <a href="${getProductDetailsPath(product.id)}" class="block relative z-0">
            <img 
              src="${getProductImageSrc(product.image)}"
              alt="${product.name}"
              class="w-full aspect-square object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </a>

          ${saleHTML}

          <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

          <button
            type="button"
            data-wishlist-id="${product.id}"
            class="wishlist-btn absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white z-20"
            title="Add to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out z-10 pointer-events-none">

            <button 
              type="button"
              onclick="handleAddToCartFromShop(${product.id})"
              class="pointer-events-auto bg-[#ffe9e2] h-[54px] border border-transparent text-[11px] uppercase tracking-[0.18em] px-12 py-2 hover:bg-black hover:text-white transition duration-300">
              Add to cart
            </button>

          </div>
        </div>

        <div class="pt-5">
          <a href="${getProductDetailsPath(product.id)}">
            <h3 class="text-[13px] uppercase tracking-[0.15em] mb-2 hover:text-[#e2b7a8] transition">
              ${product.name}
            </h3>
          </a>

          <p class="text-[13px] text-[#6f6f6f]">
            ${oldPriceHTML}${formatPrice(product.price)}
          </p>
        </div>

      </div>
    `;
  }).join("");

  connectWishlistButtons();
}

/* -----------------------------
   Cart / Wishlist
----------------------------- */

function handleAddToCartFromShop(productId) {
  if (typeof addToCart === "function") {
    addToCart(productId);
    return;
  }

  const product = products.find(item => Number(item.id) === Number(productId));

  if (!product) return;

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    cart = [];
  }

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

  localStorage.setItem("cart", JSON.stringify(cart));
}

function connectWishlistButtons() {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");

  wishlistButtons.forEach(button => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const productId = Number(this.dataset.wishlistId);

      if (typeof toggleWishlist === "function") {
        toggleWishlist(productId);
      } else {
        console.warn("toggleWishlist function was not found. Make sure wishlist.js is loaded before shop.js.");
      }
    });
  });
}

/* -----------------------------
   Results Text / Pagination
----------------------------- */

function renderResultsText(productsList) {
  if (!resultsText) return;

  const total = productsList.length;

  if (total === 0) {
    resultsText.textContent = "Showing 0 results";
    return;
  }

  const start = (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, total);

  resultsText.textContent = `Showing ${start}–${end} of ${total} results`;
}

function renderPagination(productsList) {
  if (!paginationContainer) return;

  const totalPages = Math.ceil(productsList.length / productsPerPage);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <button type="button" class="relative text-black">
          ${i}
          <span class="absolute left-0 -bottom-2 w-full h-[1px] bg-black"></span>
        </button>
      `;
    } else {
      paginationHTML += `
        <button 
          type="button"
          onclick="goToPage(${i})"
          class="text-[#6f6f6f] hover:text-black cursor-pointer transition">
          ${i}
        </button>
      `;
    }
  }

  if (currentPage < totalPages) {
    paginationHTML += `
      <button 
        type="button"
        onclick="goToPage(${currentPage + 1})"
        class="ml-4 text-[#6f6f6f] hover:text-black cursor-pointer transition">
        →
      </button>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;
}

function goToPage(pageNumber) {
  currentPage = pageNumber;
  updateShop();

  window.scrollTo({
    top: 500,
    behavior: "smooth"
  });
}

window.goToPage = goToPage;

/* -----------------------------
   Sidebar Counts
----------------------------- */

function getCounts(key) {
  const counts = {};

  products.forEach(product => {
    const value = product[key];

    if (!value) return;

    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const matchesSearch =
      searchValue === "" ||
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue) ||
      product.color.toLowerCase().includes(searchValue) ||
      product.material.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue);

    const matchesPrice =
      Number(product.price) >= minPrice && Number(product.price) <= maxPrice;

    const matchesOtherColor =
      key === "color" || selectedColor === "all" || product.color === selectedColor;

    const matchesOtherMaterial =
      key === "material" || selectedMaterial === "all" || product.material === selectedMaterial;

    if (matchesSearch && matchesPrice && matchesOtherColor && matchesOtherMaterial) {
      if (!counts[value]) {
        counts[value] = 0;
      }

      counts[value]++;
    }
  });

  return counts;
}

function renderSidebarFilters() {
  if (!colorFilters || !materialFilters) return;

  const colorCounts = getCounts("color");
  const materialCounts = getCounts("material");

  const colorOrder = ["beige", "black", "blue", "brown", "gold", "green", "purple", "red", "white", "pink"];
  const materialOrder = ["ceramic", "chrome", "metal", "steel", "wood", "glass", "porcelain"];

  const colorsToShow = colorOrder.filter(color => colorCounts[color] !== undefined);
  const materialsToShow = materialOrder.filter(material => materialCounts[material] !== undefined);

  colorFilters.innerHTML = colorsToShow.map(color => {
    return `
      <li 
        class="cursor-pointer transition ${selectedColor === color ? "text-black" : "text-[#8a8a8a] hover:text-black"}"
        onclick="selectColor('${color}')">
        ${capitalize(color)} (${colorCounts[color]})
      </li>
    `;
  }).join("");

  materialFilters.innerHTML = materialsToShow.map(material => {
    return `
      <li 
        class="cursor-pointer transition ${selectedMaterial === material ? "text-black" : "text-[#8a8a8a] hover:text-black"}"
        onclick="selectMaterial('${material}')">
        ${capitalize(material)} (${materialCounts[material]})
      </li>
    `;
  }).join("");

  if (resetColorBtn) {
    if (selectedColor !== "all") {
      resetColorBtn.classList.remove("hidden");
    } else {
      resetColorBtn.classList.add("hidden");
    }
  }

  if (resetMaterialBtn) {
    if (selectedMaterial !== "all") {
      resetMaterialBtn.classList.remove("hidden");
    } else {
      resetMaterialBtn.classList.add("hidden");
    }
  }
}

function selectColor(color) {
  selectedColor = color;
  currentPage = 1;
  updateShop();
}

function selectMaterial(material) {
  selectedMaterial = material;
  currentPage = 1;
  updateShop();
}

window.selectColor = selectColor;
window.selectMaterial = selectMaterial;

/* -----------------------------
   Price UI
----------------------------- */

function updatePriceUI(activeInput = null) {
  if (!minPriceRange || !maxPriceRange || !priceText || !priceTrack) return;

  let minValue = Number(minPriceRange.value);
  let maxValue = Number(maxPriceRange.value);

  if (minValue >= maxValue) {
    if (activeInput === minPriceRange) {
      minValue = maxValue - 1;
      minPriceRange.value = minValue;
    } else {
      maxValue = minValue + 1;
      maxPriceRange.value = maxValue;
    }
  }

  priceText.textContent = `$${minValue} — $${maxValue}`;

  const minLimit = Number(minPriceRange.min);
  const maxLimit = Number(maxPriceRange.max);

  if (maxLimit === minLimit) {
    priceTrack.style.left = "0%";
    priceTrack.style.right = "0%";
  } else {
    const leftPercent = ((minValue - minLimit) / (maxLimit - minLimit)) * 100;
    const rightPercent = ((maxValue - minLimit) / (maxLimit - minLimit)) * 100;

    priceTrack.style.left = `${leftPercent}%`;
    priceTrack.style.right = `${100 - rightPercent}%`;
  }

  const searchHasValue = searchInput && searchInput.value.trim() !== "";
  const priceIsDefault = minValue === defaultMinPrice && maxValue === defaultMaxPrice;

  if (resetFiltersBtn) {
    if (
      !priceIsDefault ||
      selectedColor !== "all" ||
      selectedMaterial !== "all" ||
      searchHasValue
    ) {
      resetFiltersBtn.classList.remove("hidden");
    } else {
      resetFiltersBtn.classList.add("hidden");
    }
  }
}

/* -----------------------------
   Reset Filters
----------------------------- */

function resetAllFilters() {
  selectedColor = "all";
  selectedMaterial = "all";

  minPrice = defaultMinPrice;
  maxPrice = defaultMaxPrice;

  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "default";

  if (minPriceRange) minPriceRange.value = defaultMinPrice;
  if (maxPriceRange) maxPriceRange.value = defaultMaxPrice;

  currentPage = 1;

  updateShop();
  updatePriceUI();
}

/* -----------------------------
   Events
----------------------------- */

if (resetColorBtn) {
  resetColorBtn.addEventListener("click", function () {
    selectedColor = "all";
    currentPage = 1;
    updateShop();
  });
}

if (resetMaterialBtn) {
  resetMaterialBtn.addEventListener("click", function () {
    selectedMaterial = "all";
    currentPage = 1;
    updateShop();
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", function () {
    resetAllFilters();

    if (typeof showFilterToast === "function") {
      showFilterToast("Filters cleared");
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    currentPage = 1;
    updateShop();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    currentPage = 1;
    updateShop();
  });
}

if (minPriceRange && maxPriceRange) {
  minPriceRange.addEventListener("input", function () {
    updatePriceUI(minPriceRange);
  });

  maxPriceRange.addEventListener("input", function () {
    updatePriceUI(maxPriceRange);
  });
}

if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener("click", function () {
    minPrice = Number(minPriceRange.value);
    maxPrice = Number(maxPriceRange.value);

    currentPage = 1;
    updateShop();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", function () {
    resetAllFilters();
  });
}

/* -----------------------------
   Main Update
----------------------------- */

function updateShop() {
  currentProducts = getFilteredProducts();

  const totalPages = Math.ceil(currentProducts.length / productsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = 1;
  }

  renderProducts(currentProducts);
  renderResultsText(currentProducts);
  renderPagination(currentProducts);
  renderSidebarFilters();
  updatePriceUI();
}

/* -----------------------------
   Init
----------------------------- */

function initShopPage() {
  fetchProducts();
}

initShopPage();