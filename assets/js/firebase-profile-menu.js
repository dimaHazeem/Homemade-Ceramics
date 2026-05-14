import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const userProfileMenu = document.getElementById("userProfileMenu");

if (userProfileMenu) {
    const isInsidePages = window.location.pathname.includes("/assets/pages/");

    const assetsPath = isInsidePages ? "../" : "./assets/";
    const pagesPath = isInsidePages ? "./" : "./assets/pages/";

    onAuthStateChanged(auth, function (user) {
        if (user) {
            userProfileMenu.innerHTML = `
                <div class="relative hidden md:block group">
                    <button class="w-11 h-11 rounded-full overflow-hidden border border-black/40 bg-white p-[2px] hover:border-[#e2b7a8] transition">
                        <img src="${user.photoURL || assetsPath + "images/users-profiles/default-profile.png"}"
                            alt="User profile"
                            class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
                    </button>

                    <div class="absolute right-0 top-full mt-6 w-[400px] bg-white border border-[#ededed] shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <a href="${pagesPath}account.html"
                            class="flex items-center gap-6 px-8 py-7 border-b border-[#ededed] hover:bg-[#faf7f4] transition">

                            <div class="w-[70px] h-[70px] rounded-full overflow-hidden border border-black/40 p-[3px] bg-white shrink-0">
                                <img src="${user.photoURL || assetsPath + "images/users-profiles/default-profile.png"}"
                                    alt="User profile"
                                    class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
                            </div>

                            <div class="min-w-0">
                                <h3 class="uppercase tracking-[0.25em] text-[16px] font-medium text-black truncate">
                                    ${user.displayName || "Bridge Customer"}
                                </h3>

                                <p class="mt-2 text-[14px] text-[#9a9a9a] normal-case truncate">
                                    ${user.email}
                                </p>
                            </div>
                        </a>

                        <div class="px-8 py-6">
                            <ul class="space-y-6 text-[13px] uppercase tracking-[0.18em]">
                                <li>
                                    <a href="${pagesPath}account.html" class="block hover:text-[#c9ab81] transition">
                                        My Account
                                    </a>
                                </li>

                                <li>
                                    <a href="${pagesPath}orders.html" class="block hover:text-[#c9ab81] transition">
                                        Orders
                                    </a>
                                </li>

                                <li>
                                    <a href="${pagesPath}wishlist.html" class="block hover:text-[#c9ab81] transition">
                                        Wishlist
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div class="border-t border-[#ededed] px-8 py-5">
                            <button id="firebaseLogoutBtn" type="button"
                                class="uppercase tracking-[0.18em] text-[13px] hover:text-[#c9ab81] transition">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("firebaseLogoutBtn").addEventListener("click", async function () {
                await signOut(auth);

                localStorage.removeItem("cart");
                localStorage.removeItem("wishlist");

                window.location.href = isInsidePages ? "../../index.html" : "./index.html";
            });

        } else {
            userProfileMenu.innerHTML = `
                <div class="relative hidden md:block group">
                    <button class="w-11 h-11 rounded-full overflow-hidden border border-black/40 bg-white p-[2px] hover:border-[#e2b7a8] transition">
                        <img src="${assetsPath}images/users-profiles/default-profile.png"
                            alt="Guest profile"
                            class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
                    </button>

                    <div class="absolute right-0 top-full mt-6 w-[400px] bg-white border border-[#ededed] shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <a href="${pagesPath}signin.html"
                            class="flex items-center gap-6 px-8 py-7 border-b border-[#ededed] hover:bg-[#faf7f4] transition">

                            <div class="w-[70px] h-[70px] rounded-full overflow-hidden border border-black/40 p-[3px] bg-white shrink-0">
                                <img src="${assetsPath}images/users-profiles/default-profile.png"
                                    alt="Guest profile"
                                    class="w-full h-full rounded-full object-cover bg-[#f3f1ee]">
                            </div>

                            <div>
                                <h3 class="uppercase tracking-[0.25em] text-[16px] font-medium text-black">
                                    Guest
                                </h3>

                                <p class="mt-2 text-[14px] text-[#9a9a9a] normal-case">
                                    Sign in to your account
                                </p>
                            </div>
                        </a>

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
                    </div>
                </div>
            `;
        }
    });
}