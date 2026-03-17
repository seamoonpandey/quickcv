// =========================================================
// CV FORM MODULE — Quick CV
// The main editor page controller
// Handles: form inputs, tabs, entries, skills,
//          template switching, autosave, PDF export
// =========================================================

import { apiGetMe } from "../api/authApi.js";
import { apiGetCV, apiCreateCV, apiUpdateCV } from "../api/cvApi.js";
import { updatePreview } from "./preview.js";
import { exportToPDF } from "./pdfExport.js";
import {
  getQueryParam,
  redirect,
  showAlert,
  debounce,
  escapeHtml,
} from "../utils/helpers.js";
import {
  ROUTES,
  DEFAULT_CV,
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
} from "../utils/constants.js";

// ── State ──────────────────────────────────────────────────
let cvId = null;
let currentTemplate = "modern";
let cvData = JSON.parse(JSON.stringify(DEFAULT_CV));

// ── Init ───────────────────────────────────────────────────
async function init() {
  // Auth guard
  const meRes = await apiGetMe();
  if (!meRes.success) {
    redirect(ROUTES.LOGIN);
    return;
  }

  cvId = getQueryParam("id");
  if (!cvId) {
    redirect(ROUTES.DASHBOARD);
    return;
  }

  // Load CV data
  const res = await apiGetCV(cvId);
  if (!res.success || !res.data) {
    showAlert("alert-box", "CV not found.", "error");
    setTimeout(() => redirect(ROUTES.DASHBOARD), 2000);
    return;
  }

  cvData = res.data;
  currentTemplate = cvData.template || "modern";

  populateForm();
  setActiveTemplate(currentTemplate);
  updatePreview(cvData, currentTemplate);
  setupAutoSave();
}

// ── Populate Form Fields ───────────────────────────────────
function populateForm() {
  const pi = cvData.personal_info || {};

  setValue("cv-title", cvData.title);
  setValue("pi-name", pi.full_name);
  setValue("pi-email", pi.email);
  setValue("pi-phone", pi.phone);
  setValue("pi-location", pi.location);
  setValue("pi-website", pi.website);
  setValue("pi-summary", pi.summary);

  renderEducationList();
  renderExperienceList();
  renderSkillsTags();
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

// ── Collect Form Data ──────────────────────────────────────
function collectFormData() {
  return {
    title: document.getElementById("cv-title")?.value || "Untitled CV",
    template: currentTemplate,
    personal_info: {
      full_name: document.getElementById("pi-name")?.value || "",
      email: document.getElementById("pi-email")?.value || "",
      phone: document.getElementById("pi-phone")?.value || "",
      location: document.getElementById("pi-location")?.value || "",
      website: document.getElementById("pi-website")?.value || "",
      summary: document.getElementById("pi-summary")?.value || "",
    },
    education: cvData.education || [],
    experience: cvData.experience || [],
    skills: cvData.skills || [],
  };
}

// ── Live Preview on Input ──────────────────────────────────
function setupAutoSave() {
  const debouncedSave = debounce(async () => {
    cvData = collectFormData();
    updatePreview(cvData, currentTemplate);
    await autoSave();
  }, 600);

  document
    .querySelector(".editor-panel")
    ?.addEventListener("input", debouncedSave);
}

async function autoSave() {
  const statusEl = document.getElementById("save-status");
  if (statusEl) statusEl.textContent = "Saving...";

  const res = await apiUpdateCV(cvId, cvData);

  if (statusEl) {
    statusEl.textContent = res.success ? "✅ Saved" : "⚠️ Save failed";
    setTimeout(() => {
      if (statusEl) statusEl.textContent = "";
    }, 3000);
  }
}

// ── Manual Save Button ─────────────────────────────────────
document.getElementById("save-btn")?.addEventListener("click", async () => {
  cvData = collectFormData();
  updatePreview(cvData, currentTemplate);
  await autoSave();
});

// ── PDF Export ─────────────────────────────────────────────
document.getElementById("export-btn")?.addEventListener("click", async () => {
  cvData = collectFormData();
  updatePreview(cvData, currentTemplate);
  const safeTitle = cvData.title || "my-cv";
  await exportToPDF(safeTitle);
});

// ── Template Switcher ──────────────────────────────────────
document.querySelectorAll(".template-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.getAttribute("data-template");
    setActiveTemplate(selected);
    currentTemplate = selected;
    cvData = collectFormData();
    updatePreview(cvData, currentTemplate);
  });
});

function setActiveTemplate(template) {
  document.querySelectorAll(".template-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-template") === template;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

// ── Tab Navigation ─────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");
    switchTab(target);
  });
});

function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-tab") === tabName;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("hidden", panel.id !== `tab-${tabName}`);
    panel.classList.toggle("active", panel.id === `tab-${tabName}`);
  });
}

// ── EDUCATION ──────────────────────────────────────────────
document.getElementById("add-education-btn")?.addEventListener("click", () => {
  cvData.education = cvData.education || [];
  cvData.education.push({ ...EMPTY_EDUCATION });
  renderEducationList();
  triggerPreviewUpdate();
});

function renderEducationList() {
  const container = document.getElementById("education-list");
  if (!container) return;
  container.innerHTML = "";

  (cvData.education || []).forEach((edu, index) => {
    const card = createEntryCard("education", index, edu);
    container.appendChild(card);
  });
}

// ── EXPERIENCE ─────────────────────────────────────────────
document.getElementById("add-experience-btn")?.addEventListener("click", () => {
  cvData.experience = cvData.experience || [];
  cvData.experience.push({ ...EMPTY_EXPERIENCE });
  renderExperienceList();
  triggerPreviewUpdate();
});

