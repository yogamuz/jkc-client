import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext"; // adjust path if needed

const darkColors = {
  bg: "#0D0D0F",
  panel: "#131318",
  rowAlt: "#0D0D0F",
  border: "#2A2A2E",
  yellow: "#FFE600",
  cyan: "#00E5FF",
  magenta: "#FF3CAC",
  green: "#39FF14",
  text: "#E8E8E8",
  muted: "#666670",
  dim: "#2A2A2E",
  /* ── tambahan untuk light mode (AdminDetailPanel/AdminsTable) ── */
  trackBg: "#0A0A0C",
  hoverBg: "#1A1A1F",
  yellowBg: "rgba(255,230,0,0.08)",
  cyanBg: "rgba(0,229,255,0.08)",
  greenBg: "rgba(57,255,20,0.08)",
  magentaBg: "rgba(255,60,172,0.08)",
};

const lightColors = {
  bg: "#FAF7F0",
  panel: "#FFFFFF",
  rowAlt: "#F2EFE6",
  border: "#1A1A1A",
  yellow: "#B8860B",
  cyan: "#0089A0",
  magenta: "#CC2E89",
  green: "#1F9D2E",
  text: "#1A1A1A",
  muted: "#5C5C62",
  dim: "#D8D4C8",
  /* ── tambahan untuk light mode (AdminDetailPanel/AdminsTable) ── */
  trackBg: "#EAE6DA",
  hoverBg: "#F0ECE0",
  yellowBg: "rgba(184,134,11,0.16)",
  cyanBg: "rgba(0,137,160,0.16)",
  greenBg: "rgba(31,157,46,0.16)",
  magentaBg: "rgba(204,46,137,0.16)",
};

export const getColors = (theme) =>
  theme === "light" ? lightColors : darkColors;

// Kept for backward compatibility (static dark default)
export const C = darkColors;

export const useWorkersColors = () => {
  const { theme } = useContext(ThemeContext);
  return getColors(theme);
};

export const textGlow = (accentColor, theme) =>
  theme === "light" ? "none" : `0 0 20px ${accentColor}60`;
export const glow = (theme, value) => (theme === "light" ? "none" : value);
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiFetch = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");
  return data;
};

export const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export const glassCard = (accentColor, c = darkColors) => ({
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(ellipse at 60% 40%, ${accentColor}18 0%, ${c.panel}00 60%), ${c.panel}`,
  border: `1px solid ${accentColor}60`,
  padding: "1rem 1.25rem",
  flex: "1 1 140px",
  minWidth: "0",
  boxSizing: "border-box",
});

export const cell = (bold, c = darkColors) => ({
  padding: "0.65rem 0.875rem",
  fontSize: "0.8rem",
  fontFamily: "'Courier New', monospace",
  fontWeight: bold ? 700 : 500,
  color: bold ? c.text : c.muted,
  whiteSpace: "nowrap",
  borderRight: `1px solid ${c.border}`,
});
