// =========================================================
// PROFILE MODULE — Talentio
// Handles fetching and updating the user's profile
// =========================================================

import { apiGetProfile, apiUpdateProfile } from "../api/userApi.js";
import { apiLogout } from "../api/authApi.js";
import { showAlert, hideAlert, setButtonLoading, redirect } from "../utils/helpers.js";
import { ROUTES } from "../utils/constants.js";

async function init() {
  const res = await apiGetProfile();
  if (!res.success || !res.data) {
    redirect(ROUTES.LOGIN);
    return;
  }

  const user = res.data;
  setValue("full_name", user.full_name);
  setValue("email", user.email);

  const form = document.getElementById("profile-form");
  form?.addEventListener("submit", handleSubmit);

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await apiLogout();
    redirect(ROUTES.LOGIN);
  });
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

async function handleSubmit(e) {
  e.preventDefault();
  hideAlert("alert-box");
  setButtonLoading("save-btn", true);

  const full_name = document.getElementById("full_name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const current_password = document.getElementById("current_password")?.value.trim();
  const new_password = document.getElementById("new_password")?.value.trim();
  const confirm_password = document.getElementById("confirm_password")?.value.trim();

  if (!full_name) {
    setButtonLoading("save-btn", false);
    showAlert("alert-box", "Full name is required.", "error");
    return;
  }

  if (!email) {
    setButtonLoading("save-btn", false);
    showAlert("alert-box", "Email is required.", "error");
    return;
  }

  if (new_password && new_password !== confirm_password) {
    setButtonLoading("save-btn", false);
    showAlert("alert-box", "New password and confirmation do not match.", "error");
    return;
  }

  if (new_password && !current_password) {
    setButtonLoading("save-btn", false);
    showAlert("alert-box", "Please enter your current password to set a new one.", "error");
    return;
  }

  const payload = { full_name, email };
  if (current_password) payload.current_password = current_password;
  if (new_password) payload.new_password = new_password;

  const res = await apiUpdateProfile(payload);
  setButtonLoading("save-btn", false);

  if (!res.success) {
    showAlert("alert-box", res.message || "Could not update profile.", "error");
    return;
  }

  showAlert("alert-box", "Profile updated successfully.", "success");

  // Clear password fields
  setValue("current_password", "");
  setValue("new_password", "");
  setValue("confirm_password", "");
}

init();
