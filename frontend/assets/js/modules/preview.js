// =========================================================
// PREVIEW MODULE — Talentio
// Updates the live CV preview panel
// =========================================================

import { renderTemplate } from "./templates.js";
import { TEMPLATE_LABELS } from "../utils/constants.js";

/**
 * Update the live preview with the current CV data and template.
 * @param {object} cvData
 * @param {string} template
 */
export function updatePreview(cvData, template = "modern") {
  const previewEl = document.getElementById("cv-preview");
  const badgeEl = document.getElementById("preview-template-badge");

  if (!previewEl) return;

  // Update template class
  previewEl.className = `cv-preview template-${template}`;

  // Render HTML content
  previewEl.innerHTML = renderTemplate(cvData, template);

  // Update badge
  if (badgeEl) {
    badgeEl.textContent = TEMPLATE_LABELS[template] || template;
  }
}