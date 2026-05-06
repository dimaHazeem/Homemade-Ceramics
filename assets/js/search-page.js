const searchPageInput = document.querySelector("#searchPageInput");
const searchPageResults = document.querySelector("#searchPageResults");
const searchResultsText = document.querySelector("#searchResultsText");

function getSearchQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

function searchProducts(query) {
  const value = query.toLowerCase().trim();

  if (value === "") {
    return [];
  }

  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value) ||
      product.color.toLowerCase().includes(value) ||
      product.material.toLowerCase().includes(value)
    );
  });
}

function renderSearchPageResults(query) {
  const results = searchProducts(query);

  if (query.trim() === "") {
    searchResultsText.textContent = "Start typing to search products";
    searchPageResults.innerHTML = "";
    return;
  }

  searchResultsText.textContent = `Showing ${results.length} result(s) for "${query}"`;

  if (results.length === 0) {
    searchPageResults.innerHTML = `
      <div class="col-span-full border border-[#ededed] px-8 py-8 text-right">
        <p class="text-[18px] text-[#8a8a8a] normal-case tracking-normal">
          No products were found matching your search.
        </p>
      </div>
    `;
    return;
  }

  searchPageResults.innerHTML = results.map(product => {
    return `
      <div class="group text-center max-w-[300px] mx-auto">

        <div class="relative overflow-hidden">
          <a href="./product-details.html?id=${product.id}">
            <img 
              src="${getProductImageSrc(product.image)}"
              alt="${product.name}"
              class="w-full aspect-square object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </a>

          <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>

          <button
            type="button"
            onclick="toggleWishlist(${product.id})"
            class="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white z-20">
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="absolute inset-0 flex items-center justify-center 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-500 ease-out z-10">

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
            $${Number(product.price).toFixed(2)}
          </p>
        </div>

      </div>
    `;
  }).join("");
}

const initialQuery = getSearchQueryFromUrl();

if (searchPageInput) {
  searchPageInput.value = initialQuery;
  renderSearchPageResults(initialQuery);

  searchPageInput.addEventListener("input", function () {
    const query = searchPageInput.value;

    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
    window.history.replaceState(null, "", newUrl);

    renderSearchPageResults(query);
  });
}