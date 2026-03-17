// =========================================================
// HOME GUARD — Quick CV
// Redirects logged-in users away from the marketing page
// =========================================================

import { apiGetMe } from "../api/authApi.js";
import { redirect } from "../utils/helpers.js";
import { ROUTES } from "../utils/constants.js";

(async function guardHomeForAuthenticatedUser() {
  try {
    const res = await apiGetMe();
    if (res?.success) {
      redirect(ROUTES.DASHBOARD);
    }
  } catch (err) {
    console.error("[homeGuard] Failed to check auth state", err);
  }
})();
