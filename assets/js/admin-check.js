import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

onAuthStateChanged(auth, async function (user) {
    if (!user) {
        window.location.replace("./signin.html");
        return;
    }

    try {
        const response = await fetch("/webProj/Homemade-Ceramics/backend/auth/get-user-role.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firebase_uid: user.uid
            })
        });

        const result = await response.json();

        if (!result.success || result.role !== "admin") {
            alert("Access denied. Admins only.");
            window.location.replace("./account.html");
            return;
        }

        console.log("Admin access granted.");

    } catch (error) {
        console.error("Admin check error:", error);
        window.location.replace("./account.html");
    }
});