import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";
import useSeason from "../hooks/useSeason";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import { useTheme } from "../context/ThemeContext"; // sesuaikan path
import RateForm from "../components/RateConfig/RateForm";
import RateHistoryPanel from "../components/RateConfig/RateHistoryPanel";
import SeasonDurationForm from "../components/RateConfig/SeasonDurationForm"; // ← baru
import {
  useRateConfigColors,
  glow,
} from "../components/RateConfig/rateConfig.utils";

// ── Keyboard navigation helpers ───────────────────────────
const NAV_SKIP_TYPES = ["hidden", "checkbox", "radio", "button", "submit"];
const TEXT_CARET_TYPES = ["text", "search", "tel", "url", "password", "email"];

const getNavigableInputs = (container) =>
  Array.from(container.querySelectorAll("input")).filter(
    (el) =>
      !el.disabled &&
      !el.readOnly &&
      !NAV_SKIP_TYPES.includes(el.type) &&
      el.offsetParent !== null,
  );

// Cari tombol SIMPAN terdekat dari input (naik dari parent terdekat),
// supaya input fee -> SIMPAN FEE, input rate/catatan -> SIMPAN RATE
const findSaveButtonFor = (el, container) => {
  let node = el.parentElement;
  while (node && container.contains(node)) {
    const btn = Array.from(node.querySelectorAll("button")).find((b) =>
      /simpan|save/i.test(b.textContent || ""),
    );
    if (btn) return btn;
    node = node.parentElement;
  }
  return null;
};

