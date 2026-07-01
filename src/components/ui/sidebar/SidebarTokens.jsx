import { useContext } from "react";
import ThemeContext from "../../../context/ThemeContext"; // adjust path if needed

const darkColors = {
  bg: "#0D0D0D",
  bgPanel: "#111111",
  bgHover: "#1A1A1A",
  activeBg: "rgba(255,230,0,0.08)",
  activeBgSoft: "rgba(255,230,0,0.06)",
  submenuBg: "rgba(255,255,255,0.04)",
  border: "#2A2A2A",
  yellow: "#FFE600",
  cyan: "#00E5FF",
  magenta: "#FF3CAC",
  text: "#E8E8E8",
  muted: "#555555",
  dimmed: "#333333",
};

const lightColors = {
  bg: "#FAF7F0",
  bgPanel: "#FFFFFF",
  bgHover: "#F0EDE2",
  activeBg: "rgba(184,134,11,0.14)",
  activeBgSoft: "rgba(184,134,11,0.10)",
  submenuBg: "rgba(0,0,0,0.035)",
  border: "#1A1A1A",
  yellow: "#B8860B",
  cyan: "#0089A0",
  magenta: "#CC2E89",
  text: "#1A1A1A",
  muted: "#8A8A8F",
  dimmed: "#C8C4BA",
};

export const getColors = (theme) =>
  theme === "light" ? lightColors : darkColors;

export const C = darkColors; // backward-compatible static default

export const useSidebarColors = () => {
  const { theme } = useContext(ThemeContext);
  return getColors(theme);
};

export const getInputStyle = (c = darkColors) => ({
  width: "100%",
  padding: "0.6rem 0.75rem",
  background: c.bg,
  border: `1px solid ${c.border}`,
  color: c.text,
  fontFamily: "'Courier New', monospace",
  fontSize: "0.72rem",
  letterSpacing: "1px",
  outline: "none",
  boxSizing: "border-box",
});
export const inputStyle = getInputStyle();

export const getSubNavBtnStyle = (c = darkColors) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  width: "100%",
  padding: "0.5rem 1.25rem 0.5rem 2.5rem",
  background: "transparent",
  border: "none",
  borderLeft: "3px solid transparent",
  color: c.muted,
  fontWeight: 700,
  fontSize: "0.65rem",
  letterSpacing: "1.5px",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "'Courier New', monospace",
  textTransform: "uppercase",
});
export const subNavBtnStyle = getSubNavBtnStyle();
