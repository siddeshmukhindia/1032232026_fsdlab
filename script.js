// Track button clicks (future analytics use)
function trackEvent(type) {
    console.log(`${type} button clicked`);
    alert(`${type} section will be added later`);
}

// Registration Form Validation
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    clearErrors();

    if (name === "") {
        showError("nameError", "Name is required");
        valid = false;
    }

    if (!/^\d{10}$/.test(mobile)) {
        showError("mobileError", "Mobile number must be 10 digits");
        valid = false;
    }

    if (!email.includes("@")) {
        showError("emailError", "Invalid email format");
        valid = false;
    }

    if (password.length < 6) {
        showError("passwordError", "Password must be at least 6 characters");
        valid = false;
    }

    if (password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords do not match");
        valid = false;
    }

    if (valid) {
        alert("Registration successful!");
        document.getElementById("registerForm").reset();
    }
});

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(err => err.textContent = "");
}
