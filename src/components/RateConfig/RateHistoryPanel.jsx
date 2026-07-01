import { useState } from "react";
import { useRateConfigColors, fmtRp, fmtDate } from "./rateConfig.utils";

const RateHistoryPanel = ({ rateHistory }) => {
  const C = useRateConfigColors();
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

export default RateHistoryPanel;