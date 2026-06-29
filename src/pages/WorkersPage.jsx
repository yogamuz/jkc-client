import { useEffect, useState, useCallback } from "react";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import WorkerDetailPanel from "../components/DataPages/WorkersDetailPanel";
import WorkersTable from "../components/DataPages/WorkersTable";
import WorkersSummaryCards from "../components/DataPages/WorkersSummaryCards";
import { C, apiFetch } from "../components/DataPages/workers.utils";

const WorkersPage = ({ seasons = [], activeSeasonId = "" }) => {
  const [seasonId, setSeasonId] = useState(activeSeasonId || "");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = seasonId ? `?seasonId=${seasonId}` : "";
      const res = await apiFetch(`/api/workers${params}`);
      setWorkers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  if (selectedWorker) {
    return (
      <WorkerDetailPanel
        workerName={selectedWorker}
        seasons={seasons}
        onBack={() => setSelectedWorker(null)}
      />
    );
  }

  return (
    <div style={{ padding: "clamp(1rem, 4vw, 2.5rem)", background: C.bg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <CircuitBg />
      <CornerGlow />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "4px", color: C.muted, fontFamily: "'Courier New', monospace", marginBottom: "4px" }}>
            // DATA
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: 900, color: C.yellow, margin: 0, letterSpacing: "-2px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", lineHeight: 0.9, textShadow: `0 0 40px ${C.yellow}60` }}>
            Workers
          </h1>
          <div style={{ width: "40px", height: "2px", background: C.yellow, marginTop: "10px", boxShadow: `0 0 10px ${C.yellow}` }} />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            style={{ background: "#0A0A0C", border: `1px solid ${C.border}`, color: C.text, padding: "0.6rem 0.875rem", fontFamily: "'Courier New', monospace", fontSize: "0.78rem", fontWeight: 700, outline: "none", cursor: "pointer", letterSpacing: "1px" }}
          >
            <option value="">SEMUA SEASON</option>
            {seasons.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <WorkersSummaryCards workers={workers} />

      {error && (
        <div style={{ background: "rgba(255,60,172,0.06)", border: `1px solid ${C.magenta}`, padding: "0.75rem 1.25rem", color: C.magenta, fontWeight: 900, fontSize: "0.85rem", marginBottom: "1.25rem", fontFamily: "'Courier New', monospace", position: "relative", zIndex: 1 }}>
          ⚠ {error}
        </div>
      )}

      <WorkersTable
        workers={workers}
        loading={loading}
        onSelectWorker={setSelectedWorker}
      />
    </div>
  );
};

export default WorkersPage;