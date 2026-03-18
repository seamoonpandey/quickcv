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
  const certificates = cvData.certificates || [];
  const customSections = cvData.custom_sections || [];
  const hasCertificates = certificates.some(
    (c) => c && (c.name || c.issuer || c.date || c.description)
  );
  const hasCustomSections = customSections.some(
    (s) => s && (s.title || s.content)
  );
  const hasSocialLinks = Array.isArray(pi.social_links)
    ? pi.social_links.some((l) => l && (l.label || l.url))
    : false;

  const hasContent =
    pi.full_name ||
    pi.email ||
    hasSocialLinks ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0 ||
    hasCertificates ||
    hasCustomSections;

  if (!hasContent) {
    return `<p class="cv-preview-empty">Start filling in your details to see a preview here.</p>`;
  }

  return `
    ${renderHeader(pi, template)}
    ${pi.summary ? renderSummary(pi.summary, template) : ""}
    ${experience.length > 0 ? renderExperience(experience, template) : ""}
    ${education.length > 0 ? renderEducation(education, template) : ""}
    ${hasCertificates ? renderCertificates(certificates, template) : ""}
    ${hasCustomSections ? renderCustomSections(customSections, template) : ""}
    ${skills.length > 0 ? renderSkills(skills, template) : ""}
  `;
}

// ── Header ─────────────────────────────────────────────────
function renderHeader(pi, template) {
  const name = escapeHtml(pi.full_name) || "Your Name";
  const contactParts = [];
  const socialLinks = Array.isArray(pi.social_links) ? pi.social_links : [];

  if (pi.email) contactParts.push(`<span>${escapeHtml(pi.email)}</span>`);
  if (pi.phone) contactParts.push(`<span>${escapeHtml(pi.phone)}</span>`);
  if (pi.location) contactParts.push(`<span>${escapeHtml(pi.location)}</span>`);
  if (pi.website) {
    contactParts.push(
      `<span><a href="${escapeHtml(pi.website)}" target="_blank" rel="noopener">${escapeHtml(pi.website)}</a></span>`
    );
  }
  socialLinks
    .filter((link) => link && (link.label || link.url))
    .forEach((link) => {
      const label = link.label ? escapeHtml(link.label) : escapeHtml(link.url);
      const url = escapeHtml(link.url || "#");
      contactParts.push(
        `<span><a href="${url}" target="_blank" rel="noopener">${label}</a></span>`
      );
    });

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

// ── Certificates ──────────────────────────────────────────
function renderCertificates(certificates, template) {
  const entries = certificates
    .filter((cert) => cert && (cert.name || cert.issuer || cert.date || cert.description))
    .map((cert) => {
      const date = cert.date ? `<div class="cv-entry-date">${escapeHtml(cert.date)}</div>` : "";
      return `
        <div class="cv-entry">
          <div class="cv-entry-header">
            <div>
              <div class="cv-entry-title">${escapeHtml(cert.name) || "Certificate"}</div>
              <div class="cv-entry-subtitle">${escapeHtml(cert.issuer) || ""}</div>
            </div>
            ${date}
          </div>
          ${cert.description ? `<p class="cv-entry-desc">${escapeHtml(cert.description)}</p>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="cv-section">
      <h2 class="cv-section-title">Certificates</h2>
      ${entries}
    </div>
  `;
}

// ── Custom Sections ───────────────────────────────────────
function renderCustomSections(sections, template) {
  const entries = sections
    .filter((s) => s && (s.title || s.content))
    .map((section) => {
      return `
        <div class="cv-section">
          <h2 class="cv-section-title">${escapeHtml(section.title || "Custom Section")}</h2>
          ${
            section.content
              ? `<p class="cv-entry-desc">${escapeHtml(section.content)}</p>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  return entries;
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
