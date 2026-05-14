const POSTS_STORAGE_KEY = "homemadeCeramicsCommunityPosts";
const POSTS_LIKES_KEY = "homemadeCeramicsPostLikes";
const POSTS_SAVED_KEY = "homemadeCeramicsSavedPosts";
const GUEST_ID_KEY = "homemadeCeramicsGuestId";

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

const postDetailsContainer = document.getElementById("postDetailsContainer");

let posts = [];
let currentPostId = null;

/* ---------- USER / VISITOR ---------- */

function getLoggedInUser() {
    const name = localStorage.getItem("bridgeCustomerName");
    const email = localStorage.getItem("bridgeCustomerEmail");

    if (!email) return null;

    return {
        name: name || email.split("@")[0],
        email: email
    };
}

function getCurrentVisitor() {
    const user = getLoggedInUser();

    if (user) {
        return {
            name: user.name,
            email: user.email,
            role: localStorage.getItem("bridgeCustomerRole") || "user",
            guestId: null
        };
    }

    let guestId = localStorage.getItem(GUEST_ID_KEY);

    if (!guestId) {
        guestId = Date.now() + "-" + Math.random().toString(16).slice(2);
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }

    return {
        name: "Guest Visitor",
        email: "",
        role: "guest",
        guestId: guestId
    };
}

function canDeleteComment(comment) {
    const visitor = getCurrentVisitor();

    if (visitor.role === "admin") return true;
    if (visitor.email && comment.ownerEmail === visitor.email) return true;
    if (visitor.guestId && comment.ownerGuestId === visitor.guestId) return true;

    return false;
}

/* ---------- STORAGE ---------- */

function loadPosts() {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);

    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        posts = [...defaultPosts];
        savePosts();
    }
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

/* ---------- MAIN RENDER ---------- */

function renderPostDetails() {
    const post = posts.find(post => Number(post.id) === Number(currentPostId));

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

    const likedPosts = getLikedPosts();
    const savedPosts = getSavedPosts();

    const isLiked = likedPosts.includes(post.id);
    const isSaved = savedPosts.includes(post.id);

    const comments = post.comments || [];
    const commentsCount = comments.length;
    const likesCount = post.likes || 0;

    postDetailsContainer.innerHTML = `
        ${renderMainPostCard(post, likesCount, commentsCount, isLiked, isSaved)}
        ${renderCommentsSection(comments, commentsCount)}
    `;
}

/* ---------- POST CARD ---------- */

