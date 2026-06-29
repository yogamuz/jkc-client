const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");
  return data;
};

export const loginUser = ({ username, password }) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const getMe = () => apiFetch("/api/auth/me");

export const logoutUser = () =>
  apiFetch("/api/auth/logout", { method: "POST" });

export const getUsers = () => apiFetch("/api/auth/users");

export const createUser = ({ username, password }) =>
  apiFetch("/api/auth/users", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const resetUserPassword = (id, newPassword) =>
  apiFetch(`/api/auth/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });

// authService.js — tambah setelah resetUserPassword
export const changePassword = ({ currentPassword, newPassword }) =>
  apiFetch("/api/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const deleteUser = (id) =>
  apiFetch(`/api/auth/users/${id}`, { method: "DELETE" });

// Avatar — pakai FormData, bukan JSON
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return fetch(`${BASE_URL}/api/auth/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: formData, // tidak pakai Content-Type header, biar browser set boundary sendiri
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");
    return data;
  });
};
