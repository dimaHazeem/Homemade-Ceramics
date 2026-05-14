async function renderUserProfileMenu() {
    const container = document.querySelector("#userProfileMenu");

    if (!container || !window.UsersAPI) {
        return;
    }

    const isInsidePages = window.location.pathname.includes("/assets/pages/");

    const assetsPath = isInsidePages ? "../" : "./assets/";
    const pagesPath = isInsidePages ? "./" : "./assets/pages/";

    const user = await window.UsersAPI.getCurrentUser();

    const isSignedIn = user !== null;

    const avatarImage = isSignedIn && user.avatarData
        ? user.avatarData
        : isSignedIn && user.avatar
            ? `${assetsPath}images/${user.avatar}`
            : `${assetsPath}images/${window.UsersAPI.DEFAULT_PROFILE_IMAGE}`;

    const userName = isSignedIn ? user.fullName : "Guest";
    const userEmail = isSignedIn ? user.email : "Sign in to your account";

    const profileHeaderLink = isSignedIn
        ? `${pagesPath}account.html`
        : `${pagesPath}signin.html`;

    container.innerHTML = `
        <div class="relative hidden md:block">
            <button id="avatarButton" type="button"
                class="w-11 h-11 rounded-full overflow-hidden border border-black/40 bg-white p-[2px] hover:border-[#e2b7a8] transition">
                <img src="${avatarImage}" 
                     alt="User profile"
                     class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
            </button>

            <div id="userDropdown"
                class="hidden absolute right-0 top-full mt-6 w-[400px] bg-white border border-[#ededed] shadow-lg z-50">

                <a href="${profileHeaderLink}"
                   class="flex items-center gap-6 px-8 py-7 border-b border-[#ededed] hover:bg-[#faf7f4] transition">

                    <div class="w-[70px] h-[70px] rounded-full overflow-hidden border border-black/40 p-[3px] bg-white shrink-0">
                        <img src="${avatarImage}" 
                             alt="User profile"
                             class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
                    </div>

                    <div class="min-w-0">
                        <h3 class="uppercase tracking-[0.25em] text-[16px] font-medium text-black truncate">
                            ${userName}
                        </h3>

                        <p class="mt-2 text-[14px] text-[#9a9a9a] normal-case truncate">
                            ${userEmail}
                        </p>
                    </div>
                </a>

                ${isSignedIn
                    ? `
                        <div class="px-8 py-6">
                            <ul class="space-y-6 text-[13px] uppercase tracking-[0.18em]">
                                <li>
                                    <a href="${pagesPath}account.html"
                                       class="block hover:text-[#c9ab81] transition">
                                        My Account
                                    </a>
                                </li>

                                ${
                                    user.role === "admin"
                                        ? `
                                            <li>
                                                <a href="${pagesPath}admin.html"
                                                   class="block hover:text-[#c9ab81] transition">
                                                    Admin Page
                                                </a>
                                            </li>
                                        `
                                        : `
                                            <li>
                                                <a href="${pagesPath}orders.html"
                                                   class="block hover:text-[#c9ab81] transition">
                                                    Orders
                                                </a>
                                            </li>

                                            <li>
                                                <a href="${pagesPath}wishlist.html"
                                                   class="block hover:text-[#c9ab81] transition">
                                                    Wishlist
                                                </a>
                                            </li>
                                        `
                                }
                            </ul>
                        </div>

                        <div class="border-t border-[#ededed] px-8 py-5">
                            <button id="logoutBtn" type="button"
                                class="uppercase tracking-[0.18em] text-[13px] hover:text-[#c9ab81] transition">
                                Sign Out
                            </button>
                        </div>
                    `
                    : `
                        <div class="px-8 py-7">
                            <p class="text-[15px] leading-7 text-[#6f6f6f] normal-case mb-6">
                                Sign in to save your favorite ceramics, track orders, and manage your profile.
                            </p>

                            <a href="${pagesPath}signin.html"
                               class="block w-full text-center bg-black text-white py-4 uppercase tracking-[0.25em] text-[12px] hover:bg-[#c9ab81] transition mb-4">
                                Sign In
                            </a>

                            <a href="${pagesPath}signup.html"
                               class="block w-full text-center border border-black py-4 uppercase tracking-[0.25em] text-[12px] hover:border-[#c9ab81] hover:text-[#c9ab81] transition">
                                Create Account
                            </a>
                        </div>
                    `
                }
            </div>
        </div>
    `;

    const avatarButton = document.querySelector("#avatarButton");
    const userDropdown = document.querySelector("#userDropdown");
    const logoutBtn = document.querySelector("#logoutBtn");

    avatarButton.addEventListener("click", function (event) {
        event.stopPropagation();
        userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function () {
        userDropdown.classList.add("hidden");
    });

    userDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const homePath = isInsidePages ? "../../index.html" : "./index.html";

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.UsersAPI.logoutUser();
            window.location.href = homePath;
        });
    }
}

renderUserProfileMenu();