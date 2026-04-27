// =========================================================
// UPLOAD API — Talentio
// Local/Cloud upload helpers
// =========================================================

import { API_BASE } from "../utils/constants.js";

const CREDENTIALS = "include";

/**
 * Get upload backend mode.
 * @returns {Promise<{success:boolean, data:{storage:string}|null, message?:string}>}
 */
export async function apiGetUploadConfig() {
  try {
    const res = await fetch(`${API_BASE}/uploads/config`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[uploadApi] Config error:", err);
    return { success: false, data: null, message: "Network error." };
  }
}

/**
 * Get signed Cloudinary upload parameters from the backend.
 * @returns {Promise<{success: boolean, data: {cloud_name:string, api_key:string, timestamp:number, signature:string, folder:string}|null, message?:string}>}
 */
export async function apiGetCloudinarySignature() {
  try {
    const res = await fetch(`${API_BASE}/uploads/cloudinary-signature`, {
      credentials: CREDENTIALS,
    });
    return await res.json();
  } catch (err) {
    console.error("[uploadApi] Signature error:", err);
    return { success: false, data: null, message: "Network error." };
  }
}

/**
 * Upload an image file to Cloudinary using signed params.
 * @param {File} file
 * @param {{cloud_name:string, api_key:string, timestamp:number, signature:string, folder:string}} sig
 * @returns {Promise<any>} Cloudinary response
 */
export async function apiUploadImageToCloudinary(file, sig) {
  const url = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.api_key);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  return await res.json();
}

/**
 * Upload an image file to local backend storage.
 * @param {File} file
 * @returns {Promise<{success:boolean,data:{url:string,path:string,storage:string}|null,message?:string}>}
 */
export async function apiUploadImageLocal(file) {
  try {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/uploads/profile-image`, {
      method: "POST",
      credentials: CREDENTIALS,
      body: form,
    });
    return await res.json();
  } catch (err) {
    console.error("[uploadApi] Local upload error:", err);
    return { success: false, data: null, message: "Network error." };
  }
}
