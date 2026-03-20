// =========================================================
// DASHBOARD MODULE — Talentio
// Loads and manages the user's CV list
// =========================================================

import { apiGetMe, apiLogout } from "../api/authApi.js";
import { apiGetCVs, apiDeleteCV, apiCreateCV } from "../api/cvApi.js";
import {
  showAlert,
  hideAlert,
  formatDate,
  redirect,
  escapeHtml,
} from "../utils/helpers.js";
import { ROUTES, DEFAULT_CV } from "../utils/constants.js";

let cvToDelete = null;

// ── Auth Guard ─────────────────────────────────────────────
async function init() {
  const meRes = await apiGetMe();
  if (!meRes.success) {
    redirect(ROUTES.LOGIN);
    return;
  }

  const user = meRes.data;

  // Set greeting
  const greeting = document.getElementById("dashboard-greeting");
  if (greeting) greeting.textContent = `Welcome, ${user.full_name} 👋`;

  const navName = document.getElementById("nav-user-name");
  if (navName) navName.textContent = user.full_name;

  await loadCVs();
}

// ── Load CVs ───────────────────────────────────────────────
async function loadCVs() {
  showLoading(true);

  const res = await apiGetCVs();

  showLoading(false);

  if (!res.success) {
    showAlert("alert-box", "Failed to load your CVs. Please refresh.", "error");
    return;
  }

  const cvs = res.data;

  if (!cvs || cvs.length === 0) {
    showEmptyState(true);
    return;
  }

  showEmptyState(false);
  renderCVGrid(cvs);
}

// ── Render CV Cards ────────────────────────────────────────
function renderCVGrid(cvs) {
  const grid = document.getElementById("cv-grid");
  if (!grid) return;

  grid.innerHTML = "";
  grid.classList.remove("hidden");

  cvs.forEach((cv) => {
    const card = document.createElement("article");
    card.className = "cv-card";
    card.setAttribute("aria-label", `CV: ${escapeHtml(cv.title)}`);

    const name = cv.personal_info?.full_name || "No name added";
    const updated = cv.updated_at ? formatDate(cv.updated_at) : "";
    const template = cv.template || "modern";

    card.innerHTML = `
      <div class="cv-card-header">
        <div class="cv-card-title">${escapeHtml(cv.title)}</div>
        <span class="cv-card-template">${escapeHtml(template)}</span>
      </div>
      <div class="cv-card-name">${escapeHtml(name)}</div>
      ${updated ? `<div class="cv-card-date">Updated: ${updated}</div>` : ""}
      <div class="cv-card-actions">
        <button
          class="btn btn-sm btn-outline"
          data-id="${cv._id}"
          data-action="edit"
          aria-label="Edit CV: ${escapeHtml(cv.title)}"
        >
          ✏️ Edit
        </button>
        <button
          class="btn btn-sm btn-danger"
          data-id="${cv._id}"
          data-title="${escapeHtml(cv.title)}"
          data-action="delete"
          aria-label="Delete CV: ${escapeHtml(cv.title)}"
        >
          🗑️ Delete
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach card button events
  grid.querySelectorAll("[data-action='edit']").forEach((btn) => {
    btn.addEventListener("click", () => {
      redirect(`${ROUTES.EDITOR}?id=${btn.dataset.id}`);
    });
  });

  grid.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => {
      openDeleteModal(btn.dataset.id, btn.dataset.title);
    });
  });
}

// ── Create CV ──────────────────────────────────────────────
async function handleCreateCV() {
  const res = await apiCreateCV({ ...DEFAULT_CV });
  if (res.success && res.data?._id) {
    redirect(`${ROUTES.EDITOR}?id=${res.data._id}`);
  } else {
    showAlert("alert-box", "Could not create CV. Please try again.", "error");
  }
}

// ── Delete Modal ───────────────────────────────────────────
function openDeleteModal(cvId, cvTitle) {
  cvToDelete = cvId;
  const modal = document.getElementById("delete-modal");
  const titleEl = document.getElementById("modal-cv-title");
  if (titleEl) titleEl.textContent = cvTitle;
  if (modal) modal.classList.remove("hidden");
}

function closeDeleteModal() {
  cvToDelete = null;
  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.add("hidden");
}

async function handleConfirmDelete() {
  if (!cvToDelete) return;
  const res = await apiDeleteCV(cvToDelete);
  closeDeleteModal();
  if (res.success) {
    showAlert("alert-box", "CV deleted successfully.", "success");
    await loadCVs();
  } else {
    showAlert("alert-box", "Failed to delete CV.", "error");
  }
}

// ── UI Helpers ─────────────────────────────────────────────
function showLoading(visible) {
  const el = document.getElementById("loading-state");
  if (el) el.classList.toggle("hidden", !visible);
}

function showEmptyState(visible) {
  const empty = document.getElementById("empty-state");
  const grid = document.getElementById("cv-grid");
  if (empty) empty.classList.toggle("hidden", !visible);
  if (grid && !visible) grid.classList.remove("hidden");
  if (grid && visible) grid.classList.add("hidden");
}

// ── Event Listeners ────────────────────────────────────────
document.getElementById("create-cv-btn")?.addEventListener("click", handleCreateCV);
document.getElementById("empty-create-btn")?.addEventListener("click", handleCreateCV);
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await apiLogout();
  redirect(ROUTES.LOGIN);
});
document.getElementById("modal-cancel-btn")?.addEventListener("click", closeDeleteModal);
document.getElementById("modal-overlay")?.addEventListener("click", closeDeleteModal);
document.getElementById("modal-confirm-btn")?.addEventListener("click", handleConfirmDelete);

// ── Init ───────────────────────────────────────────────────
init();