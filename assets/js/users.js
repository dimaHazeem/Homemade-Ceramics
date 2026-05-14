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

window.UsersAPI = {
    createUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    demoLogin,
    findUserByEmail,
    DEFAULT_PROFILE_IMAGE
};