// ── Main RateConfigPage ───────────────────────────────────
const RateConfigPage = ({ seasons = [], onRefresh }) => { // ← onRefresh baru
  const C = useRateConfigColors();
  const { theme } = useTheme();
  const { loading, updateRates, getSeasonById, update } = useSeason(); // ← update baru
  const [selectedId, setSelectedId] = useState(null);
  const [savedFlag, setSavedFlag] = useState(0);
  const [saveNotif, setSaveNotif] = useState(false);
  const formWrapRef = useRef(null);

  // auto-select season aktif
  useEffect(() => {
    if (seasons.length > 0 && !selectedId) {
      const active = seasons.find((s) => s.isActive) || seasons[0];
      setSelectedId(active.id);
    }
  }, [seasons]);
  useEffect(() => {
    if (!saveNotif) return;
    const t = setTimeout(() => setSaveNotif(false), 3000);
    return () => clearTimeout(t);
  }, [saveNotif]);

  const selectedSeason = seasons.find((s) => s.id === selectedId) || null;

  const handleSaved = (type) => {
    setSavedFlag((f) => f + 1); // trigger re-render
    if (type === "rate") setSaveNotif(true);
  };

  // ← baru: simpan durasi season (PATCH /seasons/:id)
  const handleSaveDuration = async (body) => {
    await update(selectedSeason.id, body);
    onRefresh?.();
  };

  // Arrow = pindah antar kolom, Enter = simpan
  const handleFormKeyDown = (e) => {
    const el = e.target;
    const container = formWrapRef.current;
    if (!el || !container || el.tagName !== "INPUT") return;
    if (NAV_SKIP_TYPES.includes(el.type)) return;
    if (e.nativeEvent && e.nativeEvent.isComposing) return;

    // ENTER → klik tombol simpan yang sesuai dengan panel input ini
    if (e.key === "Enter") {
      const saveBtn = findSaveButtonFor(el, container);
      if (saveBtn && !saveBtn.disabled) {
        e.preventDefault();
        saveBtn.click();
      }
      return;
    }

    // ARROW → pindah fokus input
    const isArrow = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ].includes(e.key);
    if (!isArrow) return;

    // Untuk input teks, jangan ganggu pergerakan kursor di dalam teks.
    // Pindah kolom hanya jika kursor di ujung, atau seluruh isi sedang ter-select.
    if (TEXT_CARET_TYPES.includes(el.type) && el.selectionStart !== null) {
      const len = (el.value || "").length;
      const s = el.selectionStart;
      const en = el.selectionEnd;
      const allSelected = s === 0 && en === len;
      if (e.key === "ArrowLeft" && !allSelected && !(s === 0 && en === 0))
        return;
      if (e.key === "ArrowRight" && !allSelected && !(s === len && en === len))
        return;
    }

    const inputs = getNavigableInputs(container);
    const curRect = el.getBoundingClientRect();
    const cx = curRect.left + curRect.width / 2;
    const cy = curRect.top + curRect.height / 2;

    let best = null;
    let bestScore = Infinity;

    inputs.forEach((cand) => {
      if (cand === el) return;
      const r = cand.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx;
      const dy = r.top + r.height / 2 - cy;

      let primary;
      let secondary;
      if (e.key === "ArrowRight" && dx > 4) {
        primary = dx;
        secondary = Math.abs(dy);
      } else if (e.key === "ArrowLeft" && dx < -4) {
        primary = -dx;
        secondary = Math.abs(dy);
      } else if (e.key === "ArrowDown" && dy > 4) {
        primary = dy;
        secondary = Math.abs(dx);
      } else if (e.key === "ArrowUp" && dy < -4) {
        primary = -dy;
        secondary = Math.abs(dx);
      } else {
        return;
      }

      const score = primary + secondary * 3;
      if (score < bestScore) {
        bestScore = score;
        best = cand;
      }
    });

    if (best) {
      e.preventDefault();
      best.focus();
      try {
        best.select();
      } catch (err) {
        /* abaikan jika tipe input tidak mendukung select() */
      }
    }
  };

  return (
    <div
      style={{
        padding: "clamp(1rem, 4vw, 2.5rem)",
        background: C.bg,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {saveNotif && (
        <div
          style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.25rem",
            zIndex: 999,
            background: C.panel,
            border: `1px solid ${C.cyan}`,
            color: C.cyan,
            padding: "0.65rem 1.25rem",
            fontSize: "0.72rem",
            fontWeight: 900,
            letterSpacing: "1.5px",
            fontFamily: "'Courier New', monospace",
            boxShadow: glow(theme, `0 0 16px ${C.cyan}40`),
          }}
        >
          ✓ HARGA BERHASIL DIUPDATE
        </div>
      )}
      <CircuitBg />
      <CornerGlow />

      {/* Header */}
      <div style={{ marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "4px",
            color: C.muted,
            fontFamily: "'Courier New', monospace",
            marginBottom: "4px",
          }}
        >
          KONFIGURASI
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.8rem, 6vw, 3.5rem)",
              fontWeight: 900,
              color: C.text,
              margin: 0,
              letterSpacing: "-3px",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
              lineHeight: 0.9,
            }}
          >
            Rate Config
          </h1>
          {/* Season selector */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
            {seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  background: selectedId === s.id ? C.yellow : "transparent",
                  border: `1px solid ${selectedId === s.id ? C.yellow : C.border}`,
                  color: selectedId === s.id ? "#000" : C.muted,
                  padding: "4px 14px",
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                  boxShadow:
                    selectedId === s.id
                      ? glow(theme, `0 0 12px ${C.yellow}40`)
                      : "none",
                }}
              >
                {s.name}
                {s.isActive && (
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "0.5rem",
                      color: selectedId === s.id ? "#000" : C.cyan,
                    }}
                  >
                    ●
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "40px",
            height: "2px",
            background: C.yellow,
            marginTop: "12px",
            boxShadow: glow(theme, `0 0 10px ${C.yellow}`),
          }}
        />
      </div>

      {!selectedSeason ? (
        <div
          style={{
            color: C.muted,
            fontFamily: "monospace",
            letterSpacing: "3px",
            fontSize: "0.75rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          PILIH SEASON
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ← baru: durasi season */}
          <SeasonDurationForm
            key={`${selectedSeason.id}-${selectedSeason.endDate}`}
            season={selectedSeason}
            onSave={handleSaveDuration}
            loading={loading}
          />

          {/* Rate form */}
          <div ref={formWrapRef} onKeyDown={handleFormKeyDown}>
            <RateForm
              key={savedFlag}
              seasonId={selectedSeason.id}
              onSaved={handleSaved}
              updateRates={updateRates}
              currentRates={
                selectedSeason.rateHistory?.length > 0
                  ? [...selectedSeason.rateHistory].sort(
                      (a, b) =>
                        new Date(b.effectiveDate) - new Date(a.effectiveDate),
                    )[0].rates
                  : []
              }
              loading={loading}
            />
          </div>

          {/* History */}
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
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <History size={13} strokeWidth={2} color={C.muted} />
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  letterSpacing: "3px",
                  color: C.muted,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                HISTORY RATE — {selectedSeason.name}
              </span>
            </div>
            <div style={{ padding: "1rem" }}>
              <RateHistoryPanel
                rateHistory={selectedSeason.rateHistory || []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateConfigPage;