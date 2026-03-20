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
    pi.profile_image ||
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

  if (template === "sidebar") {
    return renderSidebarTemplate(cvData);
  }

  if (template === "slate") {
    return renderSlateTemplate(cvData);
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

// ── Slate Template (Dark header + soft sidebar) ──────────
function renderSlateTemplate(cvData) {
  const pi = cvData.personal_info || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];
  const certificates = cvData.certificates || [];
  const customSections = cvData.custom_sections || [];

  const name = escapeHtml(pi.full_name) || "Your Name";
  const role = experience?.[0]?.job_title ? escapeHtml(experience[0].job_title) : "";
  const imageUrl = pi.profile_image ? escapeHtml(pi.profile_image) : "";

  const socialLinks = Array.isArray(pi.social_links) ? pi.social_links : [];

  const contactRows = [
    pi.email
      ? `<div class="cv-slate-contact-row"><span class="cv-slate-icon">✉</span><span>${escapeHtml(pi.email)}</span></div>`
      : "",
    pi.phone
      ? `<div class="cv-slate-contact-row"><span class="cv-slate-icon">☎</span><span>${escapeHtml(pi.phone)}</span></div>`
      : "",
    pi.location
      ? `<div class="cv-slate-contact-row"><span class="cv-slate-icon">⌂</span><span>${escapeHtml(pi.location)}</span></div>`
      : "",
    pi.website
      ? `<div class="cv-slate-contact-row"><span class="cv-slate-icon">⟲</span><span><a href="${escapeHtml(pi.website)}" target="_blank" rel="noopener">${escapeHtml(pi.website)}</a></span></div>`
      : "",
    ...socialLinks
      .filter((l) => l && (l.label || l.url))
      .map((l) => {
        const label = l.label ? escapeHtml(l.label) : escapeHtml(l.url);
        const url = escapeHtml(l.url || "#");
        return `<div class="cv-slate-contact-row"><span class="cv-slate-icon">↗</span><span><a href="${url}" target="_blank" rel="noopener">${label}</a></span></div>`;
      }),
  ].join("");

  const educationItems = education
    .filter((e) => e && (e.institution || e.degree || e.start_date || e.end_date))
    .map((e) => {
      const years = formatDateRange(e.start_date, e.end_date);
      return `
        <div class="cv-slate-edu-item">
          <div class="cv-slate-edu-title">${escapeHtml(e.degree || e.institution || "Education")}</div>
          ${e.institution ? `<div class="cv-slate-edu-sub">${escapeHtml(e.institution)}</div>` : ""}
          ${years ? `<div class="cv-slate-edu-years">${escapeHtml(years)}</div>` : ""}
        </div>
      `;
    })
    .join("");

  const skillsItems = (skills || [])
    .filter(Boolean)
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  const summaryHtml = pi.summary
    ? `<section class="cv-slate-section"><h2 class="cv-slate-section-title">Summary</h2><p class="cv-slate-summary">${escapeHtml(pi.summary)}</p></section>`
    : "";

  const experienceHtml = (experience || []).length
    ? `<section class="cv-slate-section"><h2 class="cv-slate-section-title">Work Experience</h2>${(experience || [])
        .filter((e) => e && (e.job_title || e.company || e.start_date || e.end_date || e.description))
        .map((e) => {
          const years = formatDateRange(e.start_date, e.end_date);
          return `
            <div class="cv-slate-exp-item">
              <div class="cv-slate-exp-head">
                <div class="cv-slate-exp-role">${escapeHtml(e.job_title || "Role")}${e.company ? `, <span class="cv-slate-exp-company">${escapeHtml(e.company)}</span>` : ""}</div>
                ${years ? `<div class="cv-slate-exp-years">${escapeHtml(years)}</div>` : ""}
              </div>
              ${e.description ? `<div class="cv-slate-exp-desc">${escapeHtml(e.description)}</div>` : ""}
            </div>
          `;
        })
        .join("")}</section>`
    : "";

  const certificatesHtml = (certificates || []).some(
    (c) => c && (c.name || c.issuer || c.date || c.description)
  )
    ? `<section class="cv-slate-section"><h2 class="cv-slate-section-title">Certificates</h2>${(certificates || [])
        .filter((c) => c && (c.name || c.issuer || c.date || c.description))
        .map((c) => {
          const meta = [c.issuer, c.date].filter(Boolean).map(escapeHtml).join(" • ");
          return `
            <div class="cv-slate-cert-item">
              <div class="cv-slate-cert-title">${escapeHtml(c.name || "Certificate")}</div>
              ${meta ? `<div class="cv-slate-cert-meta">${meta}</div>` : ""}
              ${c.description ? `<div class="cv-slate-cert-desc">${escapeHtml(c.description)}</div>` : ""}
            </div>
          `;
        })
        .join("")}</section>`
    : "";

  const customHtml = (customSections || []).some((s) => s && (s.title || s.content))
    ? `${(customSections || [])
        .filter((s) => s && (s.title || s.content))
        .map((s) => {
          return `
            <section class="cv-slate-section">
              <h2 class="cv-slate-section-title">${escapeHtml(s.title || "Additional")}</h2>
              ${s.content ? `<div class="cv-slate-custom">${escapeHtml(s.content)}</div>` : ""}
            </section>
          `;
        })
        .join("")}`
    : "";

  return `
    <div class="cv-slate">
      <header class="cv-slate-header">
        <div class="cv-slate-photo">
          ${imageUrl ? `<img class="cv-slate-photo-img" src="${imageUrl}" alt="" crossorigin="anonymous" />` : `<div class="cv-slate-photo-placeholder"></div>`}
        </div>
        <div class="cv-slate-header-text">
          <div class="cv-slate-name">${name}</div>
          ${role ? `<div class="cv-slate-role">${role}</div>` : ""}
        </div>
      </header>

      <div class="cv-slate-body">
        <aside class="cv-slate-left">
          ${contactRows ? `
            <div class="cv-slate-block">
              <div class="cv-slate-block-title">Contact Details</div>
              <div class="cv-slate-contact">${contactRows}</div>
            </div>
          ` : ""}

          ${educationItems ? `
            <div class="cv-slate-block">
              <div class="cv-slate-block-title">Education</div>
              <div class="cv-slate-edu">${educationItems}</div>
            </div>
          ` : ""}

          ${skillsItems ? `
            <div class="cv-slate-block">
              <div class="cv-slate-block-title">Skills</div>
              <ul class="cv-slate-skills">${skillsItems}</ul>
            </div>
          ` : ""}

          ${imageUrl ? `<div class="cv-slate-left-photo" aria-hidden="true"><img src="${imageUrl}" alt="" crossorigin="anonymous" /></div>` : ""}
        </aside>

        <main class="cv-slate-right">
          ${summaryHtml}
          ${experienceHtml}
          ${certificatesHtml}
          ${customHtml}
        </main>
      </div>
    </div>
  `;
}

