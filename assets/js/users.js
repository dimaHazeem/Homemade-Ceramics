const USERS_STORAGE_KEY = "homemadeCeramicsUsers";
const CURRENT_USER_KEY = "currentUserId";

const DEFAULT_PROFILE_IMAGE = "users-profiles/default-profile.png";

const DEFAULT_USERS = [
    {
        id: "u1",
        firstName: "Deema",
        lastName: "",
        fullName: "Deema",
        email: "deema.hazeem66@email.com",
        password: "123456",
        role: "customer",
        avatar: "users-profiles/deema.png"
    },
    {
        id: "admin-1",
        firstName: "Admin",
        lastName: "",
        fullName: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
        avatar: DEFAULT_PROFILE_IMAGE
    }
];

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function addMissingDefaultUsers(users) {
    let changed = false;

    DEFAULT_USERS.forEach(function (defaultUser) {
        const existingUser = users.find(function (user) {
            return normalizeEmail(user.email) === normalizeEmail(defaultUser.email);
        });

        if (!existingUser) {
            users.push({ ...defaultUser });
            changed = true;
        }

        /*
            This makes sure the admin account stays admin
            even if localStorage already existed before.
        */
        if (existingUser && normalizeEmail(defaultUser.email) === "admin@gmail.com") {
            existingUser.id = defaultUser.id;
            existingUser.firstName = defaultUser.firstName;
            existingUser.lastName = defaultUser.lastName;
            existingUser.fullName = defaultUser.fullName;
            existingUser.email = defaultUser.email;
            existingUser.password = defaultUser.password;
            existingUser.role = defaultUser.role;
            existingUser.avatar = defaultUser.avatar;
            changed = true;
        }
    });

    if (changed) {
        saveUsers(users);
    }

    return users;
}

function getStoredUsers() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
        const defaultUsersCopy = DEFAULT_USERS.map(function (user) {
            return { ...user };
        });

        saveUsers(defaultUsersCopy);
        return defaultUsersCopy;
    }

    try {
        const users = JSON.parse(storedUsers);

        if (!Array.isArray(users)) {
            throw new Error("Users data is not an array.");
        }

        return addMissingDefaultUsers(users);
    } catch (error) {
        const defaultUsersCopy = DEFAULT_USERS.map(function (user) {
            return { ...user };
        });

        saveUsers(defaultUsersCopy);
        return defaultUsersCopy;
    }
}

function generateUserId() {
    return "user-" + Date.now();
}

function findUserByEmail(email) {
    const users = getStoredUsers();
    const cleanEmail = normalizeEmail(email);

    return users.find(function (user) {
        return normalizeEmail(user.email) === cleanEmail;
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

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    const newUser = {
        id: generateUserId(),
        firstName: cleanFirstName,
        lastName: cleanLastName,
        fullName: `${cleanFirstName} ${cleanLastName}`.trim(),
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
        return normalizeEmail(user.email) === cleanEmail && user.id !== currentUserId;
    });

    if (emailUsedByAnotherUser) {
        return {
            success: false,
            message: "This email is already used by another account."
        };
    }

    const newFirstName = updatedData.firstName ?? users[userIndex].firstName;
    const newLastName = updatedData.lastName ?? users[userIndex].lastName;

    users[userIndex] = {
        ...users[userIndex],
        firstName: newFirstName,
        lastName: newLastName,
        fullName: `${newFirstName} ${newLastName}`.trim(),
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

function isAdmin(user) {
    return user && user.role === "admin";
}

window.UsersAPI = {
    createUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser,
    logoutUser,
    demoLogin,
    findUserByEmail,
    isAdmin,
    DEFAULT_PROFILE_IMAGE
};