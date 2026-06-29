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

export const getOrders = (seasonId, filters = {}) => {
  const params = new URLSearchParams({ seasonId, ...filters });
  return apiFetch(`/api/orders?${params}`);
};
export const getOrderById = (id) => apiFetch(`/api/orders/${id}`);
export const createOrder = (body) =>
  apiFetch("/api/orders", { method: "POST", body: JSON.stringify(body) });
export const updateOrder = (id, body) =>
  apiFetch(`/api/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
export const deleteOrder = (id) =>
  apiFetch(`/api/orders/${id}`, { method: "DELETE" });
export const markWorkerPaid = (id, workerName, isPaid) =>
  apiFetch(`/api/orders/${id}/workers/${workerName}/paid`, {
    method: "PATCH",
    body: JSON.stringify({ isPaid }),
  });
export const getSeasonSummary = (seasonId) =>
  apiFetch(`/api/orders/summary?seasonId=${seasonId}`);
export const getWorkerSummary = (seasonId) =>
  apiFetch(`/api/orders/workers/summary?seasonId=${seasonId}`);
export const getDashboardSummary = () => apiFetch("/api/dashboard/summary");
export const getWorkersList = (seasonId) => {
  const params = seasonId ? `?seasonId=${seasonId}` : "";
  return apiFetch(`/api/workers${params}`);
};

