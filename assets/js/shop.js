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

let currentPage = 1;
let selectedColor = "all";
let selectedMaterial = "all";

let minPrice = 60;
let maxPrice = 460;

let currentProducts = [...products];

function getFilteredProducts() {
  let filtered = [...products];

  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

  if (searchValue !== "") {
    filtered = filtered.filter(product => {
      return (
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.color.toLowerCase().includes(searchValue) ||
        product.material.toLowerCase().includes(searchValue)
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
    return product.price >= minPrice && product.price <= maxPrice;
  });

  if (sortSelect) {
    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "latest") {
      filtered.sort((a, b) => b.id - a.id);
    }
  }

  return filtered;
}

function renderProducts(productsList) {
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
      ? `<span class="line-through text-[#8a8a8a] mr-2">$${product.oldPrice}.00</span>`
      : "";

    const saleHTML = product.sale
      ? `<span class="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-[#b35b4b] bg-white px-3 py-1 z-20">Sale</span>`
      : "";

    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden">

          <a href="./product-details.html?id=${product.id}" class="block relative z-0">
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
              title="Add to wishlist"
            >
          <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out z-10 pointer-events-none">

            <button 
              onclick="addToCart(${product.id})"
              class="pointer-events-auto bg-[#ffe9e2] h-[54px] border border-transparent text-[11px] uppercase tracking-[0.18em] px-12 py-2 hover:bg-black hover:text-white transition duration-300">
              Add to cart
            </button>

          </div>
        </div>

        <div class="pt-5">
          <a href="./product-details.html?id=${product.id}">
            <h3 class="text-[13px] uppercase tracking-[0.15em] mb-2 hover:text-[#e2b7a8] transition">
              ${product.name}
            </h3>
          </a>

          <p class="text-[13px] text-[#6f6f6f]">
            ${oldPriceHTML}$${product.price}.00
          </p>
        </div>

      </div>
    `;
  }).join("");
  connectWishlistButtons();
}

function connectWishlistButtons() {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");

  wishlistButtons.forEach(button => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const productId = Number(this.dataset.wishlistId);
      toggleWishlist(productId);
    });
  });
}

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
        <button class="relative text-black">
          ${i}
          <span class="absolute left-0 -bottom-2 w-full h-[1px] bg-black"></span>
        </button>
      `;
    } else {
      paginationHTML += `
        <button 
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

function getCounts(key) {
  const counts = {};

  products.forEach(product => {
    const value = product[key];

    if (!value) return;

    if (!counts[value]) {
      counts[value] = 0;
    }

    const matchesSearch =
      !searchInput ||
      searchInput.value.trim() === "" ||
      product.name.toLowerCase().includes(searchInput.value.toLowerCase().trim()) ||
      product.category.toLowerCase().includes(searchInput.value.toLowerCase().trim()) ||
      product.color.toLowerCase().includes(searchInput.value.toLowerCase().trim()) ||
      product.material.toLowerCase().includes(searchInput.value.toLowerCase().trim());

    const matchesPrice =
      product.price >= minPrice && product.price <= maxPrice;

    const matchesOtherColor =
      key === "color" || selectedColor === "all" || product.color === selectedColor;

    const matchesOtherMaterial =
      key === "material" || selectedMaterial === "all" || product.material === selectedMaterial;

    if (matchesSearch && matchesPrice && matchesOtherColor && matchesOtherMaterial) {
      counts[value]++;
    }
  });

  return counts;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
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
        class="cursor-pointer transition ${selectedColor === color ? 'text-black' : 'text-[#8a8a8a] hover:text-black'}"
        onclick="selectColor('${color}')">
        ${capitalize(color)} (${colorCounts[color]})
      </li>
    `;
  }).join("");

  materialFilters.innerHTML = materialsToShow.map(material => {
    return `
      <li 
        class="cursor-pointer transition ${selectedMaterial === material ? 'text-black' : 'text-[#8a8a8a] hover:text-black'}"
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

  const leftPercent = ((minValue - minLimit) / (maxLimit - minLimit)) * 100;
  const rightPercent = ((maxValue - minLimit) / (maxLimit - minLimit)) * 100;

  priceTrack.style.left = `${leftPercent}%`;
  priceTrack.style.right = `${100 - rightPercent}%`;

  const searchHasValue = searchInput && searchInput.value.trim() !== "";
  const priceIsDefault = minValue === 60 && maxValue === 460;

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
    selectedColor = "all";
    selectedMaterial = "all";

    minPrice = 60;
    maxPrice = 460;

    if (minPriceRange) {
      minPriceRange.value = 60;
    }

    if (maxPriceRange) {
      maxPriceRange.value = 460;
    }

    if (searchInput) {
      searchInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "default";
    }

    currentPage = 1;

    updateShop();
    updatePriceUI();

    showFilterToast("Filters cleared");
  });
}

function updateShop() {
  currentProducts = getFilteredProducts();

  const totalPages = Math.ceil(currentProducts.length / productsPerPage);

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  renderProducts(currentProducts);
  renderResultsText(currentProducts);
  renderPagination(currentProducts);
  renderSidebarFilters();
  updatePriceUI();
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
    selectedColor = "all";
    selectedMaterial = "all";

    minPrice = 60;
    maxPrice = 460;

    if (searchInput) {
      searchInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "default";
    }

    if (minPriceRange) {
      minPriceRange.value = 60;
    }

    if (maxPriceRange) {
      maxPriceRange.value = 460;
    }

    currentPage = 1;
    updateShop();
  });
}

updateShop();