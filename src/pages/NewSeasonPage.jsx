import { useState } from "react";
import useSeason from "../hooks/useSeason";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import { useDataPageColors, glow } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext";

const toDisplay = (n) => (n ? Number(n).toLocaleString("id-ID") : "");
const fromDisplay = (s) => Number(s.replace(/\./g, "")) || 0;

const TIER_PRESETS = ["EPIC", "LEGEND", "MAWI", "HONOR", "GLORY", "IMO"];

const emptyRate = (tier = "") => ({
  tier,
  rate_store_joki:    0,
  rate_store_jokgen:  0,
  rate_worker_joki:   0,
  rate_worker_jokgen: 0,
});

const NewSeasonPage = ({ onCreated }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();
  const { create, loading, error } = useSeason();

  const inputS = {
    background: C.trackBg,
    border: `1px solid ${C.border}`,
    padding: "0.55rem 0.875rem",
    color: C.text,
    fontWeight: 600,
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "'Courier New', monospace",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelS = {
    fontSize: "0.58rem",
    color: C.muted,
    fontWeight: 900,
    letterSpacing: "2px",
    fontFamily: "'Courier New', monospace",
    marginBottom: "5px",
    display: "block",
  };

  const [name, setName]   = useState("");
  const [label, setLabel] = useState("");
  const [withRates, setWithRates] = useState(true);
  const [rates, setRates] = useState(TIER_PRESETS.map((t) => emptyRate(t)));

  const setRate = (i, field, val) =>
    setRates((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        [field]: field === "tier" ? val.toUpperCase() : fromDisplay(val),
      };
      return next;
    });

  const addRow    = () => setRates((p) => [...p, emptyRate()]);
  const removeRow = (i) => setRates((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const body = {
      name: name.trim(),
      label: label.trim() || `Season ${name.trim().toUpperCase()}`,
      rates: withRates ? rates.filter((r) => r.tier.trim()) : [],
    };
    const res = await create(body);
    if (res?.data?.id) onCreated(res.data.id);
    else if (res?.data) onCreated(res.data.id ?? null);
  };

  return (
    <div style={{ padding: "clamp(1rem, 4vw, 2.5rem)", background: C.bg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <CircuitBg />
      <CornerGlow />

      {/* Header */}
      <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "4px", color: C.muted, fontFamily: "'Courier New', monospace", marginBottom: "4px" }}>
          // BUAT SEASON BARU
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-3px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", lineHeight: 0.9 }}>
          New Season
        </h1>
        <div style={{ width: "40px", height: "2px", background: C.yellow, marginTop: "12px", boxShadow: glow(theme, `0 0 10px ${C.yellow}`) }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", zIndex: 1, maxWidth: "800px" }}>

        {/* Basic info */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0.65rem 1.25rem", background: C.yellowBg }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "3px", color: C.yellow, fontFamily: "'Courier New', monospace" }}>
              // INFO SEASON
            </span>
          </div>
          <div style={{ padding: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 160px", minWidth: "0", boxSizing: "border-box" }}>
              <label style={labelS}>NAMA SEASON *</label>
              <input
                style={inputS}
                placeholder="S42"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label style={labelS}>LABEL</label>
              <input
                style={inputS}
                placeholder="Season 42"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>
        </div>

        {/* Rate setup */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0.65rem 1.25rem", background: C.yellowBg, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "3px", color: C.yellow, fontFamily: "'Courier New', monospace" }}>
              // RATE AWAL (opsional)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={withRates}
                  onChange={(e) => setWithRates(e.target.checked)}
                  style={{ accentColor: C.yellow, width: "14px", height: "14px" }}
                />
                <span style={{ fontSize: "0.62rem", color: C.muted, fontFamily: "monospace", fontWeight: 700, letterSpacing: "1px" }}>
                  SET RATE SEKARANG
                </span>
              </label>
              {withRates && (
                <button
                  onClick={addRow}
                  style={{ background: "transparent", border: `1px solid ${C.cyan}`, color: C.cyan, padding: "3px 10px", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "1.5px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}
                >
                  + TIER
                </button>
              )}
            </div>
          </div>

          {withRates && (
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", overflowX: "auto" }}>
              {/* table header */}
              <div style={{ display: "grid",gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 36px", gap: "0.5rem", minWidth: "480px" }}>
                {["TIER", "HARGA JOKI RANK /star", "HARGA JOKI GEN /star", "GAJI WORKER RANK /star", "GAJI WORKER GEN /star", ""].map((h) => (
                  <div key={h} style={{ fontSize: "0.55rem", color: C.muted, fontWeight: 900, letterSpacing: "1.5px", fontFamily: "'Courier New', monospace" }}>{h}</div>
                ))}
              </div>

              {rates.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 36px", gap: "0.5rem", alignItems: "center", minWidth: "480px" }}>
                  <input
                    style={{ ...inputS, fontWeight: 900, color: C.yellow, letterSpacing: "1px" }}
                    value={r.tier}
                    placeholder="EPIC"
                    onChange={(e) => setRate(i, "tier", e.target.value)}
                  />
                  <input style={inputS} type="text" inputMode="numeric" value={toDisplay(r.rate_store_joki)}    placeholder="5.000"  onChange={(e) => setRate(i, "rate_store_joki",    e.target.value)} />
                  <input style={inputS} type="text" inputMode="numeric" value={toDisplay(r.rate_store_jokgen)}  placeholder="7.000"  onChange={(e) => setRate(i, "rate_store_jokgen",  e.target.value)} />
                  <input style={{ ...inputS, color: C.cyan }} type="text" inputMode="numeric" value={toDisplay(r.rate_worker_joki)}   placeholder="2.500"  onChange={(e) => setRate(i, "rate_worker_joki",   e.target.value)} />
                  <input style={{ ...inputS, color: C.cyan }} type="text" inputMode="numeric" value={toDisplay(r.rate_worker_jokgen)} placeholder="3.000"  onChange={(e) => setRate(i, "rate_worker_jokgen", e.target.value)} />
                  <button
                    onClick={() => removeRow(i)}
                    style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.magenta)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: C.magentaBg, border: `1px solid ${C.magenta}`, padding: "0.75rem 1.25rem", color: C.magenta, fontWeight: 900, fontSize: "0.85rem", fontFamily: "'Courier New', monospace" }}>
            ⚠ {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            style={{
              background: loading || !name.trim() ? "transparent" : C.yellow,
              border: `1px solid ${loading || !name.trim() ? C.muted : C.yellow}`,
              color: loading || !name.trim() ? C.muted : "#000",
              padding: "0.65rem 2rem", fontWeight: 900, fontSize: "0.85rem",
              cursor: loading || !name.trim() ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace", letterSpacing: "2px",
              boxShadow: loading || !name.trim() ? "none" : glow(theme, `0 0 20px ${C.yellow}40`),
            }}
          >
            {loading ? "MENYIMPAN..." : "BUAT SEASON"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSeasonPage;