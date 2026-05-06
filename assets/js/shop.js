const productsContainer = document.querySelector("#productsContainer");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultsText = document.querySelector("#resultsText");
const paginationContainer = document.querySelector("#paginationContainer");
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");

const productsPerPage = 12;
let currentPage = 1;
let selectedColor = "all";
let selectedMaterial = "all";
let currentProducts = [...products];

function getFilteredProducts() {
  let filtered = [...products];

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

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
      <p class="col-span-full text-center text-[#6f6f6f] uppercase tracking-[0.15em]">
        No products found
      </p>
    `;
    return;
  }

  productsContainer.innerHTML = paginatedProducts.map(product => {
    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden">

          <a href="./product-details.html?id=${product.id}">
            <img 
              src="${product.image}"
              alt="${product.name}"
              class="w-full aspect-square object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </a>

          <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>

          <button
            onclick="toggleWishlist(${product.id})"
            class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white"
            title="Add to wishlist"
          >
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out">

            <button 
              onclick="addToCart(${product.id})"
              class="bg-[#ffe9e2] h-[54px] border border-transparent text-[11px] uppercase tracking-[0.18em] px-12 py-2 hover:bg-black hover:text-white transition duration-300">
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
            $${product.price}
          </p>
        </div>

      </div>
    `;
  }).join("");
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

function updateShop() {
  currentProducts = getFilteredProducts();

  const totalPages = Math.ceil(currentProducts.length / productsPerPage);

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  renderProducts(currentProducts);
  renderResultsText(currentProducts);
  renderPagination(currentProducts);
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

document.querySelectorAll(".filter-color").forEach(item => {
  item.addEventListener("click", function () {
    selectedColor = this.dataset.color;
    currentPage = 1;
    updateShop();
  });
});

document.querySelectorAll(".filter-material").forEach(item => {
  item.addEventListener("click", function () {
    selectedMaterial = this.dataset.material;
    currentPage = 1;
    updateShop();
  });
});

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", function () {
    selectedColor = "all";
    selectedMaterial = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "default";
    }

    currentPage = 1;
    updateShop();
  });
}

updateShop();