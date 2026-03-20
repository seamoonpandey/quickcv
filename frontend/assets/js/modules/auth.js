// =========================================================
// AUTH MODULE — Talentio
// Handles register and login page logic
// =========================================================

import { apiRegister, apiLogin, apiGetMe } from "../api/authApi.js";
import { validateRegisterForm, validateLoginForm } from "./validation.js";
import {
  showAlert,
  hideAlert,
  setButtonLoading,
  redirect,
  clearFieldError,
} from "../utils/helpers.js";
import { ROUTES } from "../utils/constants.js";

// ── Guard: redirect if already logged in ──────────────────
async function guardAlreadyLoggedIn() {
  const res = await apiGetMe();
  if (res.success) {
    redirect(ROUTES.DASHBOARD);
  }
}

guardAlreadyLoggedIn();

// ── Password Toggle ────────────────────────────────────────
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "🙈" : "👁️";
    btn.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });
});

// ── REGISTER FORM ─────────────────────────────────────────
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert("alert-box");

    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Client-side validation
    const isValid = validateRegisterForm(
      fullName,
      email,
      password,
      confirmPassword
    );
    if (!isValid) return;

    setButtonLoading("register-btn", true);

    const result = await apiRegister(fullName, email, password);

    setButtonLoading("register-btn", false);

    if (result.success) {
      showAlert("alert-box", "Account created! Redirecting...", "success");
      setTimeout(() => redirect(ROUTES.DASHBOARD), 1200);
    } else {
      showAlert("alert-box", result.message || "Registration failed.", "error");
    }
  });

  // Live clear field errors on input
  ["full-name", "email", "password", "confirm-password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearFieldError(id));
  });
}

// ── LOGIN FORM ────────────────────────────────────────────
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert("alert-box");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const isValid = validateLoginForm(email, password);
    if (!isValid) return;

    setButtonLoading("login-btn", true);

    const result = await apiLogin(email, password);

    setButtonLoading("login-btn", false);

    if (result.success) {
      showAlert("alert-box", "Logged in! Redirecting...", "success");
      setTimeout(() => redirect(ROUTES.DASHBOARD), 1000);
    } else {
      showAlert("alert-box", result.message || "Login failed.", "error");
    }
  });

  ["email", "password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearFieldError(id));
  });
}