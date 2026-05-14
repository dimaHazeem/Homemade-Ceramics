const POSTS_STORAGE_KEY = "homemadeCeramicsPosts";
const OLD_POSTS_STORAGE_KEY = "homemadeCeramicsCommunityPosts";

const POST_LIKES_KEY = "homemadeCeramicsPostLikes";
const POST_SAVES_KEY = "homemadeCeramicsPostSaves";
const OLD_POST_SAVES_KEY = "homemadeCeramicsSavedPosts";

const COMMENTS_STORAGE_KEY = "homemadeCeramicsComments";

const defaultPosts = [
    {
        id: "post-1",
        userId: "studio",
        authorName: "Homemade Ceramics Studio",
        email: "studio@homemadeceramics.com",
        content: "Fresh handmade mugs came out of the kiln today. The soft cream glaze and warm clay texture make every piece feel calm and personal.",
        image: "../images/shop-img/product-16-550x550.jpg",
        createdAt: "2026-05-13T10:00:00.000Z"
    },
    {
        id: "post-2",
        userId: "customer-lina",
        authorName: "Lina Ahmad",
        email: "lina@example.com",
        content: "I bought a small handmade bowl and it looks even prettier in real life. The glaze has tiny natural details that make it feel special.",
        image: "",
        createdAt: "2026-05-10T10:00:00.000Z"
    },
    {
        id: "post-3",
        userId: "customer-sara",
        authorName: "Sara N.",
        email: "sara@example.com",
        content: "The plate I ordered is perfect for table styling. I used it with linen napkins and candles and the whole table looked warm and elegant.",
        image: "../images/shop-img/product-14-1-550x550.jpg",
        createdAt: "2026-05-06T10:00:00.000Z"
    }
];

const defaultComments = [
    {
        id: "comment-1",
        postId: "post-2",
        userId: "studio",
        authorName: "Homemade Ceramics Studio",
        text: "Thank you Lina! We are so happy you loved it.",
        createdAt: "2026-05-10T12:00:00.000Z"
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

let currentUser = null;
let posts = [];
let comments = [];
let postLikes = [];
let postSaves = [];
let filteredPosts = [];

function getStorageArray(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    try {
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        return [];
    }
}

function saveStorageArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function toJSString(value) {
    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}

function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPostImage(post) {
    return post.imageData || post.image || "";
}

function getPostContent(post) {
    return post.content || post.text || post.description || "";
}

function getPostAuthor(post) {
    return post.authorName || post.author || "Ceramics Lover";
}

function normalizePost(post) {
    return {
        id: String(post.id || createId("post")),
        userId: post.userId || "legacy-user",
        authorName: post.authorName || post.author || "Ceramics Lover",
        email: post.email || "",
        content: post.content || post.text || "",
        image: post.image || "",
        imageData: post.imageData || "",
        createdAt: post.createdAt || post.date || new Date().toISOString()
    };
}

function normalizeRelationItems(items, currentUserId) {
    return items
        .map(function (item) {
            if (typeof item === "string" || typeof item === "number") {
                if (!currentUserId) {
                    return null;
                }

                return {
                    userId: currentUserId,
                    postId: String(item),
                    createdAt: new Date().toISOString()
                };
            }

            if (!item || !item.postId) {
                return null;
            }

            return {
                userId: item.userId || currentUserId || "legacy-user",
                postId: String(item.postId),
                createdAt: item.createdAt || new Date().toISOString()
            };
        })
        .filter(Boolean);
}

function extractOldComments(oldPosts) {
    const extractedComments = [];

    oldPosts.forEach(function (post) {
        const postId = String(post.id);

        (post.comments || []).forEach(function (comment) {
            extractedComments.push({
                id: createId("comment"),
                postId: postId,
                userId: comment.userId || "legacy-comment-user",
                authorName: comment.author || comment.authorName || "Ceramics Lover",
                text: comment.text || comment.content || "",
                createdAt: comment.createdAt || new Date().toISOString()
            });
        });
    });

    return extractedComments;
}

function loadCommunityData() {
    const savedPosts = getStorageArray(POSTS_STORAGE_KEY);
    const oldPosts = getStorageArray(OLD_POSTS_STORAGE_KEY);

    if (savedPosts.length > 0) {
        posts = savedPosts.map(normalizePost);
    } else if (oldPosts.length > 0) {
        posts = oldPosts.map(normalizePost);
        saveStorageArray(POSTS_STORAGE_KEY, posts);
    } else {
        posts = [...defaultPosts];
        saveStorageArray(POSTS_STORAGE_KEY, posts);
    }

    const savedComments = getStorageArray(COMMENTS_STORAGE_KEY);

    if (savedComments.length > 0) {
        comments = savedComments;
    } else if (oldPosts.length > 0) {
        comments = extractOldComments(oldPosts);
        saveStorageArray(COMMENTS_STORAGE_KEY, comments);
    } else {
        comments = [...defaultComments];
        saveStorageArray(COMMENTS_STORAGE_KEY, comments);
    }

    const currentUserId = currentUser ? currentUser.id : null;

    postLikes = normalizeRelationItems(getStorageArray(POST_LIKES_KEY), currentUserId);
    postSaves = normalizeRelationItems(
        getStorageArray(POST_SAVES_KEY).length > 0
            ? getStorageArray(POST_SAVES_KEY)
            : getStorageArray(OLD_POST_SAVES_KEY),
        currentUserId
    );

    saveStorageArray(POST_LIKES_KEY, postLikes);
    saveStorageArray(POST_SAVES_KEY, postSaves);

    filteredPosts = [...posts];
}

function saveCommunityData() {
    saveStorageArray(POSTS_STORAGE_KEY, posts);
    saveStorageArray(COMMENTS_STORAGE_KEY, comments);
    saveStorageArray(POST_LIKES_KEY, postLikes);
    saveStorageArray(POST_SAVES_KEY, postSaves);
}

function setupCreatePostAccess() {
    if (currentUser) {
        createPostSection.classList.remove("hidden");
        guestPostMessage.classList.add("hidden");
        postUserName.textContent = currentUser.fullName || currentUser.firstName || "Customer";
    } else {
        createPostSection.classList.add("hidden");
        guestPostMessage.classList.remove("hidden");
    }
}

function requireSignIn() {
    if (currentUser) {
        return true;
    }

    window.location.href = "./signin.html";
    return false;
}

function getCommentsForPost(postId) {
    return comments.filter(function (comment) {
        return String(comment.postId) === String(postId);
    });
}

function getLikesCount(postId) {
    return postLikes.filter(function (like) {
        return String(like.postId) === String(postId);
    }).length;
}

function isPostLiked(postId) {
    if (!currentUser) {
        return false;
    }

    return postLikes.some(function (like) {
        return String(like.postId) === String(postId) && String(like.userId) === String(currentUser.id);
    });
}

function isPostSaved(postId) {
    if (!currentUser) {
        return false;
    }

    return postSaves.some(function (save) {
        return String(save.postId) === String(postId) && String(save.userId) === String(currentUser.id);
    });
}

function renderPosts(postList) {
    postsList.innerHTML = "";

    if (postList.length === 0) {
        postsEmptyState.classList.remove("hidden");
        return;
    }

    postsEmptyState.classList.add("hidden");

    postList.forEach(function (post) {
        const postComments = getCommentsForPost(post.id);
        const commentPreview = postComments.slice(-2);
        const commentsCount = postComments.length;
        const likesCount = getLikesCount(post.id);
        const isLiked = isPostLiked(post.id);
        const isSaved = isPostSaved(post.id);

        const article = document.createElement("article");
        article.className = "post-card p-6 md:p-8";

        article.innerHTML = getPostImage(post)
            ? renderPostWithImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved)
            : renderPostWithoutImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved);

        postsList.appendChild(article);
    });
}

