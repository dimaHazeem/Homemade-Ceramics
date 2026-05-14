const USERS_STORAGE_KEY = "homemadeCeramicsUsers";
const CURRENT_USER_KEY = "currentUserId";

const DEFAULT_PROFILE_IMAGE = "users-profiles/default-profile.png";

const DEFAULT_USERS = [
    {
        id: "u1",
        firstName: "Deema",
        lastName: "",
        fullName: "Deema",
        email: "deema@email.com",
        password: "123456",
        role: "customer",
        avatar: "users-profiles/deema.png"
    }
];

function getStoredUsers() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
    }

    return JSON.parse(storedUsers);
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function generateUserId() {
    return "user-" + Date.now();
}

function findUserByEmail(email) {
    const users = getStoredUsers();
    const cleanEmail = normalizeEmail(email);

    return users.find(function (user) {
        return user.email === cleanEmail;
    });
}

function createUser(firstName, lastName, email, password) {
    const users = getStoredUsers();
    const cleanEmail = normalizeEmail(email);

    const existingUser = findUserByEmail(cleanEmail);

    if (existingUser) {
        return {
            success: false,
            message: "This email already has an account."
        };
    }

    const newUser = {
        id: generateUserId(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: cleanEmail,
        password: password,
        role: "customer",
        avatar: DEFAULT_PROFILE_IMAGE,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(CURRENT_USER_KEY, newUser.id);

    return {
        success: true,
        user: newUser
    };
}

function loginUser(email, password) {
    const user = findUserByEmail(email);

    if (!user) {
        return {
            success: false,
            message: "No account was found with this email."
        };
    }

    if (user.password !== password) {
        return {
            success: false,
            message: "Incorrect password."
        };
    }

    localStorage.setItem(CURRENT_USER_KEY, user.id);

    return {
        success: true,
        user: user
    };
}

async function getCurrentUser() {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);

    if (!currentUserId) {
        return null;
    }

    const users = getStoredUsers();

    const user = users.find(function (user) {
        return user.id === currentUserId;
    });

    return user || null;
}

function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

/* Optional test login without console later */
function demoLogin() {
    localStorage.setItem(CURRENT_USER_KEY, "u1");
    location.reload();
}

function updateCurrentUser(updatedData) {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);

    if (!currentUserId) {
        return {
            success: false,
            message: "No user is signed in."
        };
    }

    const users = getStoredUsers();

    const userIndex = users.findIndex(function (user) {
        return user.id === currentUserId;
    });

    if (userIndex === -1) {
        return {
            success: false,
            message: "User was not found."
        };
    }

    const cleanEmail = updatedData.email
        ? normalizeEmail(updatedData.email)
        : users[userIndex].email;

    const emailUsedByAnotherUser = users.some(function (user) {
        return user.email === cleanEmail && user.id !== currentUserId;
    });

    if (emailUsedByAnotherUser) {
        return {
            success: false,
            message: "This email is already used by another account."
        };
    }

    users[userIndex] = {
        ...users[userIndex],
        firstName: updatedData.firstName ?? users[userIndex].firstName,
        lastName: updatedData.lastName ?? users[userIndex].lastName,
        fullName: updatedData.firstName || updatedData.lastName
            ? `${updatedData.firstName ?? users[userIndex].firstName} ${updatedData.lastName ?? users[userIndex].lastName}`.trim()
            : users[userIndex].fullName,
        email: updatedData.email ? cleanEmail : users[userIndex].email,
        phone: updatedData.phone ?? users[userIndex].phone,
        city: updatedData.city ?? users[userIndex].city,
        address: updatedData.address ?? users[userIndex].address,
        avatarData: updatedData.avatarData ?? users[userIndex].avatarData
    };

    saveUsers(users);

    return {
        success: true,
        user: users[userIndex]
    };
}

window.UsersAPI = {
    createUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser,
    logoutUser,
    demoLogin,
    findUserByEmail,
    DEFAULT_PROFILE_IMAGE
};