function renderExperienceList() {
  const container = document.getElementById("experience-list");
  if (!container) return;
  container.innerHTML = "";

  (cvData.experience || []).forEach((exp, index) => {
    const card = createEntryCard("experience", index, exp);
    container.appendChild(card);
  });
}

// ── Generic Entry Card Builder ─────────────────────────────
function createEntryCard(type, index, data) {
  const card = document.createElement("div");
  card.className = "entry-card";
  card.setAttribute("data-index", index);

  const isEducation = type === "education";

  const titleLabel = isEducation ? "Institution" : "Job Title";
  const titleKey = isEducation ? "institution" : "job_title";
  const subtitleLabel = isEducation ? "Degree / Qualification" : "Company";
  const subtitleKey = isEducation ? "degree" : "company";
  const displayTitle = isEducation
    ? data.institution || `Education ${index + 1}`
    : data.job_title || `Experience ${index + 1}`;

  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-title">${escapeHtml(displayTitle)}</span>
      <button
        type="button"
        class="entry-remove-btn"
        data-type="${type}"
        data-index="${index}"
        aria-label="Remove ${type} entry ${index + 1}"
      >✕ Remove</button>
    </div>

    <div class="form-group">
      <label for="${type}-${titleKey}-${index}">${titleLabel}</label>
      <input
        type="text"
        id="${type}-${titleKey}-${index}"
        value="${escapeHtml(data[titleKey] || "")}"
        placeholder="${titleLabel}"
        data-type="${type}"
        data-index="${index}"
        data-key="${titleKey}"
      />
    </div>

    <div class="form-group">
      <label for="${type}-${subtitleKey}-${index}">${subtitleLabel}</label>
      <input
        type="text"
        id="${type}-${subtitleKey}-${index}"
        value="${escapeHtml(data[subtitleKey] || "")}"
        placeholder="${subtitleLabel}"
        data-type="${type}"
        data-index="${index}"
        data-key="${subtitleKey}"
      />
    </div>

    <div class="form-group">
      <label for="${type}-start-${index}">Start Date</label>
      <input
        type="text"
        id="${type}-start-${index}"
        value="${escapeHtml(data.start_date || "")}"
        placeholder="e.g. 2022"
        data-type="${type}"
        data-index="${index}"
        data-key="start_date"
      />
    </div>

    <div class="form-group">
      <label for="${type}-end-${index}">End Date</label>
      <input
        type="text"
        id="${type}-end-${index}"
        value="${escapeHtml(data.end_date || "")}"
        placeholder="e.g. 2026 or Present"
        data-type="${type}"
        data-index="${index}"
        data-key="end_date"
      />
    </div>

    <div class="form-group">
      <label for="${type}-desc-${index}">Description</label>
      <textarea
        id="${type}-desc-${index}"
        rows="3"
        placeholder="Brief description..."
        data-type="${type}"
        data-index="${index}"
        data-key="description"
      >${escapeHtml(data.description || "")}</textarea>
    </div>
  `;

  // Input listeners
  card.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", (e) => {
      const { type: t, index: i, key } = e.target.dataset;
      const arr = t === "education" ? cvData.education : cvData.experience;
      if (arr[i]) arr[i][key] = e.target.value;
      triggerPreviewUpdate();
    });
  });

  // Remove button
  card.querySelector(".entry-remove-btn")?.addEventListener("click", (e) => {
    const { type: t, index: i } = e.target.dataset;
    if (t === "education") {
      cvData.education.splice(Number(i), 1);
      renderEducationList();
    } else {
      cvData.experience.splice(Number(i), 1);
      renderExperienceList();
    }
    triggerPreviewUpdate();
  });

  return card;
}

// ── SKILLS ─────────────────────────────────────────────────
document.getElementById("add-skill-btn")?.addEventListener("click", addSkill);
document.getElementById("skill-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill();
  }
});

function addSkill() {
  const input = document.getElementById("skill-input");
  if (!input) return;

  const skill = input.value.trim();
  if (!skill) return;

  cvData.skills = cvData.skills || [];

  // Prevent duplicates (case-insensitive)
  const exists = cvData.skills.some(
    (s) => s.toLowerCase() === skill.toLowerCase()
  );
  if (exists) {
    input.value = "";
    return;
  }

  cvData.skills.push(skill);
  input.value = "";
  renderSkillsTags();
  triggerPreviewUpdate();
}

function renderSkillsTags() {
  const container = document.getElementById("skills-list");
  if (!container) return;

  container.innerHTML = "";

  (cvData.skills || []).forEach((skill, index) => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.innerHTML = `
      ${escapeHtml(skill)}
      <button
        type="button"
        class="skill-remove"
        data-index="${index}"
        aria-label="Remove skill: ${escapeHtml(skill)}"
      >✕</button>
    `;

    tag.querySelector(".skill-remove")?.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.index);
      cvData.skills.splice(i, 1);
      renderSkillsTags();
      triggerPreviewUpdate();
    });

    container.appendChild(tag);
  });
}

// ── Trigger Preview Update ─────────────────────────────────
function triggerPreviewUpdate() {
  const current = collectFormData();
  current.education = cvData.education;
  current.experience = cvData.experience;
  current.skills = cvData.skills;
  cvData = current;
  updatePreview(cvData, currentTemplate);
}

// ── Start ──────────────────────────────────────────────────
init();