export const C = {
  bg: "#0D0D0F",
  panel: "#131318",
  border: "#2A2A2E",
  yellow: "#FFE600",
  cyan: "#00E5FF",
  magenta: "#FF3CAC",
  green: "#39FF14",
  text: "#E8E8E8",
  muted: "#666670",
  dim: "#2A2A2E",
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiFetch = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");
  return data;
};

export const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";

export const glassCard = (accentColor) => ({
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(ellipse at 60% 40%, ${accentColor}18 0%, #13131800 60%), #131318`,
  border: `1px solid ${accentColor}60`,
  padding: "1rem 1.25rem",
  flex: "1 1 140px",
  minWidth: "0",
  boxSizing: "border-box",
});

export const cell = (bold) => ({
  padding: "0.65rem 0.875rem",
  fontSize: "0.8rem",
  fontFamily: "'Courier New', monospace",
  fontWeight: bold ? 700 : 500,
  color: bold ? "#E8E8E8" : "#8A8A9A",
  whiteSpace: "nowrap",
  borderRight: `1px solid #2A2A2E`,
});