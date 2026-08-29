import { useEffect, useState, useCallback } from "react";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import DatePicker from "../components/ui/DatePicker";
import AuditLogTable from "../components/auditLog/AuditLogTable";
import useAuditLog from "../hooks/useAuditLog";
import { useDataPageColors } from "../constants/dataPage.constants";

const AuditLogPage = () => {
  const C = useDataPageColors();
  const { logs, loading, error, fetchLogs } = useAuditLog();
  const [entityType, setEntityType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const applyFilters = useCallback(() => {
    const filters = {};
    if (entityType) filters.entityType = entityType;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    fetchLogs(filters);
  }, [entityType, dateFrom, dateTo, fetchLogs]);

  useEffect(() => {
    fetchLogs({});
  }, [fetchLogs]);

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

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
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
            // OWNER ONLY
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 4rem)",
              fontWeight: 900,
              color: C.yellow,
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
              lineHeight: 0.9,
              textShadow: `0 0 40px ${C.yellow}60`,
            }}
          >
            Audit Log
          </h1>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: C.yellow,
              marginTop: "10px",
              boxShadow: `0 0 10px ${C.yellow}`,
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              color: C.text,
              padding: "0.55rem 0.875rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.78rem",
              fontWeight: 700,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">SEMUA ENTITAS</option>
            <option value="Order">ORDER</option>
            <option value="Season">SEASON</option>
          </select>
          <DatePicker value={dateFrom} onChange={setDateFrom} style={{ width: "140px" }} />
          <span style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.75rem" }}>—</span>
          <DatePicker value={dateTo} onChange={setDateTo} style={{ width: "140px" }} />
          <button
            onClick={applyFilters}
            style={{
              background: "transparent",
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              padding: "0.55rem 1rem",
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "1.5px",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
            }}
          >
            TERAPKAN
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(255,60,172,0.06)",
            border: `1px solid ${C.magenta}`,
            padding: "0.75rem 1.25rem",
            color: C.magenta,
            fontWeight: 900,
            fontSize: "0.85rem",
            marginBottom: "1.25rem",
            fontFamily: "'Courier New', monospace",
            position: "relative",
            zIndex: 1,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <AuditLogTable logs={logs} loading={loading} />
    </div>
  );
};

export default AuditLogPage;