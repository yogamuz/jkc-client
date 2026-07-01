import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDataPageColors } from "../../constants/dataPage.constants";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const DAYS = ["M", "S", "R", "K", "J", "S", "M"];

const DatePicker = ({ value, onChange, style = {} }) => {
  const C = useDataPageColors();
  const today = new Date();

  const parseVal = () => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d)) return d;
    }
    return today;
  };

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const d = parseVal();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const calendarRef = useRef(null);

  // Hitung posisi dropdown berdasarkan posisi trigger button
  const updatePos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
  };

  // Tutup kalender kalau klik di luar
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Sinkron view kalau value berubah dari luar
  useEffect(() => {
    const d = parseVal();
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }, [value]);

  const handleOpen = () => {
    updatePos();
    setOpen((o) => !o);
  };

  const selected = value ? new Date(value + "T00:00:00") : null;
  const label = selected
    ? selected.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Pilih tanggal";

  const prevMonth = () =>
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 },
    );
  const goToday = () => {
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    setView({ year: t.getFullYear(), month: t.getMonth() });
    onChange(`${t.getFullYear()}-${mm}-${dd}`);
    setOpen(false);
  };
  const buildDays = () => {
    const firstDay = new Date(view.year, view.month, 1);
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const selectDay = (day) => {
    if (!day) return;
    const mm = String(view.month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${view.year}-${mm}-${dd}`);
    setOpen(false);
  };

  const isSelected = (day) => {
    if (!selected || !day) return false;
    return (
      selected.getFullYear() === view.year &&
      selected.getMonth() === view.month &&
      selected.getDate() === day
    );
  };

  const isToday = (day) => {
    if (!day) return false;
    return (
      today.getFullYear() === view.year &&
      today.getMonth() === view.month &&
      today.getDate() === day
    );
  };

  const cells = buildDays();

  const BASE = {
    background: C.trackBg,
    border: `1px solid ${C.border}`,
    color: C.text,
    padding: "5px 10px",
    fontSize: "0.75rem",
    fontFamily: "monospace",
    outline: "none",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    ...style,
  };

  const calendar = open
    ? createPortal(
        <div
          ref={calendarRef}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            zIndex: 99999,
            background: C.modalBg,
            border: `1px solid ${C.border}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.85)`,
            padding: "0.75rem",
            width: "230px",
            userSelect: "none",
          }}
        >
          {/* Nav bulan */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <button onClick={prevMonth} style={navBtn(C)}>
              ‹
            </button>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 900,
                color: C.yellow,
                fontFamily: "monospace",
                letterSpacing: "1px",
              }}
            >
              {MONTHS[view.month]} {view.year}
            </span>
            <button onClick={nextMonth} style={navBtn(C)}>
              ›
            </button>
          </div>

          {/* Header hari */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              marginBottom: "4px",
            }}
          >
            {DAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: "0.55rem",
                  color: C.muted,
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid tanggal */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
            }}
          >
            {cells.map((day, i) => {
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={i}
                  onClick={() => selectDay(day)}
                  disabled={!day}
                  style={{
                    background: sel ? C.yellow : "transparent",
                    border:
                      tod && !sel
                        ? `1px solid ${C.yellow}60`
                        : "1px solid transparent",
                    color: sel ? "#000" : day ? C.text : "transparent",
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                    fontWeight: sel ? 900 : 400,
                    padding: "4px 0",
                    cursor: day ? "pointer" : "default",
                    textAlign: "center",
                    borderRadius: "2px",
                  }}
                >
                  {day || ""}
                </button>
              );
            })}
          </div>

          {/* Tombol Hari ini */}
          <button
            onClick={goToday}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.muted,
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "1.5px",
              padding: "4px",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            HARI INI
          </button>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={triggerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button onClick={handleOpen} style={BASE}>
        {label}
      </button>
      {calendar}
    </div>
  );
};

const navBtn = (C) => ({
  background: "transparent",
  border: "none",
  color: C.mutedAlt,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 900,
  padding: "0 6px",
  lineHeight: 1,
});

export default DatePicker;
