import { AlertCircle, ChevronRight } from "lucide-react";
import { C, cell, fmtRp } from "./workers.utils";

const WorkersTable = ({ workers, loading, onSelectWorker }) => {
  return (
    <div style={{ border: `1px solid ${C.yellow}60`, overflow: "hidden", background: "#0F0F14", position: "relative", zIndex: 1 }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "600px", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["#", "NAMA", "TOTAL ORDER", "UNPAID ORDER", "TOTAL EARNED", "TOTAL PAID", "BELUM DIBAYAR", ""].map((h) => (
                <th key={h} style={{ padding: "0.7rem 0.875rem", fontSize: "0.6rem", letterSpacing: "2px", textAlign: "left", color: C.yellow, borderRight: `1px solid ${C.border}`, background: "#0D0D0F", fontFamily: "'Courier New', monospace", fontWeight: 900, whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && workers.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>MEMUAT...</td></tr>
            ) : workers.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>BELUM ADA WORKER</td></tr>
            ) : (
              workers.map((w, i) => (
                <tr key={w.name} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "#0F0F14" : "#0D0D0F" }}>
                  <td style={{ ...cell(false), color: "#444450", fontSize: "0.72rem" }}>{i + 1}</td>
                  <td style={{ ...cell(true), color: C.yellow }}>{w.name}</td>
                  <td style={cell(false)}>{w.totalOrders}</td>
                  <td style={{ ...cell(false), color: w.unpaidOrders > 0 ? C.magenta : C.muted }}>
                    {w.unpaidOrders > 0 ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <AlertCircle size={11} strokeWidth={2} color={C.magenta} />
                        {w.unpaidOrders}
                      </span>
                    ) : w.unpaidOrders}
                  </td>
                  <td style={{ ...cell(false), color: C.text, fontWeight: 600 }}>{fmtRp(w.totalEarned)}</td>
                  <td style={{ ...cell(false), color: C.green, fontWeight: 600 }}>{fmtRp(w.totalPaid)}</td>
                  <td style={{ ...cell(false), color: w.totalUnpaid > 0 ? C.magenta : C.muted, fontWeight: 600 }}>{fmtRp(w.totalUnpaid)}</td>
                  <td style={{ ...cell(false), textAlign: "center" }}>
                    <button
                      onClick={() => onSelectWorker(w.name)}
                      style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "'Courier New', monospace", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "1px" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                    >
                      DETAIL <ChevronRight size={11} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkersTable;