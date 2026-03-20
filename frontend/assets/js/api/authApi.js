// =========================================================
// AUTH API — Talentio
// Handles all auth-related API calls to the Flask backend
// =========================================================

import { API_BASE } from "../utils/constants.js";

const CREDENTIALS = "include"; // Send session cookies

/**
 * Register a new user.
 * @param {string} full_name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, message: string, data: object|null}>}
 */
export async function apiRegister(full_name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: CREDENTIALS,
      body: JSON.stringify({ full_name, email, password }),
    });
    return await res.json();
  } catch (err) {
    console.error("[authApi] Register error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}

/**
 * Log in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, message: string, data: object|null}>}
 */
export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: CREDENTIALS,
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    console.error("[authApi] Login error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}

/**
 * Log out the current user.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function apiLogout() {
  try {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[authApi] Logout error:", err);
    return { success: false, message: "Network error." };
  }
}

/**
 * Get the currently logged-in user.
 * @returns {Promise<{success: boolean, data: object|null}>}
 */
export async function apiGetMe() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[authApi] GetMe error:", err);
    return { success: false, data: null };
  }
}