// =========================================================
// PDF EXPORT MODULE — Talentio
// Exports the live preview as a PDF using html2canvas + jsPDF
// =========================================================

import { showAlert } from "../utils/helpers.js";

/**
 * Export the CV preview element as a PDF download.
 * @param {string} filename - Name for the downloaded file
 */
export async function exportToPDF(filename = "my-cv") {
  const previewEl = document.getElementById("cv-preview");
  if (!previewEl) {
    showAlert("alert-box", "Preview not found. Cannot export.", "error");
    return;
  }

  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.disabled = true;
    exportBtn.textContent = "⏳ Exporting...";
  }

  try {
    // Capture the preview element as a canvas
    const canvas = await html2canvas(previewEl, {
      scale: 2,           // High resolution
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in mm
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Scale to fit A4 width
    const ratio = pdfWidth / canvasWidth;
    const imgHeight = canvasHeight * ratio;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add extra pages if content is longer than A4
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Sanitise filename
    const safeFilename = filename.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
    pdf.save(`${safeFilename}.pdf`);

  } catch (err) {
    console.error("[pdfExport] Export error:", err);
    showAlert("alert-box", "PDF export failed. Please try again.", "error");
  } finally {
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.textContent = "📥 Export PDF";
    }
  }
}