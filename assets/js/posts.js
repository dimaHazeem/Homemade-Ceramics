const POSTS_STORAGE_KEY = "homemadeCeramicsCommunityPosts";
const POSTS_LIKES_KEY = "homemadeCeramicsPostLikes";
const POSTS_SAVED_KEY = "homemadeCeramicsSavedPosts";

const defaultPosts = [
    {
        id: 1,
        author: "Homemade Ceramics Studio",
        email: "studio@homemadeceramics.com",
        date: "May 13, 2026",
        text: "Fresh handmade mugs came out of the kiln today. The soft cream glaze and warm clay texture make every piece feel calm and personal.",
        image: "../images/shop-img/product-16-550x550.jpg",
        likes: 0,
        comments: []
    },
    {
        id: 2,
        author: "Lina Ahmad",
        email: "lina@example.com",
        date: "May 10, 2026",
        text: "I bought a small handmade bowl and it looks even prettier in real life. The glaze has tiny natural details that make it feel special.",
        image: "",
        likes: 0,
        comments: [
            {
                author: "Homemade Ceramics Studio",
                text: "Thank you Lina! We are so happy you loved it.",
                ownerEmail: "studio@homemadeceramics.com",
                ownerGuestId: null
            }
        ]
    },
    {
        id: 3,
        author: "Sara N.",
        email: "sara@example.com",
        date: "May 6, 2026",
        text: "The plate I ordered is perfect for table styling. I used it with linen napkins and candles and the whole table looked warm and elegant.",
        image: "../images/shop-img/product-14-1-550x550.jpg",
        likes: 0,
        comments: []
    }
];

const postsList = document.getElementById("postsList");
const postsEmptyState = document.getElementById("postsEmptyState");
const postSearchInput = document.getElementById("postSearchInput");

const createPostSection = document.getElementById("createPostSection");
const guestPostMessage = document.getElementById("guestPostMessage");
const createPostForm = document.getElementById("createPostForm");
const postTextInput = document.getElementById("postTextInput");
const postImageInput = document.getElementById("postImageInput");
const postUserName = document.getElementById("postUserName");

let posts = [];
let filteredPosts = [];

/* ---------- USER ---------- */

function getLoggedInUser() {
    const name = localStorage.getItem("bridgeCustomerName");
    const email = localStorage.getItem("bridgeCustomerEmail");

    if (!email) return null;

    return {
        name: name || email.split("@")[0],
        email: email
    };
}

function setupCreatePostAccess() {
    const user = getLoggedInUser();

    if (user) {
        createPostSection.classList.remove("hidden");
        guestPostMessage.classList.add("hidden");
        postUserName.textContent = user.name;
    } else {
        createPostSection.classList.add("hidden");
        guestPostMessage.classList.remove("hidden");
    }
}

/* ---------- LOCAL STORAGE ---------- */

function loadPosts() {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);

    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        posts = [...defaultPosts];
        savePosts();
    }

    filteredPosts = [...posts];
}

