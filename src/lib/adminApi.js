import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

export function setAdminToken(token) {
  if (token) localStorage.setItem("admin_token", token);
  else localStorage.removeItem("admin_token");
}

export function resolveMediaUrl(url) {
  if (!url) return "";
  const str = String(url).trim();
  if (!str) return "";
  if (/^https?:\/\//i.test(str) || str.startsWith("data:") || str.startsWith("blob:")) {
    return str;
  }
  return `${API_BASE}${str.startsWith("/") ? "" : "/"}${str}`;
}

export const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }
  console.log(`📤 ${config.method?.toUpperCase()} ${API_BASE}${config.url}`, config.data || '');
  return config;
});

adminApi.interceptors.response.use(
  (res) => {
    console.log(`✅ ${res.config.method?.toUpperCase()} ${res.config.url}`, res.data);
    return res;
  },
  (error) => {
    console.error(`❌ API Error:`, error?.response?.data || error.message);
    console.error(`❌ Status:`, error?.response?.status);
    console.error(`❌ URL:`, error?.config?.url);
    console.error(`❌ Full URL:`, `${API_BASE}${error?.config?.url}`);
    if (error?.response?.status === 401) {
      setAdminToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);