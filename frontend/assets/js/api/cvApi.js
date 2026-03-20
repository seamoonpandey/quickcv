// =========================================================
// CV API — Talentio
// Handles all CV-related API calls to the Flask backend
// =========================================================

import { API_BASE } from "../utils/constants.js";

const CREDENTIALS = "include";

/**
 * Get all CVs for the current user.
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export async function apiGetCVs() {
  try {
    const res = await fetch(`${API_BASE}/cvs/`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[cvApi] GetCVs error:", err);
    return { success: false, data: [] };
  }
}

/**
 * Get a single CV by ID.
 * @param {string} cvId
 * @returns {Promise<{success: boolean, data: object|null}>}
 */
export async function apiGetCV(cvId) {
  try {
    const res = await fetch(`${API_BASE}/cvs/${cvId}`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[cvApi] GetCV error:", err);
    return { success: false, data: null };
  }
}

/**
 * Create a new CV.
 * @param {object} cvData
 * @returns {Promise<{success: boolean, data: object|null}>}
 */
export async function apiCreateCV(cvData) {
  try {
    const res = await fetch(`${API_BASE}/cvs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: CREDENTIALS,
      body: JSON.stringify(cvData),
    });
    return await res.json();
  } catch (err) {
    console.error("[cvApi] CreateCV error:", err);
    return { success: false, data: null };
  }
}

/**
 * Update an existing CV.
 * @param {string} cvId
 * @param {object} cvData
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function apiUpdateCV(cvId, cvData) {
  try {
    const res = await fetch(`${API_BASE}/cvs/${cvId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: CREDENTIALS,
      body: JSON.stringify(cvData),
    });
    return await res.json();
  } catch (err) {
    console.error("[cvApi] UpdateCV error:", err);
    return { success: false, message: "Network error." };
  }
}

/**
 * Delete a CV.
 * @param {string} cvId
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function apiDeleteCV(cvId) {
  try {
    const res = await fetch(`${API_BASE}/cvs/${cvId}`, {
      method: "DELETE",
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[cvApi] DeleteCV error:", err);
    return { success: false, message: "Network error." };
  }
}