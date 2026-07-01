import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext"; // sesuaikan path

/* ── Design tokens ─────────────────────────────────────── */
const darkColors = {
  bg: "#0D0D0F",
  panel: "#121214",
  border: "#2A2A2E",
  yellow: "#FFE600",
  cyan: "#00E5FF",
  magenta: "#FF3CAC",
  green: "#39FF14",
  text: "#E8E8E8",
  muted: "#666670",
  dim: "#2A2A2E",
};

const lightColors = {
  bg: "#FAF7F0",
  panel: "#FFFFFF",
  border: "#1A1A1A",
  yellow: "#B8860B",
  cyan: "#0089A0",
  magenta: "#CC2E89",
  green: "#1F9D2E",
  text: "#1A1A1A",
  muted: "#8A8A8F",
  dim: "#D8D4C8",
};

export const getColors = (theme) =>
  theme === "light" ? lightColors : darkColors;

/* Tetap diekspor untuk backward compatibility (default statis, dark) */
export const C = darkColors;

/* Hook: pakai ini di komponen agar warna reaktif terhadap theme */
export const useRateConfigColors = () => {
  const { theme } = useContext(ThemeContext);
  return getColors(theme);
};

/* ── Glow helper — dimatikan di light mode biar gak norak ── */
export const glow = (theme, value) => (theme === "light" ? "none" : value);

/* ── Shared input style ── */
export const getInputS = (c = darkColors) => ({
  background: c === lightColors ? "#F2EFE6" : "#0A0A0C",
  border: `1px solid ${c.border}`,
  padding: "0.45rem 0.7rem",
  color: c.text,
  fontWeight: 600,
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "'Courier New', monospace",
  width: "100%",
});
/* Tetap diekspor sebagai default statis (dark) untuk backward compatibility */
export const inputS = getInputS();

/* ── Shared label style ── */
export const getLabelS = (c = darkColors) => ({
  fontSize: "0.55rem",
  color: c.muted,
  fontWeight: 900,
  letterSpacing: "2px",
  fontFamily: "'Courier New', monospace",
  marginBottom: "4px",
  display: "block",
});
/* Tetap diekspor sebagai default statis (dark) untuk backward compatibility */
export const labelS = getLabelS();

/* ── Constants ─────────────────────────────────────────── */
export const TIER_PRESETS = ["EPIC", "LEGEND", "MAWI", "HONOR", "GLORY", "IMO"];

export const emptyRate = () => ({
  tier: "",
  rate_store_joki: 0,
  rate_store_jokgen: 0,
  rate_worker_joki: 0,
  rate_worker_jokgen: 0,
});

export const RATE_HEADERS = [
  "TIER",
  "HARGA JOKI RANK /star",
  "HARGA JOKI GEN /star",
  "GAJI WORKER RANK /star",
  "GAJI WORKER GEN /star",
  "",
];

/* ── Formatters ────────────────────────────────────────── */
export const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
export const toDisplay = (n) => (n ? Number(n).toLocaleString("id-ID") : "");
export const fromDisplay = (s) => Number(s.replace(/\./g, "")) || 0;