function savePosts() {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function getLikedPosts() {
    return JSON.parse(localStorage.getItem(POSTS_LIKES_KEY)) || [];
}

function saveLikedPosts(likedPosts) {
    localStorage.setItem(POSTS_LIKES_KEY, JSON.stringify(likedPosts));
}

function getSavedPosts() {
    return JSON.parse(localStorage.getItem(POSTS_SAVED_KEY)) || [];
}

function saveSavedPosts(savedPosts) {
    localStorage.setItem(POSTS_SAVED_KEY, JSON.stringify(savedPosts));
}

/* ---------- HELPERS ---------- */

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ---------- RENDER POSTS ---------- */

function renderPosts(postList) {
    postsList.innerHTML = "";

    if (postList.length === 0) {
        postsEmptyState.classList.remove("hidden");
        return;
    }

    postsEmptyState.classList.add("hidden");

    const likedPosts = getLikedPosts();
    const savedPosts = getSavedPosts();

    postList.forEach(post => {
        const isLiked = likedPosts.includes(post.id);
        const isSaved = savedPosts.includes(post.id);

        const comments = post.comments || [];
        const commentPreview = comments.slice(-2);
        const commentsCount = comments.length;
        const likesCount = post.likes || 0;

        const article = document.createElement("article");
        article.className = "post-card p-6 md:p-8";

        article.innerHTML = `
            ${
                post.image
                    ? renderPostWithImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved)
                    : renderPostWithoutImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved)
            }
        `;

        postsList.appendChild(article);
    });
}

/* ---------- POST CARD DESIGNS ---------- */

function renderPostWithImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved) {
    return `
        <div style="
            display: flex;
            gap: 32px;
            align-items: flex-start;
            flex-wrap: wrap;
        ">

            <!-- LEFT IMAGE -->
            <div style="
                width: 300px;
                max-width: 100%;
                flex: 0 0 300px;
            ">
                <div class="bg-[#fffdf9] border border-[#ddcfc2] rounded-[30px] p-5">
                    <div class="w-full h-[240px] rounded-[24px] bg-white overflow-hidden flex items-center justify-center">
                        <img src="${post.image}" 
                            alt="Post image"
                            class="w-full h-full object-contain">
                    </div>
                </div>
            </div>

            <!-- RIGHT CONTENT -->
            <div style="
                flex: 1 1 360px;
                min-width: 280px;
            ">
                ${renderPostContent(post, commentPreview, likesCount, commentsCount, isLiked, isSaved, false)}
            </div>

        </div>
    `;
}

function renderPostWithoutImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved) {
    return `
        <div class="max-w-[850px] mx-auto">
            ${renderPostContent(post, commentPreview, likesCount, commentsCount, isLiked, isSaved, true)}
        </div>
    `;
}

function renderPostContent(post, commentPreview, likesCount, commentsCount, isLiked, isSaved, noImage) {
    return `
        <div class="min-h-[240px] flex flex-col">

            <!-- USER INFO -->
            <div class="flex items-center gap-4 mb-6">
                <div class="w-[52px] h-[52px] rounded-full bg-[#f4d8cc] flex items-center justify-center">
                    <i class="fa-solid fa-user text-[#a66c4f] text-[21px]"></i>
                </div>

                <div>
                    <h2 class="font-[Poppins] text-[12px] uppercase tracking-[0.22em] font-bold text-[#17120f]">
                        ${escapeHTML(post.author)}
                    </h2>

                    <p class="text-[13px] text-[#776d64] mt-1">
                        ${escapeHTML(post.date)}
                    </p>
                </div>
            </div>

            <!-- POST TEXT -->
            ${
                noImage
                    ? `
                        <div class="bg-[#fffdf9]/80 border border-[#ddcfc2] rounded-[30px] p-8 md:p-10 mb-7">
                            <p class="font-['Cormorant_Garamond'] text-[58px] leading-none text-[#a66c4f] mb-2">
                                “
                            </p>

                            <p class="text-[20px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(post.text)}
                            </p>
                        </div>
                    `
                    : `
                        <div class="bg-[#fffdf9]/70 border border-[#ddcfc2] rounded-[26px] p-6 mb-6">
                            <p class="text-[17px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(post.text)}
                            </p>
                        </div>
                    `
            }

            ${renderCommentPreview(commentPreview)}

            ${renderActionBar(post.id, likesCount, commentsCount, isLiked, isSaved)}
        </div>
    `;
}

