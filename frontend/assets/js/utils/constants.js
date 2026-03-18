// =========================================================
// CONSTANTS — Quick CV
// =========================================================

// API_BASE is loaded from window._env_ or defaults to localhost
export const API_BASE =  "https://quickcv-api-wdga.onrender.com/api";

export const ROUTES = {
  LOGIN: "login.html",
  REGISTER: "register.html",
  DASHBOARD: "dashboard.html",
  EDITOR: "editor.html",
  PROFILE: "profile.html",
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
    social_links: [],
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  certificates: [],
  custom_sections: [],
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

export const EMPTY_CERTIFICATE = {
  name: "",
  issuer: "",
  date: "",
  description: "",
};

export const EMPTY_CUSTOM_SECTION = {
  title: "",
  content: "",
};