// ── Sidebar Template (Pixel-style) ───────────────────────
function renderSidebarTemplate(cvData) {
  const pi = cvData.personal_info || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];
  const certificates = cvData.certificates || [];
  const customSections = cvData.custom_sections || [];

  const name = escapeHtml(pi.full_name) || "Your Name";
  const title = experience?.[0]?.job_title ? escapeHtml(experience[0].job_title) : "";
  const imageUrl = pi.profile_image ? escapeHtml(pi.profile_image) : "";

  const about = pi.summary ? escapeHtml(pi.summary) : "";
  const socialLinks = Array.isArray(pi.social_links) ? pi.social_links : [];
  const hasSocial = socialLinks.some((l) => l && (l.label || l.url));
  const hasContact = Boolean(pi.email || pi.phone || pi.location || pi.website || hasSocial);

  const contactRows = [
    pi.email
      ? `<div class="cv-sb-contact-row"><span class="cv-sb-contact-icon">✉</span><span class="cv-sb-contact-text">${escapeHtml(pi.email)}</span></div>`
      : "",
    pi.phone
      ? `<div class="cv-sb-contact-row"><span class="cv-sb-contact-icon">☎</span><span class="cv-sb-contact-text">${escapeHtml(pi.phone)}</span></div>`
      : "",
    pi.location
      ? `<div class="cv-sb-contact-row"><span class="cv-sb-contact-icon">⌂</span><span class="cv-sb-contact-text">${escapeHtml(pi.location)}</span></div>`
      : "",
    pi.website
      ? `<div class="cv-sb-contact-row"><span class="cv-sb-contact-icon">⟲</span><span class="cv-sb-contact-text"><a href="${escapeHtml(pi.website)}" target="_blank" rel="noopener">${escapeHtml(pi.website)}</a></span></div>`
      : "",
    ...socialLinks
      .filter((link) => link && (link.label || link.url))
      .map((link) => {
        const label = link.label ? escapeHtml(link.label) : escapeHtml(link.url);
        const url = escapeHtml(link.url || "#");
        return `<div class="cv-sb-contact-row"><span class="cv-sb-contact-icon">↗</span><span class="cv-sb-contact-text"><a href="${url}" target="_blank" rel="noopener">${label}</a></span></div>`;
      }),
  ].join("");

  const educationItems = education
    .filter((e) => e && (e.institution || e.degree || e.start_date || e.end_date))
    .map((e) => {
      const years = formatDateRange(e.start_date, e.end_date);
      return `
        <div class="cv-sb-edu-item">
          <div class="cv-sb-edu-title">${escapeHtml(e.institution || e.degree || "Education")}</div>
          ${e.degree ? `<div class="cv-sb-edu-sub">${escapeHtml(e.degree)}</div>` : ""}
          ${years ? `<div class="cv-sb-edu-years">${escapeHtml(years)}</div>` : ""}
        </div>
      `;
    })
    .join("");

  const experienceItems = experience
    .filter((e) => e && (e.job_title || e.company || e.start_date || e.end_date || e.description))
    .map((e) => {
      const years = formatDateRange(e.start_date, e.end_date);
      return `
        <div class="cv-sb-exp-item">
          <div class="cv-sb-exp-role">${escapeHtml(e.job_title || "Role")}</div>
          <div class="cv-sb-exp-meta">
            ${e.company ? `<span class="cv-sb-exp-company">${escapeHtml(e.company)}</span>` : ""}
            ${years ? `<span class="cv-sb-exp-years">${escapeHtml(years)}</span>` : ""}
          </div>
          ${e.description ? `<div class="cv-sb-exp-desc">${escapeHtml(e.description)}</div>` : ""}
        </div>
      `;
    })
    .join("");

  const skillsItems = (skills || [])
    .filter(Boolean)
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  const certificateItems = (certificates || [])
    .filter((c) => c && (c.name || c.issuer || c.date || c.description))
    .map((c) => {
      const meta = [c.issuer, c.date].filter(Boolean).map(escapeHtml).join(" • ");
      return `
        <div class="cv-sb-cert-item">
          <div class="cv-sb-cert-title">${escapeHtml(c.name || "Certificate")}</div>
          ${meta ? `<div class="cv-sb-cert-meta">${meta}</div>` : ""}
          ${c.description ? `<div class="cv-sb-cert-desc">${escapeHtml(c.description)}</div>` : ""}
        </div>
      `;
    })
    .join("");

  const customSectionItems = (customSections || [])
    .filter((s) => s && (s.title || s.content))
    .map((s) => {
      return `
        <div class="cv-sb-custom-item">
          <div class="cv-sb-custom-title">${escapeHtml(s.title || "Custom")}</div>
          ${s.content ? `<div class="cv-sb-custom-desc">${escapeHtml(s.content)}</div>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="cv-sb">
      <aside class="cv-sb-left">
        <div class="cv-sb-photo">
          ${imageUrl ? `<img class="cv-sb-photo-img" src="${imageUrl}" alt="" crossorigin="anonymous" />` : `<div class="cv-sb-photo-placeholder"></div>`}
        </div>

        ${about ? `
          <section class="cv-sb-block">
            <h2 class="cv-sb-heading">ABOUT ME</h2>
            <p class="cv-sb-about">${about}</p>
          </section>
        ` : ""}

        ${hasContact ? `
          <section class="cv-sb-block">
            <h2 class="cv-sb-heading">CONTACT</h2>
            <div class="cv-sb-contact">${contactRows}</div>
          </section>
        ` : ""}

        ${educationItems ? `
          <section class="cv-sb-block">
            <h2 class="cv-sb-heading">EDUCATION</h2>
            <div class="cv-sb-edu">${educationItems}</div>
          </section>
        ` : ""}
      </aside>

      <main class="cv-sb-right">
        <header class="cv-sb-header">
          <div class="cv-sb-name">${name}</div>
          ${title ? `<div class="cv-sb-title">${title}</div>` : ""}
        </header>

        ${experienceItems ? `
          <section class="cv-sb-section">
            <h2 class="cv-sb-section-title">WORK EXPERIENCE</h2>
            <div class="cv-sb-exp">${experienceItems}</div>
          </section>
        ` : ""}

        ${skillsItems ? `
          <section class="cv-sb-section">
            <h2 class="cv-sb-section-title">SKILLS</h2>
            <ul class="cv-sb-skills">${skillsItems}</ul>
          </section>
        ` : ""}

        ${certificateItems ? `
          <section class="cv-sb-section">
            <h2 class="cv-sb-section-title">CERTIFICATES</h2>
            <div class="cv-sb-certs">${certificateItems}</div>
          </section>
        ` : ""}

        ${customSectionItems ? `
          <section class="cv-sb-section">
            <h2 class="cv-sb-section-title">ADDITIONAL</h2>
            <div class="cv-sb-custom">${customSectionItems}</div>
          </section>
        ` : ""}
      </main>
    </div>
  `;
}

// ── Header ─────────────────────────────────────────────────
function renderHeader(pi, template) {
  const name = escapeHtml(pi.full_name) || "Your Name";
  const contactParts = [];
  const socialLinks = Array.isArray(pi.social_links) ? pi.social_links : [];

  const profileImageUrl = pi.profile_image ? escapeHtml(pi.profile_image) : "";
  const profileImageHtml = profileImageUrl
    ? `
      <div class="cv-profile-image-wrap" aria-hidden="true">
        <img class="cv-profile-image" src="${profileImageUrl}" alt="" crossorigin="anonymous" />
      </div>
    `
    : "";

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
      <div class="cv-header-grid">
        ${profileImageHtml}
        <div class="cv-header-text">
          <h1 class="cv-name">${name}</h1>
          ${contactHtml}
        </div>
      </div>
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
