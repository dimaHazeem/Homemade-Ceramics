const themeToggleBtn = document.getElementById("themeToggleBtn");

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

const savedTheme = localStorage.getItem("bridgeTheme");

if (savedTheme) {
    applyTheme(savedTheme);
}

if (themeToggleBtn) {

    themeToggleBtn.addEventListener("click", function () {

        const isDark =
            document.body.classList.contains("dark-mode");

        if (isDark) {

            document.body.classList.remove("dark-mode");

            localStorage.setItem(
                "bridgeTheme",
                "light"
            );

        } else {

            document.body.classList.add("dark-mode");

            localStorage.setItem(
                "bridgeTheme",
                "dark"
            );
        }
    });
}