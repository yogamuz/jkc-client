const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");
  return data;
};

const apiFetch = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  }).then(handle);

// Publik (tanpa login)
export const getPublicSite = () => apiFetch("/api/site/public");

// Owner: pengaturan halaman publik
export const getSiteSettings = () => apiFetch("/api/site/settings");
export const updateSiteSettings = (body) =>
  apiFetch("/api/site/settings", { method: "PUT", body: JSON.stringify(body) });

// Owner: spender
export const getSpenders = () => apiFetch("/api/spenders");
export const getSpenderSuggestions = () => apiFetch("/api/spenders/suggestions");
export const createSpender = (body) =>
  apiFetch("/api/spenders", { method: "POST", body: JSON.stringify(body) });
export const updateSpender = (id, body) =>
  apiFetch(`/api/spenders/${id}`, { method: "PATCH", body: JSON.stringify(body) });
export const deleteSpender = (id) =>
  apiFetch(`/api/spenders/${id}`, { method: "DELETE" });

// Avatar — pakai FormData, bukan JSON
export const uploadSpenderAvatar = (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return fetch(`${BASE_URL}/api/spenders/${id}/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  }).then(handle);
};