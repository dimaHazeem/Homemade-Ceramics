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

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatDate(value) {
    if (!value) {
        return "Recently";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function getPostImage(post) {
    return post.imageData || post.image || post.imageUrl || post.photo || "";
}

function getPostTitle(post) {
    return post.title || post.caption || "Handmade Ceramic Post";
}

function getPostText(post) {
    return post.content || post.text || post.description || post.body || "";
}

function getPostAuthor(post) {
    return post.authorName || post.userName || post.fullName || "Ceramics Lover";
}

function getPostLikesCount(post, postLikes) {
    if (typeof post.likesCount === "number") {
        return post.likesCount;
    }

    return postLikes.filter(function (like) {
        return String(like.postId) === String(post.id);
    }).length;
}

function getPostCommentsCount(post, comments) {
    if (typeof post.commentsCount === "number") {
        return post.commentsCount;
    }

    return comments.filter(function (comment) {
        return String(comment.postId) === String(post.id);
    }).length;
}

function getUserRelatedPostIds(items, userId) {
    return items
        .filter(function (item) {
            return item && String(item.userId) === String(userId);
        })
        .map(function (item) {
            return String(item.postId);
        });
}

function createEmptyState(title, text, linkText = "Explore Posts") {
    return `
        <div class="soft-card rounded-[32px] p-10 md:p-14 text-center">
            <div class="w-20 h-20 rounded-full bg-[#f7e9df] flex items-center justify-center mx-auto mb-7">
                <i class="fa-regular fa-folder-open text-[#a66c4f] text-[26px]"></i>
            </div>

            <h3 class="page-title text-[42px] leading-none">
                ${escapeHTML(title)}
            </h3>

            <p class="mt-5 text-[#776d64] leading-7 max-w-xl mx-auto">
                ${escapeHTML(text)}
            </p>

            <a href="./posts.html"
                class="inline-block mt-8 bg-black text-white px-9 py-4 uppercase tracking-[0.25em] text-[11px] hover:bg-[#c9ab81] transition">
                ${escapeHTML(linkText)}
            </a>
        </div>
    `;
}

function createPostCard(post, postLikes, comments) {
    const postImage = getPostImage(post);
    const text = getPostText(post);
    const author = getPostAuthor(post);
    const likesCount = getPostLikesCount(post, postLikes);
    const commentsCount = getPostCommentsCount(post, comments);
    const createdAt = formatDate(post.createdAt || post.date);

    const shortText = text.length > 260 ? text.slice(0, 260) + "..." : text;

    return `
        <article class="soft-card rounded-[34px] p-7 md:p-8 hover:-translate-y-1 transition duration-300">

            <div style="
                display: flex;
                gap: 32px;
                align-items: stretch;
                flex-wrap: wrap;
            ">

                ${
                    postImage
                        ? `
                            <!-- LEFT IMAGE -->
                            <a href="./post-comments.html?id=${encodeURIComponent(post.id)}"
                               style="
                                    width: 320px;
                                    max-width: 100%;
                                    flex: 0 0 320px;
                                    display: block;
                               ">
                                <div class="bg-[#fffdf9] border border-[#ddcfc2] rounded-[30px] p-5 h-full">
                                    <div class="w-full h-[250px] rounded-[24px] bg-white overflow-hidden flex items-center justify-center">
                                        <img src="${postImage}" 
                                             alt="Post image"
                                             class="w-full h-full object-contain">
                                    </div>
                                </div>
                            </a>
                        `
                        : ""
                }

                <!-- RIGHT CONTENT -->
                <div style="
                    flex: 1 1 420px;
                    min-width: 280px;
                ">
                    <div class="min-h-[250px] flex flex-col">

                        <!-- USER INFO -->
                        <div class="flex items-center gap-4 mb-7">
                            <div class="w-[54px] h-[54px] rounded-full bg-[#f4d8cc] flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-user text-[#a66c4f] text-[21px]"></i>
                            </div>

                            <div>
                                <h2 class="font-[Poppins] text-[12px] uppercase tracking-[0.24em] font-bold text-[#17120f]">
                                    ${escapeHTML(author)}
                                </h2>

                                <p class="text-[14px] text-[#776d64] mt-1">
                                    ${createdAt}
                                </p>
                            </div>
                        </div>

                        <!-- POST TEXT -->
                        <a href="./post-comments.html?id=${encodeURIComponent(post.id)}"
                           class="block bg-[#fffdf9]/70 border border-[#ddcfc2] rounded-[28px] px-7 py-8 md:px-8 md:py-9 mb-7 hover:border-[#c9ab81] transition">

                            <p class="text-[18px] md:text-[20px] leading-[1.9] text-[#17120f] whitespace-pre-line">
                                ${escapeHTML(shortText)}
                            </p>
                        </a>

                        <!-- ACTION BAR -->
                        <div class="flex items-center justify-between border-t border-[#17120f] pt-6 mt-auto">

                            <div class="flex items-center gap-7 text-[#17120f]">

                                <span class="flex items-center gap-3 text-[15px]">
                                    <i class="fa-regular fa-heart text-[21px]"></i>
                                    <span>${likesCount}</span>
                                    <span>Like</span>
                                </span>

                                <a href="./post-comments.html?id=${encodeURIComponent(post.id)}"
                                   class="flex items-center gap-3 text-[15px] hover:text-[#a66c4f] transition">
                                    <i class="fa-regular fa-comment text-[21px]"></i>
                                    <span>${commentsCount}</span>
                                    <span>Comment</span>
                                </a>

                            </div>

                            <span class="text-[25px] text-[#17120f]">
                                <i class="fa-regular fa-bookmark"></i>
                            </span>

                        </div>
                    </div>
                </div>

            </div>
        </article>
    `;
}

function createCommentCard(comment, post) {
    const commentText = comment.text || comment.content || comment.comment || "";
    const createdAt = formatDate(comment.createdAt || comment.date);
    const postTitle = post ? getPostTitle(post) : "Deleted Post";

    return `
        <article class="soft-card rounded-[28px] p-8 hover:-translate-y-1 transition duration-300">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                    <p class="uppercase tracking-[0.25em] text-[11px] text-[#a66c4f] font-[Poppins] font-bold">
                        Commented on
                    </p>

                    <h3 class="page-title text-[36px] leading-none mt-3">
                        ${escapeHTML(postTitle)}
                    </h3>

                    <p class="mt-5 text-[#776d64] leading-8">
                        “${escapeHTML(commentText)}”
                    </p>

                    <p class="mt-5 text-[13px] text-[#9a8f84]">
                        ${createdAt}
                    </p>
                </div>

                ${
                    post
                        ? `
                            <a href="./post-comments.html?id=${encodeURIComponent(post.id)}"
                                class="shrink-0 bg-black text-white px-7 py-4 uppercase tracking-[0.25em] text-[11px] hover:bg-[#c9ab81] transition">
                                Open Post
                            </a>
                        `
                        : ""
                }
            </div>
        </article>
    `;
}

async function loadUserPostsPage() {
    if (!window.UsersAPI) {
        return;
    }

    const user = await window.UsersAPI.getCurrentUser();

    if (!user) {
        window.location.href = "./signin.html";
        return;
    }

    const posts = getStorageArray("homemadeCeramicsPosts");
    const postLikes = getStorageArray("homemadeCeramicsPostLikes");
    const postSaves = getStorageArray("homemadeCeramicsPostSaves");
    const comments = getStorageArray("homemadeCeramicsComments");

    const likedPostIds = getUserRelatedPostIds(postLikes, user.id);
    const savedPostIds = getUserRelatedPostIds(postSaves, user.id);

    const myPosts = posts.filter(function (post) {
        return String(post.userId) === String(user.id);
    });

    const likedPosts = posts.filter(function (post) {
        return likedPostIds.includes(String(post.id));
    });

    const savedPosts = posts.filter(function (post) {
        return savedPostIds.includes(String(post.id));
    });

    const myComments = comments.filter(function (comment) {
        return String(comment.userId) === String(user.id);
    });

    const counts = {
        "my-posts": myPosts.length,
        liked: likedPosts.length,
        saved: savedPosts.length,
        comments: myComments.length
    };

    document.getElementById("tabMyPostsCount").textContent = counts["my-posts"];
    document.getElementById("tabLikedCount").textContent = counts.liked;
    document.getElementById("tabSavedCount").textContent = counts.saved;
    document.getElementById("tabCommentsCount").textContent = counts.comments;

    const container = document.getElementById("userPostsContainer");
    const pageDescription = document.getElementById("pageDescription");
    const tabButtons = document.querySelectorAll(".tab-btn");

    const tabData = {
        "my-posts": {
            description: "These are the posts you shared with the Homemade Ceramics community.",
            emptyTitle: "No Posts Yet",
            emptyText: "You have not shared any posts yet. Start by visiting the posts page and creating your first community post.",
            render: function () {
                if (myPosts.length === 0) {
                    return createEmptyState(this.emptyTitle, this.emptyText, "Go To Posts");
                }

                return myPosts.map(function (post) {
                    return createPostCard(post, postLikes, comments);
                }).join("");
            }
        },

        liked: {
            description: "These are the posts you liked and enjoyed from the community.",
            emptyTitle: "No Liked Posts",
            emptyText: "When you like posts, they will appear here so you can return to them later.",
            render: function () {
                if (likedPosts.length === 0) {
                    return createEmptyState(this.emptyTitle, this.emptyText, "Explore Posts");
                }

                return likedPosts.map(function (post) {
                    return createPostCard(post, postLikes, comments);
                }).join("");
            }
        },

        saved: {
            description: "These are the posts you saved for inspiration and future reading.",
            emptyTitle: "No Saved Posts",
            emptyText: "Saved posts will appear here. Use this space as your inspiration board.",
            render: function () {
                if (savedPosts.length === 0) {
                    return createEmptyState(this.emptyTitle, this.emptyText, "Explore Posts");
                }

                return savedPosts.map(function (post) {
                    return createPostCard(post, postLikes, comments);
                }).join("");
            }
        },

        comments: {
            description: "These are the comments you wrote on community posts.",
            emptyTitle: "No Comments Yet",
            emptyText: "When you comment on posts, your comments will appear here.",
            render: function () {
                if (myComments.length === 0) {
                    return createEmptyState(this.emptyTitle, this.emptyText, "Explore Posts");
                }

                return myComments.map(function (comment) {
                    const relatedPost = posts.find(function (post) {
                        return String(post.id) === String(comment.postId);
                    });

                    return createCommentCard(comment, relatedPost);
                }).join("");
            }
        }
    };

    function getActiveTab() {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");

        if (tabData[tab]) {
            return tab;
        }

        return "my-posts";
    }

    function renderTab(tab) {
        tabButtons.forEach(function (button) {
            button.classList.toggle("active", button.dataset.tab === tab);
        });

        pageDescription.textContent = tabData[tab].description;
        container.innerHTML = tabData[tab].render();

        const newUrl = `./user-posts.html?tab=${tab}`;
        window.history.replaceState(null, "", newUrl);
    }

    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            renderTab(button.dataset.tab);
        });
    });

    renderTab(getActiveTab());
}

loadUserPostsPage();