function renderMainPostCard(post, likesCount, commentsCount, isLiked, isSaved) {
    if (post.image) {
        return `
            <article class="soft-card p-6 md:p-8 mb-10">
                <div style="
                    display: grid;
                    grid-template-columns: 300px minmax(0, 1fr);
                    gap: 32px;
                    align-items: start;
                ">
                    ${renderImageBox(post.image)}
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
    return `
        <div class="min-h-[240px] flex flex-col">

            <div class="flex items-center gap-4 mb-6">
                <div class="w-[52px] h-[52px] rounded-full bg-[#f4d8cc] flex items-center justify-center">
                    <i class="fa-solid fa-user text-[#a66c4f] text-[21px]"></i>
                </div>

                <div>
                    <h2 class="font-[Poppins] text-[12px] uppercase tracking-[0.22em] font-bold text-[#17120f]">
                        ${post.author}
                    </h2>

                    <p class="text-[13px] text-[#776d64] mt-1">
                        ${post.date}
                    </p>
                </div>
            </div>

            ${
                noImage
                    ? `
                        <div class="bg-[#fffdf9]/80 border border-[#ddcfc2] rounded-[30px] p-8 md:p-10 mb-7">
                            <p class="font-['Cormorant_Garamond'] text-[58px] leading-none text-[#a66c4f] mb-2">
                                “
                            </p>

                            <p class="text-[20px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${post.text}
                            </p>
                        </div>
                    `
                    : `
                        <div class="bg-[#fffdf9]/70 border border-[#ddcfc2] rounded-[26px] p-6 mb-7">
                            <p class="text-[17px] leading-[1.95] text-[#17120f] whitespace-pre-line">
                                ${post.text}
                            </p>
                        </div>
                    `
            }

            ${renderActionBar(post.id, likesCount, commentsCount, isLiked, isSaved)}
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
                    onclick="focusCommentInput()"
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

/* ---------- COMMENTS SECTION ---------- */

function renderCommentsSection(comments, commentsCount) {
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

            <form onsubmit="addComment(event)" class="mb-9">
                <textarea id="newCommentInput" class="comment-input"
                    placeholder="Write your comment..."></textarea>

                <div class="flex justify-end mt-4">
                    <button type="submit" class="soft-btn">
                        Post Comment
                    </button>
                </div>
            </form>

            <div class="space-y-5">
                ${
                    comments.length === 0
                        ? `
                            <div class="comment-card text-center">
                                <p class="text-[15px] leading-[1.9] text-[#776d64]">
                                    No comments yet. Be the first to comment.
                                </p>
                            </div>
                        `
                        : comments.map((comment, index) => renderComment(comment, index)).join("")
                }
            </div>
        </section>
    `;
}

function renderComment(comment, index) {
    const showDeleteButton = canDeleteComment(comment);

    return `
        <div class="comment-card">
            <div class="flex items-start justify-between gap-5 mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-[38px] h-[38px] rounded-full bg-[#f4d8cc] flex items-center justify-center">
                        <i class="fa-solid fa-user text-[#a66c4f] text-[15px]"></i>
                    </div>

                    <p class="font-[Poppins] text-[11px] uppercase tracking-[0.18em] font-bold text-[#a66c4f]">
                        ${comment.author}
                    </p>
                </div>

                ${
                    showDeleteButton
                        ? `
                            <button type="button"
                                onclick="removeComment(${index})"
                                class="font-[Poppins] text-[10px] uppercase tracking-[0.18em] text-[#a66c4f] hover:text-[#17120f] transition">
                                Delete
                            </button>
                        `
                        : ""
                }
            </div>

            <p class="text-[15px] leading-[1.85] text-[#776d64]">
                ${comment.text}
            </p>
        </div>
    `;
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
    renderPostDetails();
}

function toggleSave(postId) {
    let savedPosts = getSavedPosts();

    if (savedPosts.includes(postId)) {
        savedPosts = savedPosts.filter(id => id !== postId);
    } else {
        savedPosts.push(postId);
    }

    saveSavedPosts(savedPosts);
    renderPostDetails();
}

function addComment(event) {
    event.preventDefault();

    const visitor = getCurrentVisitor();
    const input = document.getElementById("newCommentInput");
    const commentText = input.value.trim();

    if (!commentText) return;

    posts = posts.map(post => {
        if (Number(post.id) === Number(currentPostId)) {
            return {
                ...post,
                comments: [
                    ...(post.comments || []),
                    {
                        author: visitor.name,
                        text: commentText,
                        ownerEmail: visitor.email,
                        ownerGuestId: visitor.guestId
                    }
                ]
            };
        }

        return post;
    });

    savePosts();
    renderPostDetails();
}

function removeComment(commentIndex) {
    const post = posts.find(post => Number(post.id) === Number(currentPostId));

    if (!post || !post.comments || !post.comments[commentIndex]) return;

    const comment = post.comments[commentIndex];

    if (!canDeleteComment(comment)) {
        alert("Only the comment owner or admin can delete this comment.");
        return;
    }

    posts = posts.map(post => {
        if (Number(post.id) === Number(currentPostId)) {
            return {
                ...post,
                comments: post.comments.filter((comment, index) => index !== commentIndex)
            };
        }

        return post;
    });

    savePosts();
    renderPostDetails();
}

function focusCommentInput() {
    const input = document.getElementById("newCommentInput");

    if (!input) return;

    input.focus();
    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* ---------- INIT ---------- */

function initPostCommentsPage() {
    const params = new URLSearchParams(window.location.search);
    currentPostId = params.get("id");

    loadPosts();
    renderPostDetails();
}

initPostCommentsPage();