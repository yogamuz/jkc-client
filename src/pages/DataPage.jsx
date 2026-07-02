import { useEffect, useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import useOrder from "../hooks/useOrder";
import { useDataPageColors, glow } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import SummaryCards from "../components/DataPages/SummaryCards";
import OrderTable from "../components/DataPages/OrderTable";
import AddOrderModal from "../components/DataPages/AddOrderModal";
import ImportExcelModal from "../components/DataPages/ImportExcelModal";
import DatePicker from "../components/ui/DatePicker";

const STATUS_CYCLE = { PENDING: "PROCESS", PROCESS: "DONE", DONE: "PENDING" };

const DEFAULT_KEYS = new Set([
  "no",
  "customerName",
  "date",
  "category",
  "payment",
  "price",
  "workers",
  "totalWorkerSalary",
  "profit",
  "status",
  "paid",
  "aksi",
  "REQ",
  "req",
  "WORKER",
  "worker",
  "TYPE",
  "type",
  "PAID",
]);
const _t = new Date();
const TODAY = `${_t.getFullYear()}-${String(_t.getMonth() + 1).padStart(2, "0")}-${String(_t.getDate()).padStart(2, "0")}`;

// ── Filter bar ────────────────────────────────────────────
const FilterBar = ({ filters, onChange, onReset }) => {
  const C = useDataPageColors();
  const hasFilter =
    filters.dateFrom || filters.dateTo || filters.status || filters.workerName;

  return (
    <div style={{ marginBottom: "1.25rem", position: "relative", zIndex: 1 }}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {/* Quick: Hari ini */}
        <button
          onClick={() =>
            filters.dateFrom === TODAY && filters.dateTo === TODAY
              ? onChange({ dateFrom: "", dateTo: "" })
              : onChange({ dateFrom: TODAY, dateTo: TODAY })
          }
          style={{
            background:
              filters.dateFrom === TODAY && filters.dateTo === TODAY
                ? C.yellow
                : "transparent",
            border: `1px solid ${filters.dateFrom === TODAY && filters.dateTo === TODAY ? C.yellow : C.border}`,
            color:
              filters.dateFrom === TODAY && filters.dateTo === TODAY
                ? "#000"
                : C.muted,
            padding: "5px 14px",
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "1.5px",
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            boxShadow:
              filters.dateFrom === TODAY && filters.dateTo === TODAY
                ? `0 0 10px ${C.yellow}40`
                : "none",
          }}
        >
          HARI INI
        </button>

        {/* Date from */}
        <div>
          <div
            style={{
              fontSize: "0.52rem",
              color: C.muted,
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "monospace",
              marginBottom: "3px",
            }}
          >
            DARI
          </div>
          <DatePicker
            value={filters.dateFrom}
            onChange={(val) => onChange({ dateFrom: val })}
          />
        </div>

        {/* Date to */}
        <div>
          <div
            style={{
              fontSize: "0.52rem",
              color: C.muted,
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "monospace",
              marginBottom: "3px",
            }}
          >
            SAMPAI
          </div>
          <DatePicker
            value={filters.dateTo}
            onChange={(val) => onChange({ dateTo: val })}
          />
        </div>

        {/* Status filter */}
        <div>
          <div
            style={{
              fontSize: "0.52rem",
              color: C.muted,
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "monospace",
              marginBottom: "3px",
            }}
          >
            STATUS
          </div>
          <select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            style={{
              background: C.trackBg,
              border: `1px solid ${filters.status ? C.cyan : C.border}`,
              color: filters.status ? C.cyan : C.muted,
              padding: "5px 10px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              outline: "none",
              boxShadow: filters.status ? `0 0 6px ${C.cyan}30` : "none",
            }}
          >
            <option value="">SEMUA</option>
            {["PENDING", "DONE", "PROCESS"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Worker filter */}
        <div>
          <div
            style={{
              fontSize: "0.52rem",
              color: C.muted,
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "monospace",
              marginBottom: "3px",
            }}
          >
            WORKER
          </div>
          <input
            type="text"
            value={filters.workerName}
            onChange={(e) =>
              onChange({ workerName: e.target.value.toUpperCase() })
            }
            placeholder="ACIL"
            style={{
              background: C.trackBg,
              border: `1px solid ${filters.workerName ? C.cyan : C.border}`,
              color: filters.workerName ? C.cyan : C.text,
              padding: "5px 10px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              outline: "none",
              width: "90px",
            }}
          />
        </div>

        {/* Reset */}
        {hasFilter && (
          <button
            onClick={onReset}
            style={{
              background: "transparent",
              border: `1px solid ${C.magenta}`,
              color: C.magenta,
              padding: "5px 12px",
              fontSize: "0.65rem",
              fontWeight: 900,
              letterSpacing: "1.5px",
              cursor: "pointer",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <X size={11} strokeWidth={2.5} /> RESET
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main DataPage ─────────────────────────────────────────
const DataPage = ({ season, user }) => {
  const isOwner = user?.role === "owner";
  const C = useDataPageColors();
  const { theme } = useTheme();
  const {
    orders,
    summary,
    loading,
    error,
    fetchOrders,
    fetchSummary,
    create,
    update,
    remove,
    markPaid,
  } = useOrder();
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    workerName: "",
  });

  useEffect(() => {
    if (season?.id) {
      fetchOrders(season.id);
      if (isOwner) fetchSummary(season.id);
    }
  }, [season?.id, isOwner]);

  const handleFilterChange = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const handleFilterReset = () =>
    setFilters({ dateFrom: "", dateTo: "", status: "", workerName: "" });

  // Filter orders di frontend supaya instant tanpa API call
  const filteredOrders = orders.filter((o) => {
    const orderDate = o.date ? o.date.split("T")[0] : "";
    if (filters.dateFrom && orderDate < filters.dateFrom) return false;
    if (filters.dateTo && orderDate > filters.dateTo) return false;
    if (filters.status && o.status !== filters.status) return false;
    if (
      filters.workerName &&
      !o.workers?.some((w) => w.name.includes(filters.workerName))
    )
      return false;
    return true;
  });

  const hasFilter = !!(
    filters.dateFrom ||
    filters.dateTo ||
    filters.status ||
    filters.workerName
  );

  const handleCreate = async (body) => {
    const res = await create(body);
    if (res) {
      setShowModal(false);
      fetchOrders(season.id);
      if (isOwner) fetchSummary(season.id);
    }
  };

  const handleUpdate = async (id, body) => {
    await update(id, body);
    fetchOrders(season.id);
    fetchSummary(season.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus order ini?")) return;
    await remove(id);
    fetchOrders(season.id);
    fetchSummary(season.id);
  };

  const handleMarkPaid = async (orderId, workerName, isPaid) => {
    await markPaid(orderId, workerName, isPaid);
    fetchOrders(season.id);
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const nextStatus = STATUS_CYCLE[currentStatus] || "PENDING";
    await update(orderId, { status: nextStatus });
    fetchOrders(season.id);
    fetchSummary(season.id);
  };

  const extraCols = (season?.extraColumns || []).filter(
    (c) => !DEFAULT_KEYS.has(c.key),
  );

  const allCols = [
    { key: "no", label: "#", width: "44px" },
    { key: "customerName", label: "CUSTOMER", width: "140px" },
    { key: "date", label: "TANGGAL", width: "140px" },
    { key: "category", label: "KATEGORI", width: "130px" },
    { key: "payment", label: "BAYAR", width: "80px" },
    { key: "price", label: "HARGA", width: "110px" },
    { key: "workers", label: "WORKER", width: "120px" },
    { key: "totalWorkerSalary", label: "GAJI", width: "110px" },
    { key: "profit", label: "PROFIT", width: "110px" },
    { key: "status", label: "STATUS", width: "90px" },
    ...extraCols.map((c) => ({
      key: c.key,
      label: c.label,
      width: "110px",
      extra: true,
    })),
    { key: "paid", label: "PAID", width: "110px" },
    { key: "aksi", label: "AKSI", width: "80px" },
  ];

  if (!season)
    return (
      <div
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: C.dim,
          fontFamily: "monospace",
          letterSpacing: "3px",
          fontSize: "0.8rem",
          background: C.bg,
        }}
      >
        PILIH SEASON DI SIDEBAR
      </div>
    );

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
            // DATA
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
              textShadow: glow(theme, `0 0 40px ${C.yellow}60`),
            }}
          >
            {season.name}
          </h1>
          <div
            style={{
              fontSize: "0.78rem",
              color: C.mutedAlt,
              fontFamily: "monospace",
              marginTop: "8px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            {season.label}
          </div>
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

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              fetchOrders(season.id);
              fetchSummary(season.id);
            }}
            style={{
              background: "transparent",
              border: `1px solid ${C.outlineBorder}`,
              color: C.text,
              padding: "0.6rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = C.outlineBorderHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = C.outlineBorder)
            }
          >
            <RefreshCw size={13} strokeWidth={2} /> REFRESH
          </button>
          <button
            onClick={() => setShowImport(true)}
            style={{
              background: "transparent",
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              padding: "0.6rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
              boxShadow: `0 0 8px ${C.cyan}20`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,229,255,0.07)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            ↑ IMPORT EXCEL
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: C.yellow,
              border: `1px solid ${C.yellow}`,
              color: "#000",
              padding: "0.65rem 1.5rem",
              fontWeight: 900,
              fontSize: "0.78rem",
              letterSpacing: "2px",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: `0 0 20px ${C.yellow}50`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 30px ${C.yellow}80`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 20px ${C.yellow}50`)
            }
          >
            <Plus size={15} strokeWidth={2.5} /> TAMBAH ORDER
          </button>
        </div>
      </div>

      {/* SummaryCards: otomatis tampilkan data filtered kalau ada filter aktif */}
      <SummaryCards
        summary={summary}
        filteredOrders={filteredOrders}
        hasFilter={hasFilter}
        isOwner={isOwner}
      />

      {error && isOwner && (
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

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <OrderTable
        orders={filteredOrders}
        loading={loading}
        allCols={allCols}
        extraCols={extraCols}
        season={season}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        onMarkPaid={handleMarkPaid}
        onUpdate={handleUpdate}
      />

      {showModal && (
        <AddOrderModal
          season={season}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          loading={loading}
        />
      )}
      {showImport && (
        <ImportExcelModal
          season={season}
          onClose={() => setShowImport(false)}
          onCreate={handleCreate}
          loading={loading}
        />
      )}
    </div>
  );
};

export default DataPage;
