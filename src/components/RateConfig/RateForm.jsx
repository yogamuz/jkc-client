import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext"; // sesuaikan path
import {
  useRateConfigColors,
  getInputS,
  getLabelS,
  glow,
  TIER_PRESETS,
  emptyRate,
  RATE_HEADERS,
  toDisplay,
  fromDisplay,
} from "./rateConfig.utils";

const RateForm = ({ seasonId, onSaved, updateRates, loading }) => {
  const C = useRateConfigColors();
  const { theme } = useTheme();
  const inputS = getInputS(C);
  const labelS = getLabelS(C);

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
              boxShadow: loading ? "none" : glow(theme, `0 0 16px ${C.yellow}40`),
            }}
          >
            {loading ? "MENYIMPAN..." : "SIMPAN RATE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateForm;