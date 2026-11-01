import { useState, useEffect } from "react"; // ← baru
import { useDataPageColors } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext";

const DAY = 86400000;
const ROLLOVER_HOUR = 15; // ← baru: ganti hari server ML jam 15:00
const SERVER_UTC_OFFSET = -8; // ← baru: server time ML = UTC-8

// ← baru: bentuk gelombang air (periode 60 satuan, bisa di-loop mulus)
const WAVE = `M0 0 q15 -8 30 0 ${"t30 0 ".repeat(11)}V200 H0 Z`;

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

const pad2 = (n) => String(n).padStart(2, "0"); // ← baru: format 2 digit untuk timer

// ← baru: format "MM/DD/YYYY HH:MM:SS" sesuai Server time di game (UTC-8)
const fmtServerTime = (d) => {
  const s = new Date(new Date(d).getTime() + SERVER_UTC_OFFSET * 3600000);
  return `${pad2(s.getUTCMonth() + 1)}/${pad2(
    s.getUTCDate(),
  )}/${s.getUTCFullYear()} ${pad2(s.getUTCHours())}:${pad2(
    s.getUTCMinutes(),
  )}:${pad2(s.getUTCSeconds())}`;
};

const SeasonCountdown = ({ startDate, endDate }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();
  const mono = { fontFamily: "'Courier New', monospace" };

  // ← diubah: re-render tiap detik supaya Server time berjalan live
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
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
  const daysLeft =
    Math.round(
      (new Date(end.getFullYear(), end.getMonth(), end.getDate()) -
        serverDay(now)) /
        DAY,
    ) - 1;
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

  // ← baru: timer menuju reset harian berikutnya (jam 15:00)
  // (sekarang tidak ditampilkan, perhitungan dibiarkan agar logika tidak berubah)
  const todayReset = atRollover(now);
  const nextReset =
    now >= todayReset ? atRollover(new Date(now.getTime() + DAY)) : todayReset;
  const remain = Math.max(Math.floor((nextReset - now) / 1000), 0);
  const timer = `${pad2(Math.floor(remain / 3600))}:${pad2(
    Math.floor((remain % 3600) / 60),
  )}:${pad2(remain % 60)}`;

  // ← baru: ukuran lingkaran progress (sistem koordinat viewBox SVG)
  const SIZE = 120;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  // ← diperbaiki: tinggi permukaan air (0% = kosong, 100% = penuh saat reset)
  const waterY = pct !== null ? SIZE - (SIZE * pct) / 100 : SIZE;

  return (
    <div style={{ maxWidth: "340px" }}>

      {pct !== null && (
        // ← diubah: ukuran dinamis, mengecil mengikuti lebar layar (maks 120px)
        <div
          style={{
            position: "relative",
            width: "clamp(72px, 22vw, 120px)",
            aspectRatio: "1 / 1",
            containerType: "inline-size",
            margin: "8px 0",
          }}
        >
          {/* ← diubah: dari ring progress menjadi lingkaran berisi air bergelombang */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{
              display: "block",
              filter: isDark ? `drop-shadow(0 0 4px ${color}80)` : "none",
            }}
          >
            <defs>
              <clipPath id="season-water-clip">
                <circle cx={SIZE / 2} cy={SIZE / 2} r={R} />
              </clipPath>
            </defs>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill={isDark ? "rgba(255,255,255,0.06)" : C.trackBg}
            />
            <g clipPath="url(#season-water-clip)">
              <g
                style={{
                  transform: `translateY(${waterY}px)`,
                  transition: "transform 1s linear",
                }}
              >
                {/* gelombang belakang (lebih transparan, arah berlawanan) */}
                <g transform="translate(0,3)" opacity="0.45">
                  <path d={WAVE} fill={color}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from="-60 0"
                      to="0 0"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
                {/* gelombang depan */}
                <path d={WAVE} fill={color}>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-60 0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          </svg>
          {/* ← diubah: warna teks gelap saat light, putih + bayangan saat dark */}
          <div
            style={{
              ...mono,
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: isDark ? "#fff" : "#1f1a14",
              textShadow: isDark
                ? "0 0 3px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5)"
                : "none",
            }}
          >
            <span
              style={{
                fontSize: "max(0.9rem, 21cqw)",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {Math.max(daysLeft, 0)}
            </span>
            <span
              style={{
                fontSize: "max(0.4rem, 7.3cqw)",
                letterSpacing: "1.5px",
                marginTop: "2px",
              }}
            >
              HARI
            </span>
          </div>
        </div>
      )}
      {/* ← baru: Server time lengkap dengan tanggal, format sama seperti di game */}
      <div
        style={{
          ...mono,
          fontSize: "0.7rem",
          letterSpacing: "1px",
          color: C.muted,
          marginBottom: "6px",
        }}
      >
        {fmtServerTime(now)}
      </div>
    </div>
  );
};

export default SeasonCountdown;