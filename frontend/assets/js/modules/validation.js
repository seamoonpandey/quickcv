// =========================================================
// VALIDATION — Quick CV
// Client-side form validation helpers
// =========================================================

import { showFieldError, clearFieldError } from "../utils/helpers.js";

/**
 * Validate the register form fields.
 * @param {string} fullName
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean} isValid
 */
export function validateRegisterForm(fullName, email, password, confirmPassword) {
  let isValid = true;

  // Full Name
  clearFieldError("full-name");
  if (!fullName.trim()) {
    showFieldError("full-name", "Full name is required.");
    isValid = false;
  } else if (fullName.trim().length < 2) {
    showFieldError("full-name", "Name must be at least 2 characters.");
    isValid = false;
  }

  // Email
  clearFieldError("email");
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  if (!email.trim()) {
    showFieldError("email", "Email address is required.");
    isValid = false;
  } else if (!emailRegex.test(email.trim())) {
    showFieldError("email", "Please enter a valid email address.");
    isValid = false;
  }

  // Password
  clearFieldError("password");
  if (!password) {
    showFieldError("password", "Password is required.");
    isValid = false;
  } else if (password.length < 8) {
    showFieldError("password", "Password must be at least 8 characters.");
    isValid = false;
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    showFieldError("password", "Password must include a letter and a number.");
    isValid = false;
  }

  // Confirm Password
  clearFieldError("confirm-password");
  if (!confirmPassword) {
    showFieldError("confirm-password", "Please confirm your password.");
    isValid = false;
  } else if (password !== confirmPassword) {
    showFieldError("confirm-password", "Passwords do not match.");
    isValid = false;
  }

  return isValid;
}

/**
 * Validate the login form fields.
 * @param {string} email
 * @param {string} password
 * @returns {boolean} isValid
 */
export function validateLoginForm(email, password) {
  let isValid = true;

  clearFieldError("email");
  clearFieldError("password");

  if (!email.trim()) {
    showFieldError("email", "Email address is required.");
    isValid = false;
  }

  if (!password) {
    showFieldError("password", "Password is required.");
    isValid = false;
  }

  return isValid;
}