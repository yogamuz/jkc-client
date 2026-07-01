import { useDataPageColors, glow } from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext";

/* ── Status badge: clickable cycle ── */
const StatusBadge = ({ status, onClick }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  const map = {
    PENDING: { color: C.yellow,  bg: C.yellowBg,  short: "PENDING" },
    PROCESS: { color: C.green,   bg: C.greenBg,   short: "PROCESS" },
    DONE:    { color: C.cyan,    bg: C.cyanBg,    short: "DONE" },
  };
  const cfg = map[status] || { color: C.muted, bg: "transparent", short: status || "—" };
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
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}`,
        fontFamily: "'Courier New', monospace",
        boxShadow: glow(theme, `0 0 8px ${cfg.color}40`),
        cursor: "pointer",
      }}
    >
      {cfg.short}
    </button>
  );
};

export default StatusBadge;