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

const postDetailsContainer = document.getElementById("postDetailsContainer");

let currentUser = null;
let currentPostId = null;

let posts = [];
let comments = [];
let postLikes = [];
let postSaves = [];

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

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function getPostImage(post) {
    return post.imageData || post.image || "";
}

function getPostContent(post) {
    return post.content || post.text || "";
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
}

function saveCommunityData() {
    saveStorageArray(POSTS_STORAGE_KEY, posts);
    saveStorageArray(COMMENTS_STORAGE_KEY, comments);
    saveStorageArray(POST_LIKES_KEY, postLikes);
    saveStorageArray(POST_SAVES_KEY, postSaves);
}

function requireSignIn() {
    if (currentUser) {
        return true;
    }

    window.location.href = "./signin.html";
    return false;
}

function getCurrentPost() {
    return posts.find(function (post) {
        return String(post.id) === String(currentPostId);
    });
}

function getCommentsForCurrentPost() {
    return comments.filter(function (comment) {
        return String(comment.postId) === String(currentPostId);
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

function canDeleteComment(comment) {
    if (!currentUser) {
        return false;
    }

    if (currentUser.role === "admin") {
        return true;
    }

    return String(comment.userId) === String(currentUser.id);
}

function renderPostDetails() {
    const post = getCurrentPost();

    if (!post) {
        postDetailsContainer.innerHTML = `
            <section class="soft-card p-10 text-center">
                <p class="page-label mb-4">Not Found</p>

                <h2 class="font-['Cormorant_Garamond'] text-[52px] leading-none mb-6">
                    Post not found.
                </h2>

                <a href="./posts.html" class="outline-btn inline-flex items-center justify-center">
                    Back to Posts
                </a>
            </section>
        `;
        return;
    }

    const postComments = getCommentsForCurrentPost();
    const commentsCount = postComments.length;
    const likesCount = getLikesCount(post.id);
    const isLiked = isPostLiked(post.id);
    const isSaved = isPostSaved(post.id);

    postDetailsContainer.innerHTML = `
        ${renderMainPostCard(post, likesCount, commentsCount, isLiked, isSaved)}
        ${renderCommentsSection(postComments, commentsCount)}
    `;
}

function renderMainPostCard(post, likesCount, commentsCount, isLiked, isSaved) {
    if (getPostImage(post)) {
        return `
            <article class="soft-card p-6 md:p-8 mb-10">
                <div class="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
                    ${renderImageBox(getPostImage(post))}
                    ${renderPostContent(post, likesCount, commentsCount, isLiked, isSaved, false)}
                </div>
            </article>
        `;
    }

    return `
        <article class="soft-card p-6 md:p-8 mb-10">
            <div class="max-w-[850px] mx-auto">
                ${renderPostContent(post, likesCount, commentsCount, isLiked, isSaved, true)}
            </div>
        </article>
    `;
}

function renderImageBox(image) {
    return `
        <div class="bg-[#fffdf9] border border-[#ddcfc2] rounded-[30px] p-5">
            <div class="w-full h-[240px] rounded-[24px] bg-white overflow-hidden flex items-center justify-center">
                <img src="${image}" 
                    alt="Post image"
                    class="w-full h-full object-contain">
            </div>
        </div>
    `;
}

function renderPostContent(post, likesCount, commentsCount, isLiked, isSaved, noImage) {
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
                        <div class="bg-[#fffdf9]/70 border border-[#ddcfc2] rounded-[26px] p-6 mb-7">
                            <p class="text-[17px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(getPostContent(post))}
                            </p>
                        </div>
                    `
            }

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
                        onclick="focusCommentInput()"
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

function renderCommentsSection(postComments, commentsCount) {
    return `
        <section class="soft-card p-7 md:p-9">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
                <div>
                    <p class="page-label mb-4">
                        All Comments
                    </p>

                    <h2 class="font-['Cormorant_Garamond'] text-[52px] leading-none">
                        ${commentsCount} Comment${commentsCount === 1 ? "" : "s"}
                    </h2>
                </div>

                <a href="./posts.html" class="outline-btn inline-flex items-center justify-center">
                    Back
                </a>
            </div>

            ${
                currentUser
                    ? `
                        <form onsubmit="addComment(event)" class="mb-9">
                            <textarea id="newCommentInput" class="comment-input"
                                placeholder="Write your comment..."></textarea>

                            <div class="flex justify-end mt-4">
                                <button type="submit" class="soft-btn">
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    `
                    : `
                        <div class="comment-card text-center mb-9">
                            <p class="text-[15px] leading-[1.9] text-[#776d64] mb-5">
                                Sign in to join the conversation.
                            </p>

                            <a href="./signin.html" class="soft-btn inline-flex items-center justify-center">
                                Sign In
                            </a>
                        </div>
                    `
            }

            <div class="space-y-5">
                ${
                    postComments.length === 0
                        ? `
                            <div class="comment-card text-center">
                                <p class="text-[15px] leading-[1.9] text-[#776d64]">
                                    No comments yet. Be the first to comment.
                                </p>
                            </div>
                        `
                        : postComments.map(renderComment).join("")
                }
            </div>
        </section>
    `;
}

function renderComment(comment) {
    const showDeleteButton = canDeleteComment(comment);
    const safeCommentId = toJSString(comment.id);

    return `
        <div class="comment-card">
            <div class="flex items-start justify-between gap-5 mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-[38px] h-[38px] rounded-full bg-[#f4d8cc] flex items-center justify-center">
                        <i class="fa-solid fa-user text-[#a66c4f] text-[15px]"></i>
                    </div>

                    <div>
                        <p class="font-[Poppins] text-[11px] uppercase tracking-[0.18em] font-bold text-[#a66c4f]">
                            ${escapeHTML(comment.authorName)}
                        </p>

                        <p class="text-[12px] text-[#9a8f84] mt-1">
                            ${escapeHTML(formatDate(comment.createdAt))}
                        </p>
                    </div>
                </div>

                ${
                    showDeleteButton
                        ? `
                            <button type="button"
                                onclick="removeComment('${safeCommentId}')"
                                class="font-[Poppins] text-[10px] uppercase tracking-[0.18em] text-[#a66c4f] hover:text-[#17120f] transition">
                                Delete
                            </button>
                        `
                        : ""
                }
            </div>

            <p class="text-[15px] leading-[1.85] text-[#776d64]">
                ${escapeHTML(comment.text)}
            </p>
        </div>
    `;
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
    renderPostDetails();
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
    renderPostDetails();
}

function addComment(event) {
    event.preventDefault();

    if (!requireSignIn()) {
        return;
    }

    const input = document.getElementById("newCommentInput");

    if (!input) {
        return;
    }

    const commentText = input.value.trim();

    if (!commentText) {
        return;
    }

    comments.push({
        id: createId("comment"),
        postId: String(currentPostId),
        userId: currentUser.id,
        authorName: currentUser.fullName || currentUser.firstName || "Customer",
        text: commentText,
        createdAt: new Date().toISOString()
    });

    saveCommunityData();
    renderPostDetails();
}

function removeComment(commentId) {
    const comment = comments.find(function (comment) {
        return String(comment.id) === String(commentId);
    });

    if (!comment) {
        return;
    }

    if (!canDeleteComment(comment)) {
        alert("Only the comment owner or admin can delete this comment.");
        return;
    }

    comments = comments.filter(function (comment) {
        return String(comment.id) !== String(commentId);
    });

    saveCommunityData();
    renderPostDetails();
}

function focusCommentInput() {
    if (!currentUser) {
        window.location.href = "./signin.html";
        return;
    }

    const input = document.getElementById("newCommentInput");

    if (!input) {
        return;
    }

    input.focus();
    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

async function initPostCommentsPage() {
    const params = new URLSearchParams(window.location.search);
    currentPostId = params.get("id");

    if (window.UsersAPI) {
        currentUser = await window.UsersAPI.getCurrentUser();
    }

    loadCommunityData();
    renderPostDetails();
}

initPostCommentsPage();