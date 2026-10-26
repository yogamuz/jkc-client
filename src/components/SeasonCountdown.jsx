import { useDataPageColors } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext"; // ← baru

const DAY = 86400000;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const SeasonCountdown = ({ startDate, endDate }) => {
  const C = useDataPageColors();
  const { theme } = useTheme(); // ← baru
  const mono = { fontFamily: "'Courier New', monospace" };

  if (!endDate)
    return (
      <div
        style={{
          ...mono,
          fontSize: "0.62rem",
          fontWeight: 900,
          letterSpacing: "2px",
          color: C.muted,
        }}
      >
        DURASI SEASON BELUM DIATUR
      </div>
    );

  const start = startDate ? new Date(startDate) : null;
  const end = new Date(endDate);
  const now = new Date();
  const daysLeft = Math.ceil((end - now) / DAY);
  const ended = daysLeft <= 0;
  const pct = start
    ? Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100)
    : null;
  const color = ended ? C.magenta : daysLeft <= 7 ? C.yellow : C.cyan;
  const isDark = theme !== "light"; // ← baru

  return (
    <div style={{ maxWidth: "340px" }}> {/* ← 460px jadi 340px */}
      <div
        style={{
          ...mono,
          fontSize: "0.8rem",
          fontWeight: 900,
          letterSpacing: "2px",
          color,
        }}
      >
        {ended ? "SEASON BERAKHIR" : `SISA ${daysLeft} HARI`}
      </div>
      {pct !== null && (
        <div
          style={{
            background: isDark ? "rgba(255,255,255,0.10)" : C.trackBg, // ← baru
            border: isDark ? `1px solid ${color}55` : "none", // ← baru
            boxSizing: "border-box", // ← baru
            height: "14px",
            margin: "8px 0",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: color,
              boxShadow: isDark ? `0 0 8px ${color}80` : "none", // ← baru
            }}
          />
        </div>
      )}
      <div
        style={{
          ...mono,
          fontSize: "0.58rem",
          letterSpacing: "1px",
          color: C.muted,
        }}
      >
        {start ? `${fmtDate(start)} — ` : "s/d "}
        {fmtDate(end)}
      </div>
    </div>
  );
};

export default SeasonCountdown;