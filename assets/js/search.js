const openSearchBtn = document.querySelector("#openSearchBtn");
const searchDropdown = document.querySelector("#searchDropdown");
const globalSearchInput = document.querySelector("#globalSearchInput");
const globalSearchResults = document.querySelector("#globalSearchResults");

function getProductDetailsPath(productId) {
  const isInsidePagesFolder = window.location.pathname.includes("/assets/pages/");

  if (isInsidePagesFolder) {
    return `./product-details.html?id=${productId}`;
  }

  return `./assets/pages/product-details.html?id=${productId}`;
}

function openSearchDropdown() {
  if (!searchDropdown) return;

  searchDropdown.classList.toggle("hidden");

  if (!searchDropdown.classList.contains("hidden")) {
    globalSearchInput.focus();
  }
}

function closeSearchDropdown() {
  if (!searchDropdown) return;
  searchDropdown.classList.add("hidden");
}

function renderSearchResults(searchValue) {
  if (!globalSearchResults) return;

  const value = searchValue.toLowerCase().trim();

  if (value === "") {
    globalSearchResults.innerHTML = `
      <p class="text-[14px] text-[#8a8a8a] normal-case tracking-normal">
        Start typing to search products.
      </p>
    `;
    return;
  }

  const results = products.filter(product => {
    return (
      product.name.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value) ||
      product.color.toLowerCase().includes(value) ||
      product.material.toLowerCase().includes(value)
    );
  });

  if (results.length === 0) {
    globalSearchResults.innerHTML = `
      <p class="text-[14px] text-[#8a8a8a] normal-case tracking-normal">
        No products were found.
      </p>
    `;
    return;
  }

  const topResults = [...results]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  globalSearchResults.innerHTML = `
    <div class="space-y-5">
      ${topResults.map(product => {
        return `
          <a 
            href="${getProductDetailsPath(product.id)}"
            class="flex items-center gap-5 group/item">

            <img 
              src="${getProductImageSrc(product.image)}"
              alt="${product.name}"
              class="w-[78px] h-[78px] object-cover bg-[#f8f8f8]">

            <div class="flex-1">
              <h3 class="text-[14px] uppercase tracking-[0.16em] group-hover/item:text-[#e2b7a8] transition">
                ${product.name}
              </h3>

              <p class="mt-2 text-[14px] text-[#8a8a8a] normal-case tracking-normal">
                $${Number(product.price).toFixed(2)}
              </p>
            </div>
          </a>
        `;
      }).join("")}
    </div>

    <a 
      href="${getSearchPagePath(value)}"
      class="block mt-7 bg-[#ffe9e2] py-4 text-center text-[11px] uppercase tracking-[0.28em] hover:bg-black hover:text-white transition">
      View More Results (${results.length})
    </a>
  `;
}

function getSearchPagePath(query) {
  const isInsidePagesFolder = window.location.pathname.includes("/assets/pages/");
  const encodedQuery = encodeURIComponent(query);

  if (isInsidePagesFolder) {
    return `./search.html?q=${encodedQuery}`;
  }

  return `./assets/pages/search.html?q=${encodedQuery}`;
}

if (openSearchBtn) {
  openSearchBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    openSearchDropdown();
  });
}

if (globalSearchInput) {
  globalSearchInput.addEventListener("input", function () {
    renderSearchResults(globalSearchInput.value);
  });
}

document.addEventListener("click", function (event) {
  if (
    searchDropdown &&
    !searchDropdown.contains(event.target) &&
    !openSearchBtn.contains(event.target)
  ) {
    closeSearchDropdown();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeSearchDropdown();
  }
});

renderSearchResults("");