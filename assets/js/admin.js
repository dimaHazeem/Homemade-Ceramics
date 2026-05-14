const STORAGE_KEY = "homemadeCeramicsProducts";

let adminProducts = [];
let filteredProducts = [];

const productsList = document.getElementById("productsList");
const emptyState = document.getElementById("emptyState");

const totalProducts = document.getElementById("totalProducts");
const saleProducts = document.getElementById("saleProducts");
const totalCategories = document.getElementById("totalCategories");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const resetProductsBtn = document.getElementById("resetProductsBtn");
const paginationContainer = document.getElementById("paginationContainer");

let currentPage = 1;
const productsPerPage = 5;

function getDataProducts() {
    try {
        return products.map(product => ({ ...product }));
    } catch (error) {
        console.error("data.js products not found:", error);
        return [];
    }
}

function loadProducts() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
        adminProducts = JSON.parse(savedProducts);
    } else {
        adminProducts = getDataProducts();
        saveProducts();
    }

    filteredProducts = [...adminProducts];

    updateStats();
    fillCategoryFilter();
    renderProducts(filteredProducts);
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}

function getProductImageSrc(imageName) {
    if (!imageName) {
        return "../images/shop-img/product-16-550x550.jpg";
    }

    if (imageName.startsWith("data:image")) {
        return imageName;
    }

    const fileName = imageName.split("/").pop();
    return `../images/shop-img/${fileName}`;
}

function updateStats() {
    totalProducts.textContent = adminProducts.length;
    saleProducts.textContent = adminProducts.filter(product => product.sale).length;

    const categories = new Set(adminProducts.map(product => product.category));
    totalCategories.textContent = categories.size;
}

function fillCategoryFilter() {
    const currentValue = categoryFilter.value;
    const categories = [...new Set(adminProducts.map(product => product.category))];

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
    });

    if (categories.includes(currentValue)) {
        categoryFilter.value = currentValue;
    }
}

function renderProducts(productList) {
    productsList.innerHTML = "";

    if (productList.length === 0) {
        emptyState.classList.remove("hidden");
        paginationContainer.innerHTML = "";
        return;
    }

    emptyState.classList.add("hidden");

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = productList.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const card = document.createElement("article");

        card.className = "border border-[#ededed] bg-white p-8 md:p-10 mb-8";

        card.innerHTML = `
            <div style="
                display: grid;
                grid-template-columns: 260px 1fr 170px;
                gap: 40px;
                align-items: center;
            ">

                <!-- PRODUCT IMAGE -->
                <div class="bg-[#f8f8f8] flex items-center justify-center overflow-hidden"
                    style="width: 260px; height: 260px;">
                    <img 
                        src="${getProductImageSrc(product.image)}"
                        alt="${product.name}"
                        style="width: 100%; height: 100%; object-fit: cover;"
                    >
                </div>

                <!-- PRODUCT INFO -->
                <div class="max-w-[760px]">
                    <h3 class="text-[28px] font-medium mb-5 capitalize">
                        ${product.name}
                    </h3>

                    <p class="text-[17px] leading-[1.9] text-[#8a8a8a] mb-8 max-w-[680px]">
                        ${product.description || "No description available."}
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-[16px] max-w-[700px]">
                        <p>
                            <span class="font-semibold text-black">Category:</span>
                            <span class="text-[#8a8a8a]">${product.category || "-"}</span>
                        </p>

                        <p>
                            <span class="font-semibold text-black">Material:</span>
                            <span class="text-[#8a8a8a]">${product.material || "-"}</span>
                        </p>

                        <p>
                            <span class="font-semibold text-black">Color:</span>
                            <span class="text-[#8a8a8a]">${product.color || "-"}</span>
                        </p>

                        <p>
                            <span class="font-semibold text-black">Price:</span>
                            <span>$${Number(product.price).toFixed(2)}</span>
                            ${
                                product.oldPrice
                                    ? `<span class="text-[#8a8a8a] line-through ml-2">$${Number(product.oldPrice).toFixed(2)}</span>`
                                    : ""
                            }
                        </p>
                    </div>

                    <div class="mt-7">
                        ${
                            product.sale
                                ? `<span class="inline-block bg-[#ffe9e2] px-5 py-2 text-[11px] uppercase tracking-[0.2em]">Sale</span>`
                                : `<span class="text-[15px] text-[#8a8a8a]">Not on sale</span>`
                        }
                    </div>
                </div>

                <!-- ACTIONS -->
                <div style="display:flex; flex-direction:column; gap:16px; align-items:stretch;">
                    <button onclick="goToUpdate(${product.id})"
                        class="bg-[#ffe9e2] px-8 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition">
                        Update
                    </button>

                    <button onclick="deleteProduct(${product.id})"
                        class="border border-red-500 text-red-500 px-8 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-red-500 hover:text-white transition">
                        Delete
                    </button>
                </div>

            </div>
        `;

        productsList.appendChild(card);
    });

    renderPagination(productList.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / productsPerPage);

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.className = "px-4 py-2 hover:text-[#e2b7a8] transition disabled:opacity-40";
    prevBtn.disabled = currentPage === 1;

    prevBtn.addEventListener("click", function () {
        currentPage--;
        renderProducts(filteredProducts);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");

        pageBtn.textContent = i;
        pageBtn.className =
            i === currentPage
                ? "px-4 py-2 bg-[#ffe9e2]"
                : "px-4 py-2 hover:text-[#e2b7a8] transition";

        pageBtn.addEventListener("click", function () {
            currentPage = i;
            renderProducts(filteredProducts);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.className = "px-4 py-2 hover:text-[#e2b7a8] transition disabled:opacity-40";
    nextBtn.disabled = currentPage === totalPages;

    nextBtn.addEventListener("click", function () {
        currentPage++;
        renderProducts(filteredProducts);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    paginationContainer.appendChild(nextBtn);
}

function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;
    const sortValue = sortSelect.value;

    filteredProducts = adminProducts.filter(product => {
        const name = (product.name || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const material = (product.material || "").toLowerCase();
        const color = (product.color || "").toLowerCase();
        const description = (product.description || "").toLowerCase();

        const matchesSearch =
            name.includes(searchValue) ||
            category.includes(searchValue) ||
            material.includes(searchValue) ||
            color.includes(searchValue) ||
            description.includes(searchValue);

        const matchesCategory =
            categoryValue === "all" || product.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    if (sortValue === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    currentPage = 1;
renderProducts(filteredProducts);
}

function goToUpdate(productId) {
    window.location.href = `./admin-form.html?id=${productId}`;
}

function deleteProduct(productId) {
    const product = adminProducts.find(product => Number(product.id) === Number(productId));

    if (!product) return;

    const confirmDelete = confirm(`Delete "${product.name}"?`);

    if (!confirmDelete) return;

    adminProducts = adminProducts.filter(product => Number(product.id) !== Number(productId));

    saveProducts();
    loadProducts();
}

function resetProducts() {
    const confirmReset = confirm("Reset products to original data.js? This will remove admin changes.");

    if (!confirmReset) return;

    localStorage.removeItem(STORAGE_KEY);
    loadProducts();
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
resetProductsBtn.addEventListener("click", resetProducts);

loadProducts();