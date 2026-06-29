import { C } from "../../constants/dataPage.constants";

/* ── Status badge: clickable cycle ── */
const StatusBadge = ({ status, onClick }) => {
  const map = {
    PENDING: { color: C.yellow,  short: "PENDING" },
    PROCESS: { color: C.green,   short: "PROCESS" },
    DONE:    { color: C.cyan,    short: "DONE" },
  };
  const cfg = map[status] || { color: C.muted, short: status || "—" };
  return (
    <button
      onClick={onClick}
      title="Klik untuk ubah status"
      style={{
        display: "inline-block",
        padding: "3px 10px",
        fontSize: "0.62rem",
        fontWeight: 900,
        letterSpacing: "1px",
        background: "transparent",
        color: cfg.color,
        border: `1px solid ${cfg.color}`,
        fontFamily: "'Courier New', monospace",
        boxShadow: `0 0 8px ${cfg.color}40`,
        cursor: "pointer",
      }}
    >
      {cfg.short}
    </button>
  );
};

export default StatusBadge;