function renderPostWithImage(post, commentPreview, likesCount, commentsCount, isLiked, isSaved) {
    return `
        <div style="display:flex; gap:32px; align-items:flex-start; flex-wrap:wrap;">
            <div style="width:300px; max-width:100%; flex:0 0 300px;">
                <a href="./post-comments.html?id=${encodeURIComponent(post.id)}"
                    class="bg-[#fffdf9] border border-[#ddcfc2] rounded-[30px] p-5 block">
                    <div class="w-full h-[240px] rounded-[24px] bg-white overflow-hidden flex items-center justify-center">
                        <img src="${getPostImage(post)}" 
                            alt="Post image"
                            class="w-full h-full object-contain">
                    </div>
                </a>
            </div>

            <div style="flex:1 1 360px; min-width:280px;">
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
    const safePostId = toJSString(post.id);

    return `
        <div class="min-h-[240px] flex flex-col">
            <div class="flex items-center gap-4 mb-6">
                <div class="w-[52px] h-[52px] rounded-full bg-[#f4d8cc] flex items-center justify-center">
                    <i class="fa-solid fa-user text-[#a66c4f] text-[21px]"></i>
                </div>

                <div>
                    <h2 class="font-[Poppins] text-[12px] uppercase tracking-[0.22em] font-bold text-[#17120f]">
                        ${escapeHTML(getPostAuthor(post))}
                    </h2>

                    <p class="text-[13px] text-[#776d64] mt-1">
                        ${escapeHTML(formatDate(post.createdAt))}
                    </p>
                </div>
            </div>

            ${
                noImage
                    ? `
                        <div class="bg-[#fffdf9]/80 border border-[#ddcfc2] rounded-[30px] p-8 md:p-10 mb-7">
                            <p class="font-['Cormorant_Garamond'] text-[58px] leading-none text-[#a66c4f] mb-2">“</p>
                            <p class="text-[20px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(getPostContent(post))}
                            </p>
                        </div>
                    `
                    : `
                        <div class="bg-[#fffdf9]/70 border border-[#ddcfc2] rounded-[26px] p-6 mb-6">
                            <p class="text-[17px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(getPostContent(post))}
                            </p>
                        </div>
                    `
            }

            ${renderCommentPreview(commentPreview)}

            <div class="flex items-center justify-between border-t border-[#17120f] pt-5 mt-auto">
                <div class="flex items-center gap-7">
                    <button type="button"
                        onclick="toggleLike('${safePostId}')"
                        class="flex items-center gap-3 text-[15px] text-[#17120f] hover:text-[#a66c4f] transition">
                        <i class="${isLiked ? "fa-solid text-[#a66c4f]" : "fa-regular"} fa-heart text-[18px]"></i>
                        <span>${likesCount}</span>
                        <span>Like</span>
                    </button>

                    <button type="button"
                        onclick="openPostComments('${safePostId}')"
                        class="flex items-center gap-3 text-[15px] text-[#17120f] hover:text-[#a66c4f] transition">
                        <i class="fa-regular fa-comment text-[18px]"></i>
                        <span>${commentsCount}</span>
                        <span>Comment</span>
                    </button>
                </div>

                <button type="button"
                    onclick="toggleSave('${safePostId}')"
                    class="text-[24px] text-[#17120f] hover:text-[#a66c4f] transition">
                    <i class="${isSaved ? "fa-solid text-[#a66c4f]" : "fa-regular"} fa-bookmark"></i>
                </button>
            </div>
        </div>
    `;
}

function renderCommentPreview(commentPreview) {
    if (commentPreview.length === 0) {
        return "";
    }

    return `
        <div class="space-y-3 mb-6">
            ${commentPreview.map(function (comment) {
                return `
                    <div class="bg-[#fffdf9]/80 border border-[#ddcfc2] rounded-[18px] px-5 py-4">
                        <p class="font-[Poppins] text-[10px] uppercase tracking-[0.18em] font-bold text-[#a66c4f] mb-2">
                            ${escapeHTML(comment.authorName)}
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

function applyPostFilters() {
    const searchValue = postSearchInput.value.toLowerCase().trim();

    filteredPosts = posts.filter(function (post) {
        const author = getPostAuthor(post).toLowerCase();
        const text = getPostContent(post).toLowerCase();

        return author.includes(searchValue) || text.includes(searchValue);
    });

    renderPosts(filteredPosts);
}

function toggleLike(postId) {
    if (!requireSignIn()) {
        return;
    }

    const alreadyLiked = postLikes.some(function (like) {
        return String(like.postId) === String(postId) && String(like.userId) === String(currentUser.id);
    });

    if (alreadyLiked) {
        postLikes = postLikes.filter(function (like) {
            return !(String(like.postId) === String(postId) && String(like.userId) === String(currentUser.id));
        });
    } else {
        postLikes.push({
            userId: currentUser.id,
            postId: String(postId),
            createdAt: new Date().toISOString()
        });
    }

    saveCommunityData();
    applyPostFilters();
}

function toggleSave(postId) {
    if (!requireSignIn()) {
        return;
    }

    const alreadySaved = postSaves.some(function (save) {
        return String(save.postId) === String(postId) && String(save.userId) === String(currentUser.id);
    });

    if (alreadySaved) {
        postSaves = postSaves.filter(function (save) {
            return !(String(save.postId) === String(postId) && String(save.userId) === String(currentUser.id));
        });
    } else {
        postSaves.push({
            userId: currentUser.id,
            postId: String(postId),
            createdAt: new Date().toISOString()
        });
    }

    saveCommunityData();
    applyPostFilters();
}

function openPostComments(postId) {
    window.location.href = `./post-comments.html?id=${encodeURIComponent(postId)}`;
}

async function handleCreatePost(event) {
    event.preventDefault();

    if (!requireSignIn()) {
        return;
    }

    const text = postTextInput.value.trim();

    if (!text) {
        alert("Please write something before publishing.");
        return;
    }

    let imageData = "";

    if (postImageInput.files.length > 0) {
        imageData = await fileToBase64(postImageInput.files[0]);
    }

    const newPost = {
        id: createId("post"),
        userId: currentUser.id,
        authorName: currentUser.fullName || currentUser.firstName || "Customer",
        email: currentUser.email || "",
        content: text,
        image: "",
        imageData: imageData,
        createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    saveCommunityData();

    createPostForm.reset();
    applyPostFilters();

    window.scrollTo({
        top: postsList.offsetTop - 120,
        behavior: "smooth"
    });
}

async function initPostsPage() {
    if (window.UsersAPI) {
        currentUser = await window.UsersAPI.getCurrentUser();
    }

    loadCommunityData();
    setupCreatePostAccess();

    postSearchInput.addEventListener("input", applyPostFilters);
    createPostForm.addEventListener("submit", handleCreatePost);

    renderPosts(filteredPosts);
}

initPostsPage();