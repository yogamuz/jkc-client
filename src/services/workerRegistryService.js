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

export const getWorkerRegistry = () => apiFetch("/api/worker-registry");

export const addRegistryWorker = (name) =>
  apiFetch("/api/worker-registry", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const importRegistryFromOrders = () =>
  apiFetch("/api/worker-registry/import-from-orders", { method: "POST" });

export const generateWorkerInvite = (id) =>
  apiFetch(`/api/worker-registry/${id}/invite`, { method: "POST" });

export const resetRegistryWorker = (id) =>
  apiFetch(`/api/worker-registry/${id}/reset`, { method: "POST" });

export const setRegistryWorkerActive = (id, isActive) =>
  apiFetch(`/api/worker-registry/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

export const deleteRegistryWorker = (id) =>
  apiFetch(`/api/worker-registry/${id}`, { method: "DELETE" });