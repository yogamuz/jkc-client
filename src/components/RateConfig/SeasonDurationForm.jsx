import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import DatePicker from "../ui/DatePicker";
import SeasonCountdown from "../SeasonCountdown";
import {
  useRateConfigColors,
  getInputS,
  getLabelS,
  glow,
} from "./rateConfig.utils";

const DAY = 86400000;
const toYMD = (d) => new Date(d).toLocaleDateString("sv-SE");

const SeasonDurationForm = ({ season, onSave, loading }) => {
  const C = useRateConfigColors();
  const { theme } = useTheme();
  const inputS = getInputS(C);
  const labelS = getLabelS(C);

  const [startDate, setStartDate] = useState(
    season.startDate ? toYMD(season.startDate) : toYMD(new Date()),
  );
  const [duration, setDuration] = useState(
    season.startDate && season.endDate
      ? String(
          Math.round(
            (new Date(season.endDate) - new Date(season.startDate)) / DAY,
          ),
        )
      : "90",
  );

  const handleSave = () => {
    if (!startDate) return;
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(start.getTime() + (Number(duration) || 90) * DAY);
    onSave({ startDate: start.toISOString(), endDate: end.toISOString() });
  };

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "0.65rem 1.25rem",
          background: "rgba(0,229,255,0.04)",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "3px",
            color: C.cyan,
            fontFamily: "'Courier New', monospace",
          }}
        >
          DURASI SEASON
        </span>
      </div>
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          alignItems: "flex-end",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={labelS}>TANGGAL MULAI</label>
          <DatePicker value={startDate} onChange={setStartDate} />
        </div>
        <div style={{ width: "120px" }}>
          <label style={labelS}>DURASI (HARI)</label>
          <input
            style={inputS}
            type="text"
            inputMode="numeric"
            value={duration}
            onChange={(e) => setDuration(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            background: loading ? "transparent" : C.cyan,
            border: `1px solid ${loading ? C.muted : C.cyan}`,
            color: loading ? C.muted : "#000",
            padding: "0.55rem 1.5rem",
            fontWeight: 900,
            fontSize: "0.75rem",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "1.5px",
            boxShadow: loading ? "none" : glow(theme, `0 0 14px ${C.cyan}40`),
          }}
        >
          {loading ? "MENYIMPAN..." : "SIMPAN DURASI"}
        </button>
        <div style={{ flexBasis: "100%" }}>
          <SeasonCountdown
            startDate={season.startDate}
            endDate={season.endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default SeasonDurationForm;