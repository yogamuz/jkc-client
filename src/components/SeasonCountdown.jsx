import { useState, useEffect } from "react"; // ← baru
import { useDataPageColors } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext";

const DAY = 86400000;
const ROLLOVER_HOUR = 15; // ← baru: ganti hari server ML jam 15:00

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ← baru: tanggal "hari server" (ganti hari tiap jam 15:00, bukan 00:00)
const serverDay = (d) => {
  const x = new Date(new Date(d).getTime() - ROLLOVER_HOUR * 3600000);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
};

// ← baru: jam 15:00 pada tanggal tsb
const atRollover = (d) => {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate(), ROLLOVER_HOUR);
};

const SeasonCountdown = ({ startDate, endDate }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();
  const mono = { fontFamily: "'Courier New', monospace" };

  // ← baru: re-render tiap menit supaya angka berkurang live jam 15:00
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

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
  // ← diubah: hitung selisih hari server, bukan selisih ms ke 00:00
  const daysLeft = Math.round(
    (new Date(end.getFullYear(), end.getMonth(), end.getDate()) -
      serverDay(now)) /
      DAY,
  );
  const ended = daysLeft <= 0;
  // ← diubah: progress dari jam 15:00 tanggal mulai ke jam 15:00 tanggal akhir
  const pct = start
    ? Math.min(
        Math.max(
          ((now - atRollover(start)) /
            (atRollover(end) - atRollover(start))) *
            100,
          0,
        ),
        100,
      )
    : null;
  const color = ended ? C.magenta : daysLeft <= 7 ? C.yellow : C.cyan;
  const isDark = theme !== "light";

  return (
    <div style={{ maxWidth: "340px" }}>
      <div
        style={{
          ...mono,
          fontSize: "0.8rem",
          fontWeight: 900,
          letterSpacing: "2px",
          color,
        }}
      >
        {ended ? "SEASON BERAKHIR" : `RESET SEASON ${daysLeft} HARI LAGI `}
      </div>
      {pct !== null && (
        <div
          style={{
            background: isDark ? "rgba(255,255,255,0.10)" : C.trackBg,
            border: isDark ? `1px solid ${color}55` : "none",
            boxSizing: "border-box",
            height: "14px",
            margin: "8px 0",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: color,
              boxShadow: isDark ? `0 0 8px ${color}80` : "none",
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