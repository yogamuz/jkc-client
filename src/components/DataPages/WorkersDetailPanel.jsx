import { useEffect, useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import CircuitBg from "../ui/CircuitBg";
import CornerGlow from "../ui/CornerGlow";
import { C, glassCard, cell, fmtRp, fmtDate, apiFetch } from "./workers.utils";

const WorkerDetailPanel = ({ workerName, seasons, onBack }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seasonId, setSeasonId] = useState("");
  const [paidFilter, setPaidFilter] = useState("ALL");

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = seasonId ? `?seasonId=${seasonId}` : "";
      const res = await apiFetch(`/api/workers/${encodeURIComponent(workerName)}${params}`);
      setDetail(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workerName, seasonId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const statCards = detail
    ? [
        { label: "TOTAL ORDER", value: detail.totalOrders, accent: C.yellow },
        { label: "TOTAL PENDAPATAN", value: fmtRp(detail.totalEarned), accent: C.cyan },
        { label: "TOTAL DIBAYAR", value: fmtRp(detail.totalPaid), accent: C.green },
        { label: "BELUM DIBAYAR", value: fmtRp(detail.totalUnpaid), accent: C.magenta },
      ]
    : [];

  const filteredHistory = detail?.history.filter((h) => {
    if (paidFilter === "PAID") return h.isPaid;
    if (paidFilter === "UNPAID") return !h.isPaid;
    return true;
  }) || [];

  return (
    <div style={{ padding: "clamp(1rem, 4vw, 2.5rem)", background: C.bg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <CircuitBg />
      <CornerGlow />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem", position: "relative", zIndex: 1 }}>
        <div>
          <button
            onClick={onBack}
            style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Courier New', monospace", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "2px", marginBottom: "0.75rem", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            <ChevronLeft size={13} strokeWidth={2} /> BACK
          </button>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "4px", color: C.muted, fontFamily: "'Courier New', monospace", marginBottom: "4px" }}>
            // WORKER DETAIL
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 7vw, 3.5rem)", fontWeight: 900, color: C.cyan, margin: 0, letterSpacing: "-2px", fontFamily: "'Courier New', monospace", lineHeight: 0.9, textShadow: `0 0 40px ${C.cyan}60` }}>
            {workerName}
          </h1>
          <div style={{ width: "40px", height: "2px", background: C.cyan, marginTop: "10px", boxShadow: `0 0 10px ${C.cyan}` }} />
        </div>

        {/* Filter controls */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {["ALL", "UNPAID", "PAID"].map((f) => (
            <button
              key={f}
              onClick={() => setPaidFilter(f)}
              style={{
                background: paidFilter === f ? (f === "UNPAID" ? C.magenta : f === "PAID" ? C.cyan : C.yellow) : "transparent",
                border: `1px solid ${f === "UNPAID" ? C.magenta : f === "PAID" ? C.cyan : C.yellow}`,
                color: paidFilter === f ? "#000" : (f === "UNPAID" ? C.magenta : f === "PAID" ? C.cyan : C.yellow),
                padding: "0.5rem 0.875rem",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                cursor: "pointer",
                boxShadow: paidFilter === f ? `0 0 10px ${f === "UNPAID" ? C.magenta : f === "PAID" ? C.cyan : C.yellow}40` : "none",
              }}
            >
              {f}
            </button>
          ))}
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            style={{ background: "#0A0A0C", border: `1px solid ${C.border}`, color: C.text, padding: "0.55rem 0.875rem", fontFamily: "'Courier New', monospace", fontSize: "0.8rem", fontWeight: 700, outline: "none", cursor: "pointer" }}
          >
            <option value="">SEMUA SEASON</option>
            {seasons.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      {detail && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}>
          {statCards.map((s) => (
            <div key={s.label} style={glassCard(s.accent)}>
              <div style={{ fontSize: "0.55rem", color: "#9A9A9A", fontWeight: 700, letterSpacing: "2.5px", fontFamily: "'Courier New', monospace", marginBottom: "6px" }}>
                {s.label}
              </div>
              <div style={{
                fontSize: typeof s.value === "number" ? "clamp(1.4rem, 5vw, 2rem)" : "clamp(0.9rem, 3vw, 1.3rem)",
                fontWeight: 900, color: s.accent, fontFamily: "'Courier New', monospace", lineHeight: 1.1,
                textShadow: `0 0 20px ${s.accent}60`,
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(255,60,172,0.06)", border: `1px solid ${C.magenta}`, padding: "0.75rem 1.25rem", color: C.magenta, fontWeight: 900, fontSize: "0.85rem", marginBottom: "1.25rem", fontFamily: "'Courier New', monospace", position: "relative", zIndex: 1 }}>
          ⚠ {error}
        </div>
      )}

      {/* History Table */}
      <div style={{ border: `1px solid ${C.cyan}60`, overflow: "hidden", background: "#0F0F14", position: "relative", zIndex: 1 }}>
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0.65rem 1.25rem", background: "#0D0D0F" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "3px", color: C.cyan, fontFamily: "'Courier New', monospace" }}>
            // HISTORY ORDER
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "500px", width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["SEASON", "CUSTOMER", "TANGGAL", "KATEGORI", "GAJI", "STATUS BAYAR"].map((h) => (
                  <th key={h} style={{ padding: "0.65rem 0.875rem", fontSize: "0.6rem", letterSpacing: "2px", textAlign: "left", color: C.cyan, borderRight: `1px solid ${C.border}`, background: "#0D0D0F", fontFamily: "'Courier New', monospace", fontWeight: 900, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>MEMUAT...</td></tr>
              ) : !detail ? (
                <tr><td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>BELUM ADA ORDER</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>TIDAK ADA DATA</td></tr>
              ) : (
                filteredHistory.map((h, i) => (
                  <tr key={h.orderId} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "#0F0F14" : "#0D0D0F" }}>
                    <td style={cell(true)}>{h.seasonName}</td>
                    <td style={cell(true)}>{h.customerName}</td>
                    <td style={cell(false)}>{fmtDate(h.date)}</td>
                    <td style={cell(false)}>{h.category}</td>
                    <td style={{ ...cell(false), color: C.cyan, fontWeight: 700 }}>{fmtRp(h.salary)}</td>
                    <td style={{ ...cell(false), verticalAlign: "middle" }}>
                      <span style={{ display: "inline-block", padding: "2px 10px", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "1px", color: h.isPaid ? C.green : C.magenta, border: `1px solid ${h.isPaid ? C.green : C.magenta}`, fontFamily: "'Courier New', monospace", boxShadow: `0 0 6px ${h.isPaid ? C.green : C.magenta}40` }}>
                        {h.isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailPanel;