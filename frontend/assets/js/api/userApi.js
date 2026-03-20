// =========================================================
// USER API — Talentio
// Profile-related API calls
// =========================================================

import { API_BASE } from "../utils/constants.js";

const CREDENTIALS = "include";

export async function apiGetProfile() {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[userApi] GetProfile error:", err);
    return { success: false, data: null, message: "Network error." };
  }
}

export async function apiUpdateProfile(payload) {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: CREDENTIALS,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error("[userApi] UpdateProfile error:", err);
    return { success: false, message: "Network error." };
  }
}
