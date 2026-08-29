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

export const getAuditLogs = (filters = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v),
  );
  const qs = new URLSearchParams(cleaned).toString();
  return apiFetch(`/api/audit-logs${qs ? `?${qs}` : ""}`);
};