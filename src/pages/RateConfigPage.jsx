import { useEffect, useState } from "react";
import { History } from "lucide-react";
import useSeason from "../hooks/useSeason";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import { useTheme } from "../context/ThemeContext"; // sesuaikan path
import RateForm from "../components/RateConfig/RateForm";
import RateHistoryPanel from "../components/RateConfig/RateHistoryPanel";
import { useRateConfigColors, glow } from "../components/RateConfig/rateConfig.utils";

// ── Main RateConfigPage ───────────────────────────────────
const RateConfigPage = ({ seasons = [] }) => {
  const C = useRateConfigColors();
  const { theme } = useTheme();
  const { loading, updateRates, getSeasonById } = useSeason();
  const [selectedId, setSelectedId] = useState(null);
  const [savedFlag, setSavedFlag] = useState(0);

  // auto-select season aktif
  useEffect(() => {
    if (seasons.length > 0 && !selectedId) {
      const active = seasons.find((s) => s.isActive) || seasons[0];
      setSelectedId(active.id);
    }
  }, [seasons]);

  const selectedSeason = seasons.find((s) => s.id === selectedId) || null;

  const handleSaved = () => setSavedFlag((f) => f + 1); // trigger re-render

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
          // KONFIGURASI
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
          {/* Rate form */}
          <RateForm
            key={savedFlag}
            seasonId={selectedSeason.id}
            onSaved={handleSaved}
            updateRates={updateRates}
            loading={loading}
          />

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