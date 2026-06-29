/* ── Design tokens ─────────────────────────────────────── */
export const C = {
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

/* ── Glass card with radial glow ── */
export const glassCard = (accentColor) => ({
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(ellipse at 60% 40%, ${accentColor}18 0%, #13131800 60%), #131318`,
  border: `1px solid ${accentColor}60`,
  padding: "1.1rem 1.25rem 1rem",
  flex: "1 1 140px",
  minWidth: "0",
  boxSizing: "border-box",
});

/* ── Table cell ── */
export const cell = (bold) => ({
  padding: "0.65rem 0.875rem",
  fontSize: "0.8rem",
  fontFamily: "'Courier New', monospace",
  fontWeight: bold ? 700 : 500,
  color: bold ? "#E8E8E8" : "#8A8A9A",
  whiteSpace: "nowrap",
  borderRight: `1px solid #2A2A2E`,
});

/* ── Shared input style ── */
export const inputS = {
  background: "#0A0A0C",
  border: `1px solid #2A2A2E`,
  padding: "0.5rem 0.75rem",
  color: "#E8E8E8",
  fontWeight: 600,
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "'Courier New', monospace",
  width: "100%",
};

/* ── Shared label style ── */
export const labelS = {
  fontSize: "0.58rem",
  color: "#666670",
  fontWeight: 900,
  letterSpacing: "2px",
  fontFamily: "'Courier New', monospace",
  marginBottom: "4px",
  display: "block",
};

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