const AFTER_LOGIN_PAGE = "./account.html";
const AFTER_AUTH_PAGE = "../../index.html";

function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}

function showError(errorElement, message) {
    if (!errorElement) return;

    if (message) {
        errorElement.textContent = message;
    }

    errorElement.classList.add("show");
}

function hideError(errorElement) {
    if (!errorElement) return;
    errorElement.classList.remove("show");
}

function setupPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) {
        return;
    }

    button.addEventListener("click", function () {
        const visible = input.type === "text";

        input.type = visible ? "password" : "text";
        button.textContent = visible ? "Show" : "Hide";
    });
}

function setupSigninForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    setupPasswordToggle("password", "togglePassword");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let valid = true;

        hideError(emailError);
        hideError(passwordError);

        const emailValue = email.value.trim();
        const passwordValue = password.value;

        if (!isValidEmail(emailValue)) {
            showError(emailError, "Please enter a valid email address.");
            valid = false;
        }

        if (passwordValue.length < 6) {
            showError(passwordError, "Password must be at least 6 characters.");
            valid = false;
        }

        if (!valid) {
            return;
        }

        const result = window.UsersAPI.loginUser(emailValue, passwordValue);

        if (!result.success) {
            showError(passwordError, result.message);
            return;
        }

        window.location.href = AFTER_AUTH_PAGE;
    });
}

function setupSignupForm() {
    const signupForm = document.getElementById("signupForm");

    if (!signupForm) {
        return;
    }

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    const firstNameError = document.getElementById("firstNameError");
    const lastNameError = document.getElementById("lastNameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");

    setupPasswordToggle("password", "togglePassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let valid = true;

        hideError(firstNameError);
        hideError(lastNameError);
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);
        hideError(termsError);

        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;

        if (firstNameValue === "") {
            showError(firstNameError, "First name is required.");
            valid = false;
        }

        if (lastNameValue === "") {
            showError(lastNameError, "Last name is required.");
            valid = false;
        }

        if (!isValidEmail(emailValue)) {
            showError(emailError, "Please enter a valid email address.");
            valid = false;
        }

        if (passwordValue.length < 6) {
            showError(passwordError, "Password must be at least 6 characters.");
            valid = false;
        }

        if (confirmPasswordValue !== passwordValue || confirmPasswordValue === "") {
            showError(confirmPasswordError, "Passwords do not match.");
            valid = false;
        }

        if (!terms.checked) {
            showError(termsError, "Please agree before creating your account.");
            valid = false;
        }

        if (!valid) {
            return;
        }

        const result = window.UsersAPI.createUser(
            firstNameValue,
            lastNameValue,
            emailValue,
            passwordValue
        );

        if (!result.success) {
            showError(emailError, result.message);
            return;
        }

        window.location.href = AFTER_LOGIN_PAGE;
    });
}

setupSigninForm();
setupSignupForm();