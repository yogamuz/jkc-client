import { useDataPageColors, cell, glow } from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext";

const ACTION_COLOR_KEY = {
  CREATE: "green",
  UPDATE: "cyan",
  DELETE: "magenta",
};

const FIELD_LABEL = {
  status: "Status",
  workerSalaryPaid: "Gaji pekerja",
  rateHistory: "Rate",
  startDate: "Tanggal mulai",
  endDate: "Tanggal selesai",
};

const SERVICE_LABEL = {
  joki: "Joki Rank",
  jokgen: "Joki Gendong",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

const fmtRupiah = (n) =>
  n && n > 0 ? `Rp${Number(n).toLocaleString("id-ID")}` : "belum diatur";

const fmtValue = (val) => {
  if (val === null || val === undefined || val === "") return "kosong";
  if (typeof val === "boolean") return val ? "Ya" : "Tidak";
  if (typeof val === "string" && ISO_DATE.test(val)) {
    return new Date(val).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (Array.isArray(val)) return val.map(fmtValue).join(", ");
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => `${FIELD_LABEL[k] || k}: ${fmtValue(v)}`)
      .join(", ");
  }
  return String(val);
};

const renderRateHistory = (val, mutedColor) => {
  const added = Array.isArray(val?.added) ? val.added : [];
  return (
    <details>
      <summary style={{ cursor: "pointer" }}>
        Rate diperbarui ({added.length} tier)
        {val?.note ? ` — catatan: ${val.note}` : ""}
      </summary>
      <div style={{ marginTop: "0.4rem", display: "grid", gap: "0.4rem" }}>
        {added.map((t, idx) => (
          <div key={`${t.tier}-${idx}`}>
            <strong>{t.tier}</strong>
            <div style={{ color: mutedColor }}>
              Harga toko: Joki Rank {fmtRupiah(t.rate_store_joki)}, Joki
              Gendong {fmtRupiah(t.rate_store_jokgen)}
            </div>
            <div style={{ color: mutedColor }}>
              Gaji pekerja: Joki Rank {fmtRupiah(t.rate_worker_joki)}, Joki
              Gendong {fmtRupiah(t.rate_worker_jokgen)}
            </div>
            {Array.isArray(t.promos) &&
              t.promos.map((p, pIdx) => (
                <div key={pIdx} style={{ color: mutedColor }}>
                  Promo {SERVICE_LABEL[p.service] || p.service}: {p.buyQty}+
                  {p.bonusQty} = {fmtRupiah(p.price)}
                </div>
              ))}
          </div>
        ))}
      </div>
    </details>
  );
};

const AuditLogTable = ({ logs, loading }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  const fmtDateTime = (d) =>
    d
      ? new Date(d).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const fmtChanges = (changes) => {
    if (!changes) return "—";
    try {
      return Object.entries(changes).map(([key, val]) => {
        const label = FIELD_LABEL[key] || key;

        if (key === "rateHistory" && val && typeof val === "object") {
          return (
            <div key={key}>
              {renderRateHistory(val, C.muted)}
            </div>
          );
        }

        if (key === "workerSalaryPaid" && val && typeof val === "object") {
          return (
            <div key={key}>
              {label}: {val.workerName} —{" "}
              {val.isPaid ? "sudah dibayar" : "belum dibayar"}
            </div>
          );
        }

        if (val && typeof val === "object" && ("from" in val || "to" in val)) {
          return (
            <div key={key}>
              {label}: {fmtValue(val.from)} → {fmtValue(val.to)}
            </div>
          );
        }

        return (
          <div key={key}>
            {label}: {fmtValue(val)}
          </div>
        );
      });
    } catch {
      return "—";
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${C.yellow}60`,
        overflow: "hidden",
        background: C.tableBg,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "700px", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["WAKTU", "AKSI", "ENTITAS", "OLEH", "PERUBAHAN"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.7rem 0.875rem",
                    fontSize: "0.6rem",
                    letterSpacing: "2px",
                    textAlign: "left",
                    color: C.yellow,
                    borderRight: `1px solid ${C.border}`,
                    background: C.bg,
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>
                  MEMUAT...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: C.dim, fontFamily: "monospace", letterSpacing: "4px", fontSize: "0.72rem" }}>
                  BELUM ADA LOG
                </td>
              </tr>
            ) : (
              logs.map((log, i) => {
                const accent = C[ACTION_COLOR_KEY[log.action]] || C.muted;
                return (
                  <tr
                    key={log._id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: i % 2 === 0 ? C.tableBg : C.rowAlt,
                    }}
                  >
                    <td style={cell(false, C)}>{fmtDateTime(log.createdAt)}</td>
                    <td style={{ ...cell(false, C), verticalAlign: "middle" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          letterSpacing: "1px",
                          color: accent,
                          border: `1px solid ${accent}`,
                          fontFamily: "'Courier New', monospace",
                          boxShadow: glow(theme, `0 0 6px ${accent}40`),
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={cell(true, C)}>
                      {log.entityType}{" "}
                      <span style={{ color: C.muted, fontWeight: 400 }}>
                        #{String(log.entityId).slice(-6)}
                      </span>
                    </td>
                    <td style={cell(false, C)}>
                      {log.performedBy?.username
                        ? log.performedBy.username.toUpperCase()
                        : "SYSTEM"}
                    </td>
                    <td style={{ ...cell(false, C), whiteSpace: "normal", maxWidth: "360px" }}>
                      {fmtChanges(log.changes)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;