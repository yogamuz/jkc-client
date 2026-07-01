import { useContext } from "react";
import ThemeContext from "../context/ThemeContext"; // sesuaikan path sesuai struktur project-mu

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
  /* ── tambahan untuk AnalyticsPage (eks-hardcoded hex) ── */
  panel2: "#0F0F14",
  trackBg: "#0A0A0C",
  mutedAlt: "#9A9A9A",
  hoverBg: "#1A1A1F",
  /* ── tambahan untuk light mode (modal & table di DataPage) ── */
  modalBg: "#131318",
  modalFooterBg: "#0D0D0F",
  rowAlt: "#0D0D0F",
  tableBg: "#0F0F14",
  subtleBg: "rgba(255,255,255,0.02)",
  outlineBorder: "rgba(255,255,255,0.25)",
  outlineBorderHover: "rgba(255,255,255,0.5)",
  /* ── tambahan untuk badge bg (StatusBadge/PaidBadge) ── */
  yellowBg: "rgba(255,230,0,0.08)",
  cyanBg: "rgba(0,229,255,0.08)",
  greenBg: "rgba(57,255,20,0.08)",
  magentaBg: "rgba(255,60,172,0.08)",
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
  /* ── tambahan untuk AnalyticsPage (eks-hardcoded hex) ── */
  panel2: "#FFFFFF",
  trackBg: "#EAE6DA",
  mutedAlt: "#6B6B70",
  hoverBg: "#F0ECE0",
  /* ── tambahan untuk light mode (modal & table di DataPage) ── */
  modalBg: "#FFFFFF",
  modalFooterBg: "#FAF7F0",
  rowAlt: "#F2EFE6",
  tableBg: "#FFFFFF",
  subtleBg: "rgba(0,0,0,0.025)",
  outlineBorder: "rgba(0,0,0,0.25)",
  outlineBorderHover: "rgba(0,0,0,0.5)",
  /* ── tambahan untuk badge bg (StatusBadge/PaidBadge) — lebih pekat biar gak nyaru di bg terang ── */
  yellowBg: "rgba(184,134,11,0.16)",
  cyanBg: "rgba(0,137,160,0.16)",
  greenBg: "rgba(31,157,46,0.16)",
  magentaBg: "rgba(204,46,137,0.16)",
};

export const getColors = (theme) => (theme === "light" ? lightColors : darkColors);

/* Tetap diekspor untuk backward compatibility (default statis, dark) */
export const C = darkColors;

/* Hook baru: pakai ini di komponen agar warna reaktif terhadap theme */
export const useDataPageColors = () => {
  const { theme } = useContext(ThemeContext);
  return getColors(theme);
};

/* ── Glow helper — dimatikan di light mode biar gak norak ── */
export const glow = (theme, value) => (theme === "light" ? "none" : value);

/* ── Glass card with radial glow ── */
export const glassCard = (accentColor, c = darkColors) => ({
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(ellipse at 60% 40%, ${accentColor}18 0%, ${c.panel}00 60%), ${c.panel}`,
  border: `1px solid ${accentColor}60`,
  padding: "1.1rem 1.25rem 1rem",
  flex: "1 1 140px",
  minWidth: "0",
  boxSizing: "border-box",
});

/* ── Table cell ── */
export const cell = (bold, c = darkColors) => ({
  padding: "0.65rem 0.875rem",
  fontSize: "0.8rem",
  fontFamily: "'Courier New', monospace",
  fontWeight: bold ? 700 : 500,
  color: bold ? c.text : c.muted,
  whiteSpace: "nowrap",
  borderRight: `1px solid ${c.border}`,
});

/* ── Shared input style ── */
export const getInputS = (c = darkColors) => ({
  background: c.bg,
  border: `1px solid ${c.border}`,
  padding: "0.5rem 0.75rem",
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
  fontSize: "0.58rem",
  color: c.muted,
  fontWeight: 900,
  letterSpacing: "2px",
  fontFamily: "'Courier New', monospace",
  marginBottom: "4px",
  display: "block",
});
/* Tetap diekspor sebagai default statis (dark) untuk backward compatibility */
export const labelS = getLabelS();

/* ── Status cycle for click-to-change ── */
export const STATUS_CYCLE = { PENDING: "DONE", DONE: "CANCEL", CANCEL: "PENDING" };

/* ── Column map for Excel import ── */
export const COLUMN_MAP = {
  NO: "_skip",
  NAME: "customerName",
  CUSTOMER: "customerName",
  DATE: "date",
  TANGGAL: "date",
  CATEGORY: "category",
  KATEGORI: "category",
  TYPE: "_type",
  TIPE: "_type",
  PAYMENT: "payment",
  BAYAR: "payment",
  PRICE: "price",
  HARGA: "price",
  "WORKER SALARY": "_workerSalary",
  SALARY: "_workerSalary",
  WORKER: "_workerName",
  STATUS: "_status",
  PAID: "_paid",
  PROFIT: "_skip",
  REQ: "_req",
  "REQ (TIER)": "_req",
};

/* ── Keys that are NOT extra columns ── */
export const DEFAULT_KEYS = new Set([
  "no",
  "customerName",
  "date",
  "category",
  "payment",
  "price",
  "workers",
  "totalWorkerSalary",
  "profit",
  "status",
  "paid",
  "aksi",
  "REQ",
  "req",
  "WORKER",
  "worker",
  "TYPE",
  "type",
  "PAID",
]);