function renderCommentPreview(commentPreview) {
    if (commentPreview.length === 0) return "";

    return `
        <div class="space-y-3 mb-6">
            ${commentPreview.map(comment => {
                return `
                    <div class="bg-[#fffdf9]/80 border border-[#ddcfc2] rounded-[18px] px-5 py-4">
                        <p class="font-[Poppins] text-[10px] uppercase tracking-[0.18em] font-bold text-[#a66c4f] mb-2">
                            ${escapeHTML(comment.author)}
                        </p>

                        <p class="text-[14px] leading-[1.8] text-[#776d64]">
                            ${escapeHTML(comment.text)}
                        </p>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function renderActionBar(postId, likesCount, commentsCount, isLiked, isSaved) {
    return `
        <div class="flex items-center justify-between border-t border-[#17120f] pt-5 mt-auto">
            <div class="flex items-center gap-7">
                <button type="button"
                    onclick="toggleLike(${postId})"
                    class="flex items-center gap-3 text-[15px] text-[#17120f] hover:text-[#a66c4f] transition">
                    <i class="${isLiked ? "fa-solid text-[#a66c4f]" : "fa-regular"} fa-heart text-[18px]"></i>
                    <span>${likesCount}</span>
                    <span>Like</span>
                </button>

                <button type="button"
                    onclick="openPostComments(${postId})"
                    class="flex items-center gap-3 text-[15px] text-[#17120f] hover:text-[#a66c4f] transition">
                    <i class="fa-regular fa-comment text-[18px]"></i>
                    <span>${commentsCount}</span>
                    <span>Comment</span>
                </button>
            </div>

            <button type="button"
                onclick="toggleSave(${postId})"
                class="text-[24px] text-[#17120f] hover:text-[#a66c4f] transition">
                <i class="${isSaved ? "fa-solid text-[#a66c4f]" : "fa-regular"} fa-bookmark"></i>
            </button>
        </div>
    `;
}

/* ---------- FILTER ---------- */

function applyPostFilters() {
    const searchValue = postSearchInput.value.toLowerCase().trim();

    filteredPosts = posts.filter(post => {
        const author = (post.author || "").toLowerCase();
        const text = (post.text || "").toLowerCase();

        return author.includes(searchValue) || text.includes(searchValue);
    });

    renderPosts(filteredPosts);
}

/* ---------- ACTIONS ---------- */

function toggleLike(postId) {
    let likedPosts = getLikedPosts();
    const alreadyLiked = likedPosts.includes(postId);

    if (alreadyLiked) {
        likedPosts = likedPosts.filter(id => id !== postId);

        posts = posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: Math.max((post.likes || 0) - 1, 0)
                };
            }

            return post;
        });
    } else {
        likedPosts.push(postId);

        posts = posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: (post.likes || 0) + 1
                };
            }

            return post;
        });
    }

    saveLikedPosts(likedPosts);
    savePosts();
    applyPostFilters();
}

function toggleSave(postId) {
    let savedPosts = getSavedPosts();

    if (savedPosts.includes(postId)) {
        savedPosts = savedPosts.filter(id => id !== postId);
    } else {
        savedPosts.push(postId);
    }

    saveSavedPosts(savedPosts);
    renderPosts(filteredPosts);
}

function openPostComments(postId) {
    window.location.href = `./post-comments.html?id=${postId}`;
}

/* ---------- CREATE POST ---------- */

async function handleCreatePost(event) {
    event.preventDefault();

    const user = getLoggedInUser();

    if (!user) {
        alert("Please sign in to publish a post.");
        window.location.href = "./signin.html";
        return;
    }

    const text = postTextInput.value.trim();

    if (!text) {
        alert("Please write something before publishing.");
        return;
    }

    let image = "";

    if (postImageInput.files.length > 0) {
        image = await fileToBase64(postImageInput.files[0]);
    }

    const newPost = {
        id: Date.now(),
        author: user.name,
        email: user.email,
        date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }),
        text: text,
        image: image,
        likes: 0,
        comments: []
    };

    posts.unshift(newPost);
    savePosts();

    createPostForm.reset();
    applyPostFilters();

    window.scrollTo({
        top: postsList.offsetTop - 120,
        behavior: "smooth"
    });
}

/* ---------- EVENTS ---------- */

postSearchInput.addEventListener("input", applyPostFilters);
createPostForm.addEventListener("submit", handleCreatePost);

loadPosts();
setupCreatePostAccess();
renderPosts(filteredPosts);