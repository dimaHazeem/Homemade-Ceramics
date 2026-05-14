async function loadAccountPage() {
    if (!window.UsersAPI) {
        return;
    }

    const user = await window.UsersAPI.getCurrentUser();

    if (!user) {
        window.location.href = "./signin.html";
        return;
    }

    const accountAvatar = document.getElementById("accountAvatar");
    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");

    const firstNameInput = document.getElementById("accountFirstName");
    const lastNameInput = document.getElementById("accountLastName");
    const emailInput = document.getElementById("accountEmailInput");
    const phoneInput = document.getElementById("accountPhone");
    const cityInput = document.getElementById("accountCity");
    const addressInput = document.getElementById("accountAddress");

    const accountForm = document.getElementById("accountForm");
    const saveMessage = document.getElementById("saveMessage");
    const logoutBtn = document.getElementById("accountLogoutBtn");

    const avatarUploadButton = document.getElementById("avatarUploadButton");
    const avatarInput = document.getElementById("avatarInput");

    const saveAccountBtn = document.getElementById("saveAccountBtn");
    const accountSubmitLoader = document.getElementById("accountSubmitLoader");
    const accountSubmitLoaderText = document.getElementById("accountSubmitLoaderText");

    const avatarPath = user.avatarData
        ? user.avatarData
        : user.avatar
            ? `../images/${user.avatar}`
            : `../images/${window.UsersAPI.DEFAULT_PROFILE_IMAGE}`;

    accountAvatar.src = avatarPath;
    accountName.textContent = user.fullName || "Customer";
    accountEmail.textContent = user.email || "";

    firstNameInput.value = user.firstName || "";
    lastNameInput.value = user.lastName || "";
    emailInput.value = user.email || "";
    phoneInput.value = user.phone || "";
    cityInput.value = user.city || "";
    addressInput.value = user.address || "";
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

            const result = window.UsersAPI.updateCurrentUser({
                avatarData: imageData
            });

            if (!result.success) {
                alert(result.message);
                return;
            }

            if (typeof renderUserProfileMenu === "function") {
                renderUserProfileMenu();
            }
        });

        reader.readAsDataURL(file);
    });

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

function updateCommunityCounts(user) {
    const posts = getStorageArray("homemadeCeramicsPosts");
    const postLikes = getStorageArray("homemadeCeramicsPostLikes");
    const postSaves = getStorageArray("homemadeCeramicsPostSaves");
    const comments = getStorageArray("homemadeCeramicsComments");

    const myPostsCount = posts.filter(function (post) {
        return post.userId === user.id;
    }).length;

    const likedPostsCount = postLikes.filter(function (like) {
        return like.userId === user.id;
    }).length;

    const savedPostsCount = postSaves.filter(function (save) {
        return save.userId === user.id;
    }).length;

    const myCommentsCount = comments.filter(function (comment) {
        return comment.userId === user.id;
    }).length;

    document.getElementById("myPostsCount").textContent = myPostsCount;
    document.getElementById("likedPostsCount").textContent = likedPostsCount;
    document.getElementById("savedPostsCount").textContent = savedPostsCount;
    document.getElementById("myCommentsCount").textContent = myCommentsCount;
}

    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        saveAccountBtn.disabled = true;
        accountSubmitLoaderText.textContent = "Saving Changes";
        accountSubmitLoader.classList.add("show");

        const updatedUser = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            phone: phoneInput.value.trim(),
            city: cityInput.value.trim(),
            address: addressInput.value.trim()
        };

        const result = window.UsersAPI.updateCurrentUser(updatedUser);

        if (!result.success) {
            alert(result.message);

            saveAccountBtn.disabled = false;
            accountSubmitLoader.classList.remove("show");

            return;
        }

        accountName.textContent = result.user.fullName || "Customer";
        accountEmail.textContent = result.user.email || "";

        if (typeof renderUserProfileMenu === "function") {
            renderUserProfileMenu();
        }

        saveMessage.textContent = "Changes saved successfully. Returning to home...";
        saveMessage.classList.remove("hidden");

        accountSubmitLoaderText.textContent = "Saved Successfully";

        setTimeout(function () {
            window.location.href = "../../index.html";
        }, 1800);
    });

    logoutBtn.addEventListener("click", function () {
        window.UsersAPI.logoutUser();
        window.location.href = "../../index.html";
    });
}

loadAccountPage();