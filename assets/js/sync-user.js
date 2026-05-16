async function syncFirebaseUserToMySQL(user) {
    if (!user) {
        return;
    }

    const userData = {
        firebase_uid: user.uid,
        full_name: user.displayName || "Bridge Customer",
        email: user.email
    };

    try {
        const response = await fetch("/webProj/Homemade-Ceramics/backend/auth/sync-user.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!result.success) {
            console.error("User sync failed:", result.message);
        }

    } catch (error) {
        console.error("User sync error:", error);
    }
}

window.syncFirebaseUserToMySQL = syncFirebaseUserToMySQL;