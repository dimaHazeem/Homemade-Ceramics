const STORAGE_KEY = "homemadeCeramicsProducts";
const MAX_GALLERY_IMAGES = 4;

const form = document.getElementById("productForm");
const pageTitle = document.getElementById("pageTitle");

const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const oldPriceInput = document.getElementById("oldPrice");
const colorInput = document.getElementById("color");
const materialInput = document.getElementById("material");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const saleInput = document.getElementById("sale");

const mainImagePreview = document.getElementById("mainImagePreview");
const galleryPreview = document.getElementById("galleryPreview");
const addGalleryBtn = document.getElementById("addGalleryBtn");
const galleryCountText = document.getElementById("galleryCountText");

let adminProducts = [];
let editingId = null;
let currentMainImage = "";
let currentGalleryImages = [];

/* ---------- DATA ---------- */

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
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}

function getNextId() {
    if (adminProducts.length === 0) return 1;

    const ids = adminProducts.map(product => Number(product.id));
    return Math.max(...ids) + 1;
}

/* ---------- IMAGES ---------- */

function isUploadedImage(image) {
    return image && image.startsWith("data:image");
}

function getProductImageSrc(imageName) {
    if (!imageName) {
        return "../images/shop-img/product-16-550x550.jpg";
    }

    if (isUploadedImage(imageName)) {
        return imageName;
    }

    const fileName = imageName.split("/").pop();
    return `../images/shop-img/${fileName}`;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

function splitProductImages(product) {
    const mainImage = product.image || product.images?.[0] || "";

    const galleryImages = (product.images || [])
        .filter(image => image !== mainImage)
        .slice(0, MAX_GALLERY_IMAGES);

    return {
        mainImage,
        galleryImages
    };
}

/* ---------- PREVIEWS ---------- */

function showMainImagePreview(image) {
    if (!image) {
        mainImagePreview.innerHTML = "";
        return;
    }

    mainImagePreview.innerHTML = `
        <div class="border border-[#ededed] bg-[#fafafa] p-4 w-[220px]">
            <img src="${getProductImageSrc(image)}"
                 alt="Main image preview"
                 class="w-full h-[200px] object-cover">

            <p class="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#8a8a8a]">
                Main Image
            </p>
        </div>
    `;
}

function updateGalleryCount() {
    galleryCountText.textContent =
        `${currentGalleryImages.length} / ${MAX_GALLERY_IMAGES} gallery images selected.`;

    if (currentGalleryImages.length >= MAX_GALLERY_IMAGES) {
        addGalleryBtn.disabled = true;
        addGalleryBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
        addGalleryBtn.disabled = false;
        addGalleryBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
}

function showGalleryPreview(images) {
    galleryPreview.innerHTML = "";

    if (!images || images.length === 0) {
        galleryPreview.innerHTML = `
            <p class="text-[13px] text-[#776d64] md:col-span-2 lg:col-span-4">
                No gallery images selected yet.
            </p>
        `;

        updateGalleryCount();
        return;
    }

    images.forEach((image, index) => {
        const div = document.createElement("div");

        div.className =
            "relative border border-[#ddcfc2] bg-white/70 rounded-[22px] p-4 shadow-sm overflow-hidden";

        div.innerHTML = `
            <button type="button"
                onclick="removeGalleryImage(${index})"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-[#ddcfc2] text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition z-10"
                aria-label="Remove gallery image">
                <i class="fa-solid fa-xmark text-[12px]"></i>
            </button>

            <div class="w-full h-[125px] bg-[#f8f1e8] rounded-[16px] overflow-hidden">
                <img src="${getProductImageSrc(image)}"
                    alt="Gallery image ${index + 1}"
                    class="w-full h-full object-cover">
            </div>

            <p class="mt-4 font-[Poppins] text-[10px] uppercase tracking-[0.18em] text-[#a66c4f] font-bold">
                Gallery Image ${index + 1}
            </p>
        `;

        galleryPreview.appendChild(div);
    });

    updateGalleryCount();
}

function removeGalleryImage(index) {
    currentGalleryImages.splice(index, 1);
    showGalleryPreview(currentGalleryImages);
}

function addGalleryImage() {
    if (currentGalleryImages.length >= MAX_GALLERY_IMAGES) {
        alert("You can add maximum 4 gallery images.");
        return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.className = "hidden";

    input.addEventListener("change", async function () {
        if (input.files.length === 0) {
            input.remove();
            return;
        }

        const image = await fileToBase64(input.files[0]);

        currentGalleryImages.push(image);
        showGalleryPreview(currentGalleryImages);

        input.remove();
    });

    document.body.appendChild(input);
    input.click();
}

/* ---------- FORM ---------- */

function fillForm(product) {
    const separatedImages = splitProductImages(product);

    productIdInput.value = product.id;
    nameInput.value = product.name || "";
    categoryInput.value = product.category || "";
    priceInput.value = product.price || "";
    oldPriceInput.value = product.oldPrice || "";
    colorInput.value = product.color || "";
    materialInput.value = product.material || "";
    descriptionInput.value = product.description || "";
    saleInput.checked = Boolean(product.sale);

    currentMainImage = separatedImages.mainImage;
    currentGalleryImages = separatedImages.galleryImages;

    showMainImagePreview(currentMainImage);
    showGalleryPreview(currentGalleryImages);
}

function setupPage() {
    loadProducts();

    const params = new URLSearchParams(window.location.search);
    editingId = params.get("id") ? Number(params.get("id")) : null;

    if (editingId) {
        pageTitle.textContent = "Update Product";

        const product = adminProducts.find(product => Number(product.id) === editingId);

        if (!product) {
            alert("Product not found.");
            window.location.href = "./admin.html";
            return;
        }

        fillForm(product);
    } else {
        pageTitle.textContent = "Create Product";
        showGalleryPreview(currentGalleryImages);
    }
}

async function getFormProduct() {
    let mainImage = currentMainImage;

    if (imageInput.files.length > 0) {
        mainImage = await fileToBase64(imageInput.files[0]);
    }

    const galleryImages = currentGalleryImages.slice(0, MAX_GALLERY_IMAGES);

    return {
        id: editingId || getNextId(),
        name: nameInput.value.trim(),
        price: Number(priceInput.value),
        oldPrice: oldPriceInput.value ? Number(oldPriceInput.value) : null,
        category: categoryInput.value.trim(),
        color: colorInput.value.trim(),
        material: materialInput.value.trim(),
        image: mainImage,
        description: descriptionInput.value.trim(),
        sale: saleInput.checked,

        // main image + max 4 gallery images
        images: [mainImage, ...galleryImages].filter(Boolean)
    };
}

async function handleSubmit(event) {
    event.preventDefault();

    const productData = await getFormProduct();

    if (!productData.image) {
        alert("Please upload a main product image.");
        return;
    }

    if (editingId) {
        adminProducts = adminProducts.map(product => {
            if (Number(product.id) === editingId) {
                return productData;
            }

            return product;
        });
    } else {
        adminProducts.push(productData);
    }

    saveProducts();
    window.location.href = "./admin.html";
}

/* ---------- EVENTS ---------- */

imageInput.addEventListener("change", async function () {
    if (imageInput.files.length === 0) return;

    const image = await fileToBase64(imageInput.files[0]);

    currentMainImage = image;
    showMainImagePreview(currentMainImage);
});

addGalleryBtn.addEventListener("click", addGalleryImage);
form.addEventListener("submit", handleSubmit);

setupPage();