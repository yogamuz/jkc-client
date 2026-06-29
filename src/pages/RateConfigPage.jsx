import { useEffect, useState } from "react";
import { Plus, Trash2, History, SlidersHorizontal } from "lucide-react";
import useSeason from "../hooks/useSeason";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";

const C = {
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

const inputS = {
  background: "#0A0A0C",
  border: `1px solid ${C.border}`,
  padding: "0.45rem 0.7rem",
  color: C.text,
  fontWeight: 600,
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "'Courier New', monospace",
  width: "100%",
};

const labelS = {
  fontSize: "0.55rem",
  color: C.muted,
  fontWeight: 900,
  letterSpacing: "2px",
  fontFamily: "'Courier New', monospace",
  marginBottom: "4px",
  display: "block",
};

const TIER_PRESETS = ["EPIC", "LEGEND", "MAWI", "HONOR", "GLORY", "IMO"];

const emptyRate = () => ({
  tier: "",
  rate_store_joki: 0,
  rate_store_jokgen: 0,
  rate_worker_joki: 0,
  rate_worker_jokgen: 0,
});

const RATE_HEADERS = [
  "TIER",
  "HARGA JOKI RANK /star",
  "HARGA JOKI GEN /star",
  "GAJI WORKER RANK /star",
  "GAJI WORKER GEN /star",
  "",
];

const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const toDisplay = (n) => (n ? Number(n).toLocaleString("id-ID") : "");
const fromDisplay = (s) => Number(s.replace(/\./g, "")) || 0;
// ── Rate Form ─────────────────────────────────────────────
const RateForm = ({ seasonId, onSaved, updateRates, loading }) => {
  const [rates, setRates] = useState(
    TIER_PRESETS.map((tier) => ({ ...emptyRate(), tier })),
  );
  const [note, setNote] = useState("");
  const [usePreset, setUsePreset] = useState(true);

  const setRate = (i, field, val) =>
    setRates((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        [field]: field === "tier" ? val.toUpperCase() : Number(val) || 0,
      };
      return next;
    });

  const addRow = () => setRates((prev) => [...prev, emptyRate()]);
  const removeRow = (i) =>
    setRates((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const valid = rates.filter((r) => r.tier.trim());
    if (!valid.length) return;
    await updateRates(seasonId, { rates: valid, note });
    onSaved();
  };

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "0.65rem 1.25rem",
          background: "rgba(255,230,0,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "3px",
            color: C.yellow,
            fontFamily: "'Courier New', monospace",
          }}
        >
          // SET RATE BARU
        </span>
        <button
          onClick={addRow}
          style={{
            background: "transparent",
            border: `1px solid ${C.cyan}`,
            color: C.cyan,
            padding: "3px 10px",
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "1.5px",
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Plus size={11} strokeWidth={2.5} /> TAMBAH TIER
        </button>
      </div>

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          overflowX: "auto",
        }}
      >
        {/* table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 36px",
            minWidth: "480px",
            gap: "0.5rem",
            marginBottom: "2px",
          }}
        >
{RATE_HEADERS.map((h) => (
  <div
    key={h}
    style={{
      fontSize: "0.55rem",
      color: C.muted,
      fontWeight: 900,
      letterSpacing: "1.5px",
      fontFamily: "'Courier New', monospace",
    }}
  >
    {h}
  </div>
))}
        </div>

        {/* rows */}
        {rates.map((r, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 36px",
              gap: "0.5rem",
              alignItems: "center",
              minWidth: "480px",
            }}
          >
            <input
              style={{
                ...inputS,
                fontWeight: 900,
                color: C.yellow,
                letterSpacing: "1px",
              }}
              value={r.tier}
              placeholder="EPIC"
              onChange={(e) => setRate(i, "tier", e.target.value)}
            />
            <input
              style={inputS}
              type="text"
              inputMode="numeric"
              value={toDisplay(r.rate_store_joki)}
              placeholder="5.000"
              onChange={(e) =>
                setRate(i, "rate_store_joki", fromDisplay(e.target.value))
              }
            />
            <input
              style={inputS}
              type="text"
              inputMode="numeric"
              value={toDisplay(r.rate_store_jokgen)}
              placeholder="7.000"
              onChange={(e) =>
                setRate(i, "rate_store_jokgen", fromDisplay(e.target.value))
              }
            />
            <input
              style={{ ...inputS, color: C.cyan }}
              type="text"
              inputMode="numeric"
              value={toDisplay(r.rate_worker_joki)}
              placeholder="2.500"
              onChange={(e) =>
                setRate(i, "rate_worker_joki", fromDisplay(e.target.value))
              }
            />
            <input
              style={{ ...inputS, color: C.cyan }}
              type="text"
              inputMode="numeric"
              value={toDisplay(r.rate_worker_jokgen)}
              placeholder="3.000"
              onChange={(e) =>
                setRate(i, "rate_worker_jokgen", fromDisplay(e.target.value))
              }
            />
            <button
              onClick={() => removeRow(i)}
              style={{
                background: "transparent",
                border: "none",
                color: C.muted,
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.magenta)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* note */}
        <div style={{ marginTop: "0.25rem" }}>
          <label style={labelS}>CATATAN (opsional)</label>
          <input
            style={inputS}
            value={note}
            placeholder="misal: update rate minggu ke-2 Juni"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* save */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "0.25rem",
          }}
        >
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              background: loading ? "transparent" : C.yellow,
              border: `1px solid ${loading ? C.muted : C.yellow}`,
              color: loading ? C.muted : "#000",
              padding: "0.5rem 1.75rem",
              fontWeight: 900,
              fontSize: "0.8rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "2px",
              boxShadow: loading ? "none" : `0 0 16px ${C.yellow}40`,
            }}
          >
            {loading ? "MENYIMPAN..." : "SIMPAN RATE"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Rate History Table ────────────────────────────────────
const RateHistoryPanel = ({ rateHistory }) => {
  const [openIdx, setOpenIdx] = useState(0); // expand entry terbaru by default

  const sorted = [...rateHistory].sort(
    (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate),
  );

  if (!sorted.length)
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: C.muted,
          fontFamily: "monospace",
          letterSpacing: "3px",
          fontSize: "0.72rem",
        }}
      >
        BELUM ADA HISTORY RATE
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {sorted.map((entry, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${i === 0 ? C.yellow + "60" : C.border}`,
            overflow: "hidden",
          }}
        >
          {/* entry header */}
          <button
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            style={{
              width: "100%",
              background: i === 0 ? "rgba(255,230,0,0.04)" : "transparent",
              border: "none",
              borderBottom: openIdx === i ? `1px solid ${C.border}` : "none",
              padding: "0.65rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: i === 0 ? C.yellow : C.muted,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {fmtDate(entry.effectiveDate)}
              </span>
              {i === 0 && (
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 900,
                    letterSpacing: "2px",
                    color: "#000",
                    background: C.yellow,
                    padding: "1px 8px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  AKTIF
                </span>
              )}
              {entry.note && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: C.muted,
                    fontFamily: "monospace",
                  }}
                >
                  — {entry.note}
                </span>
              )}
            </div>
            <span style={{ color: C.muted, fontSize: "0.7rem" }}>
              {openIdx === i ? "▲" : "▼"}
            </span>
          </button>

          {/* entry body */}
          {openIdx === i && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                      "TIER",
                      "HARGA JOKI RANK",
                      "HARGA JOKI GEN",
                      "GAJI WORKER RANK",
                      "GAJI WORKER GEN",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          letterSpacing: "2px",
                          color: C.muted,
                          fontFamily: "'Courier New', monospace",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entry.rates.map((r, ri) => (
                    <tr
                      key={ri}
                      style={{
                        borderBottom:
                          ri < entry.rates.length - 1
                            ? `1px solid ${C.border}`
                            : "none",
                        background:
                          ri % 2 === 0
                            ? "transparent"
                            : "rgba(255,255,255,0.01)",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.5rem 1rem",
                          fontFamily: "'Courier New', monospace",
                          fontWeight: 900,
                          fontSize: "0.82rem",
                          color: C.yellow,
                        }}
                      >
                        {r.tier}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem 1rem",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: C.text,
                        }}
                      >
                        {fmtRp(r.rate_store_joki)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem 1rem",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: C.text,
                        }}
                      >
                        {fmtRp(r.rate_store_jokgen)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem 1rem",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: C.cyan,
                        }}
                      >
                        {fmtRp(r.rate_worker_joki)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem 1rem",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: C.cyan,
                        }}
                      >
                        {fmtRp(r.rate_worker_jokgen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Main RateConfigPage ───────────────────────────────────
const RateConfigPage = ({ seasons = [] }) => {
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
                    selectedId === s.id ? `0 0 12px ${C.yellow}40` : "none",
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
            boxShadow: `0 0 10px ${C.yellow}`,
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
