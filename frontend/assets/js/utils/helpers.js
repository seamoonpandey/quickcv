// =========================================================
// HELPERS — Quick CV
// Reusable utility functions
// =========================================================

/**
 * Show an alert box with a given message and type.
 * @param {string} elementId - ID of the alert container
 * @param {string} message - Message to display
 * @param {"success"|"error"|"info"} type - Alert type
 */
export function showAlert(elementId, message, type = "error") {
  const box = document.getElementById(elementId);
  if (!box) return;
  box.textContent = message;
  box.className = `alert alert-${type}`;
  box.classList.remove("hidden");

  // Auto-hide success alerts after 4 seconds
  if (type === "success") {
    setTimeout(() => hideAlert(elementId), 4000);
  }
}

/**
 * Hide the alert box.
 * @param {string} elementId
 */
export function hideAlert(elementId) {
  const box = document.getElementById(elementId);
  if (box) {
    box.classList.add("hidden");
    box.textContent = "";
    box.className = "alert hidden";
  }
}

/**
 * Show a field-level error message.
 * @param {string} fieldId - ID of the input field
 * @param {string} message - Error message
 */
export function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.add("is-invalid");
  if (errorEl) errorEl.textContent = message;
}

/**
 * Clear a field-level error.
 * @param {string} fieldId
 */
export function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.remove("is-invalid");
  if (errorEl) errorEl.textContent = "";
}

/**
 * Set button loading state.
 * @param {string} btnId
 * @param {boolean} isLoading
 */
export function setButtonLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const textEl = btn.querySelector(".btn-text");
  const spinnerEl = btn.querySelector(".btn-spinner");
  btn.disabled = isLoading;
  if (textEl) textEl.style.opacity = isLoading ? "0.5" : "1";
  if (spinnerEl) spinnerEl.classList.toggle("hidden", !isLoading);
}

/**
 * Format a MongoDB date string to readable format.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Format a date range (start – end or start – Present).
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */
export function formatDateRange(start, end) {
  const s = start || "";
  const e = end || "Present";
  if (!s && !e) return "";
  if (!s) return e;
  return `${s} – ${e}`;
}

/**
 * Safely get a URL query parameter.
 * @param {string} param
 * @returns {string|null}
 */
export function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay - ms
 * @returns {Function}
 */
export function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Escape HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Redirect to a page.
 * @param {string} url
 */
export function redirect(url) {
  window.location.href = url;
}