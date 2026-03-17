// =========================================================
// CONSTANTS — Quick CV
// =========================================================

export const API_BASE = "http://127.0.0.1:5000/api";

export const ROUTES = {
  LOGIN: "login.html",
  REGISTER: "register.html",
  DASHBOARD: "dashboard.html",
  EDITOR: "editor.html",
};

export const TEMPLATES = ["modern", "classic", "minimal"];

export const TEMPLATE_LABELS = {
  modern: "Modern",
  classic: "Classic",
  minimal: "Minimal",
};

export const DEFAULT_CV = {
  title: "Untitled CV",
  template: "modern",
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
};

export const EMPTY_EDUCATION = {
  institution: "",
  degree: "",
  start_date: "",
  end_date: "",
  description: "",
};

export const EMPTY_EXPERIENCE = {
  job_title: "",
  company: "",
  start_date: "",
  end_date: "",
  description: "",
};