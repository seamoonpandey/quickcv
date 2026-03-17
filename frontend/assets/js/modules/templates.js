// =========================================================
// TEMPLATES MODULE — Quick CV
// Renders CV data into HTML using chosen template
// =========================================================

import { escapeHtml, formatDateRange } from "../utils/helpers.js";

/**
 * Render the full CV preview HTML based on template and data.
 * @param {object} cvData - Full CV object
 * @param {string} template - "modern" | "classic" | "minimal"
 * @returns {string} HTML string
 */
export function renderTemplate(cvData, template = "modern") {
  const pi = cvData.personal_info || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];

  const hasContent =
    pi.full_name ||
    pi.email ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0;

  if (!hasContent) {
    return `<p class="cv-preview-empty">Start filling in your details to see a preview here.</p>`;
  }

  return `
    ${renderHeader(pi, template)}
    ${pi.summary ? renderSummary(pi.summary, template) : ""}
    ${experience.length > 0 ? renderExperience(experience, template) : ""}
    ${education.length > 0 ? renderEducation(education, template) : ""}
    ${skills.length > 0 ? renderSkills(skills, template) : ""}
  `;
}

// ── Header ─────────────────────────────────────────────────
function renderHeader(pi, template) {
  const name = escapeHtml(pi.full_name) || "Your Name";
  const contactParts = [];

  if (pi.email) contactParts.push(`<span>${escapeHtml(pi.email)}</span>`);
  if (pi.phone) contactParts.push(`<span>${escapeHtml(pi.phone)}</span>`);
  if (pi.location) contactParts.push(`<span>${escapeHtml(pi.location)}</span>`);
  if (pi.website) {
    contactParts.push(
      `<span><a href="${escapeHtml(pi.website)}" target="_blank" rel="noopener">${escapeHtml(pi.website)}</a></span>`
    );
  }

  const contactHtml = contactParts.length
    ? `<div class="cv-contact">${contactParts.join("")}</div>`
    : "";

  return `
    <div class="cv-header">
      <h1 class="cv-name">${name}</h1>
      ${contactHtml}
    </div>
  `;
}

// ── Summary ────────────────────────────────────────────────
function renderSummary(summary, template) {
  return `
    <div class="cv-section">
      <h2 class="cv-section-title">Profile</h2>
      <p class="cv-summary">${escapeHtml(summary)}</p>
    </div>
  `;
}

// ── Experience ─────────────────────────────────────────────
function renderExperience(experience, template) {
  const entries = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.start_date, exp.end_date);
      return `
        <div class="cv-entry">
          <div class="cv-entry-header">
            <div>
              <div class="cv-entry-title">${escapeHtml(exp.job_title) || "Job Title"}</div>
              <div class="cv-entry-subtitle">${escapeHtml(exp.company) || ""}</div>
            </div>
            ${dateRange ? `<div class="cv-entry-date">${escapeHtml(dateRange)}</div>` : ""}
          </div>
          ${exp.description ? `<p class="cv-entry-desc">${escapeHtml(exp.description)}</p>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="cv-section">
      <h2 class="cv-section-title">Work Experience</h2>
      ${entries}
    </div>
  `;
}

// ── Education ──────────────────────────────────────────────
function renderEducation(education, template) {
  const entries = education
    .map((edu) => {
      const dateRange = formatDateRange(edu.start_date, edu.end_date);
      return `
        <div class="cv-entry">
          <div class="cv-entry-header">
            <div>
              <div class="cv-entry-title">${escapeHtml(edu.degree) || "Degree"}</div>
              <div class="cv-entry-subtitle">${escapeHtml(edu.institution) || ""}</div>
            </div>
            ${dateRange ? `<div class="cv-entry-date">${escapeHtml(dateRange)}</div>` : ""}
          </div>
          ${edu.description ? `<p class="cv-entry-desc">${escapeHtml(edu.description)}</p>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="cv-section">
      <h2 class="cv-section-title">Education</h2>
      ${entries}
    </div>
  `;
}

// ── Skills ─────────────────────────────────────────────────
function renderSkills(skills, template) {
  let skillsHtml = "";

  if (template === "classic") {
    skillsHtml = `<div class="cv-skills-list">${skills.map((s) => escapeHtml(s)).join(" · ")}</div>`;
  } else {
    skillsHtml = `
      <div class="cv-skills-list">
        ${skills.map((s) => `<span class="cv-skill-tag">${escapeHtml(s)}</span>`).join("")}
      </div>
    `;
  }

  return `
    <div class="cv-section">
      <h2 class="cv-section-title">Skills</h2>
      ${skillsHtml}
    </div>
  `;
}