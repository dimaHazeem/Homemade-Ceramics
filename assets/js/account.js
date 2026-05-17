import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const DEFAULT_AVATAR = "../images/users-profiles/default-profile.png";

function getElement(id) {
    return document.getElementById(id);
}

function splitName(fullName) {
    const parts = (fullName || "").trim().split(" ");

    return {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || ""
    };
}

function getStorageArray(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function getAvatarKey(user) {
    return `bridgeAccountAvatar_${user.uid}`;
}

function getProfileKey(user) {
    return `bridgeAccountProfile_${user.uid}`;
}

function getProfile(user) {
    const savedProfile = localStorage.getItem(getProfileKey(user));

    if (!savedProfile) {
        return null;
    }

    try {
        return JSON.parse(savedProfile);
    } catch (error) {
        return null;
    }
}

function getAvatar(user) {
    const savedAvatar = localStorage.getItem(getAvatarKey(user));

    if (savedAvatar) {
        return savedAvatar;
    }

    if (user.photoURL) {
        return user.photoURL;
    }

    return DEFAULT_AVATAR;
}

function updateCommunityCounts(user) {
    const posts = getStorageArray("homemadeCeramicsPosts");
    const postLikes = getStorageArray("homemadeCeramicsPostLikes");
    const postSaves = getStorageArray("homemadeCeramicsPostSaves");
    const comments = getStorageArray("homemadeCeramicsComments");

    const myPostsCount = posts.filter(function (post) {
        return post.userId === user.uid || post.userEmail === user.email;
    }).length;

    const likedPostsCount = postLikes.filter(function (like) {
        return like.userId === user.uid || like.userEmail === user.email;
    }).length;

    const savedPostsCount = postSaves.filter(function (save) {
        return save.userId === user.uid || save.userEmail === user.email;
    }).length;

    const myCommentsCount = comments.filter(function (comment) {
        return comment.userId === user.uid || comment.userEmail === user.email;
    }).length;

    const myPostsCountEl = getElement("myPostsCount");
    const likedPostsCountEl = getElement("likedPostsCount");
    const savedPostsCountEl = getElement("savedPostsCount");
    const myCommentsCountEl = getElement("myCommentsCount");

    if (myPostsCountEl) myPostsCountEl.textContent = myPostsCount;
    if (likedPostsCountEl) likedPostsCountEl.textContent = likedPostsCount;
    if (savedPostsCountEl) savedPostsCountEl.textContent = savedPostsCount;
    if (myCommentsCountEl) myCommentsCountEl.textContent = myCommentsCount;
}

async function syncFirebaseUserToMySQL(user) {
    try {
        const response = await fetch("../../backend/auth/sync-user.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firebase_uid: user.uid,
                full_name: user.displayName || "Bridge Customer",
                email: user.email
            })
        });

        const result = await response.json();

        console.log("Database sync result:", result);
    } catch (error) {
        console.error("Database sync failed:", error);
    }
}

function loadAccount(user) {
    const accountAvatar = getElement("accountAvatar");
    const accountName = getElement("accountName");
    const accountEmail = getElement("accountEmail");

    const firstNameInput = getElement("accountFirstName");
    const lastNameInput = getElement("accountLastName");
    const emailInput = getElement("accountEmailInput");
    const phoneInput = getElement("accountPhone");
    const cityInput = getElement("accountCity");
    const addressInput = getElement("accountAddress");

    const avatarUploadButton = getElement("avatarUploadButton");
    const avatarInput = getElement("avatarInput");

    const accountForm = getElement("accountForm");
    const saveMessage = getElement("saveMessage");
    const logoutBtn = getElement("accountLogoutBtn");

    const saveAccountBtn = getElement("saveAccountBtn");
    const accountSubmitLoader = getElement("accountSubmitLoader");
    const accountSubmitLoaderText = getElement("accountSubmitLoaderText");

    const savedProfile = getProfile(user);

    const firebaseName = user.displayName || "Bridge Customer";
    const fullName = savedProfile?.fullName || firebaseName;
    const nameParts = splitName(fullName);

    accountAvatar.src = getAvatar(user);

    accountAvatar.onerror = function () {
        accountAvatar.src = DEFAULT_AVATAR;
    };

    accountName.textContent = fullName;
    accountEmail.textContent = user.email || "";

    firstNameInput.value = savedProfile?.firstName || nameParts.firstName;
    lastNameInput.value = savedProfile?.lastName || nameParts.lastName;
    emailInput.value = user.email || "";
    phoneInput.value = savedProfile?.phone || "";
    cityInput.value = savedProfile?.city || "";
    addressInput.value = savedProfile?.address || "";

    updateCommunityCounts(user);

    avatarUploadButton.addEventListener("click", function () {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", function () {
        const file = avatarInput.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");
            return;
        }

        if (file.size > 1024 * 1024) {
            alert("Image is too large. Please choose an image smaller than 1MB.");
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", function () {
            const imageData = reader.result;

            accountAvatar.src = imageData;
            localStorage.setItem(getAvatarKey(user), imageData);
        });

        reader.readAsDataURL(file);
    });

    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const fullName = `${firstName} ${lastName}`.trim() || "Bridge Customer";

        const profileData = {
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            email: emailInput.value.trim().toLowerCase(),
            phone: phoneInput.value.trim(),
            city: cityInput.value.trim(),
            address: addressInput.value.trim()
        };

        if (saveAccountBtn) {
            saveAccountBtn.disabled = true;
        }

        if (accountSubmitLoaderText) {
            accountSubmitLoaderText.textContent = "Saving Changes";
        }

        if (accountSubmitLoader) {
            accountSubmitLoader.classList.add("show");
        }

        localStorage.setItem(getProfileKey(user), JSON.stringify(profileData));

        accountName.textContent = fullName;
        accountEmail.textContent = profileData.email;

        if (saveMessage) {
            saveMessage.textContent = "Changes saved successfully.";
            saveMessage.classList.remove("hidden");
        }

        if (accountSubmitLoaderText) {
            accountSubmitLoaderText.textContent = "Saved Successfully";
        }

        setTimeout(function () {
            if (saveAccountBtn) {
                saveAccountBtn.disabled = false;
            }

            if (accountSubmitLoader) {
                accountSubmitLoader.classList.remove("show");
            }

            if (saveMessage) {
                saveMessage.classList.add("hidden");
            }
        }, 1200);
    });

    logoutBtn.addEventListener("click", async function () {
        await signOut(auth);

        localStorage.removeItem("bridgeCustomerName");
        localStorage.removeItem("bridgeCustomerEmail");
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");

        window.location.replace("./signin.html");
    });
}

onAuthStateChanged(auth, function (user) {
    if (!user) {
        window.location.replace("./signin.html");
        return;
    }

    console.log("Account Firebase user:", user);

    loadAccount(user);

    syncFirebaseUserToMySQL(user);
});