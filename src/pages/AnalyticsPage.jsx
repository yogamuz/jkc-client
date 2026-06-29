import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  User,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import useOrder from "../hooks/useOrder";
import { C } from "../constants/dataPage.constants";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";

// ── Helpers ───────────────────────────────────────────────
const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const fmtK = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}jt`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}rb`
      : String(n);

// ── Sub-components ────────────────────────────────────────

const StatCard = ({ label, value, accent, Icon }) => (
  <div
    style={{
      background: "#0F0F14",
      border: `1px solid ${accent}30`,
      padding: "1rem 1.25rem",
      position: "relative",
      flex: "1 1 140px",
      minWidth: "140px",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        color: accent,
        opacity: 0.6,
      }}
    >
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <div
      style={{
        fontSize: "0.55rem",
        color: "#9A9A9A",
        fontWeight: 700,
        letterSpacing: "2.5px",
        fontFamily: "monospace",
        marginBottom: "6px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "clamp(0.85rem, 2.5vw, 1.35rem)",
        fontWeight: 900,
        color: accent,
        fontFamily: "'Courier New', monospace",
        lineHeight: 1.1,
        textShadow: `0 0 16px ${accent}50`,
      }}
    >
      {value}
    </div>
  </div>
);

const HBarChart = ({
  data,
  colorFn,
  valueKey = "value",
  labelKey = "label",
  formatVal = (v) => v,
}) => {
  if (!data?.length) return <Empty />;
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              fontSize: "0.62rem",
              fontFamily: "monospace",
              color: C.muted,
              width: "90px",
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {d[labelKey]}
          </div>
          <div
            style={{
              flex: 1,
              background: "#0A0A0C",
              height: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${(d[valueKey] / max) * 100}%`,
                background: colorFn ? colorFn(i) : C.cyan,
                transition: "width 0.4s ease",
                minWidth: d[valueKey] > 0 ? "2px" : 0,
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.62rem",
              fontFamily: "monospace",
              color: C.text,
              width: "70px",
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {formatVal(d[valueKey])}
          </div>
        </div>
      ))}
    </div>
  );
};

const VBarChart = ({ data }) => {
  if (!data?.length) return <Empty />;
  const max = Math.max(...data.map((d) => d.omset), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "140px", // ← naikan dari 120px
        overflowX: "auto",
        overflowY: "visible", // ← tambah ini
        paddingTop: "20px", // ← tambah ruang untuk label angka di atas bar
        paddingBottom: "4px",
        boxSizing: "border-box",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            minWidth: "28px",
          }}
        >
          <div
            style={{
              fontSize: "0.5rem",
              color: C.muted,
              fontFamily: "monospace",
            }}
          >
            {fmtK(d.omset)}
          </div>
          <div
            style={{
              width: "20px",
              height: `${Math.max((d.omset / max) * 90, d.omset > 0 ? 4 : 0)}px`,
              background: C.yellow,
              boxShadow: `0 0 6px ${C.yellow}40`,
            }}
          />
          <div
            style={{
              fontSize: "0.5rem",
              color: C.muted,
              fontFamily: "monospace",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              lineHeight: 1,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ slices }) => {
  if (!slices?.length) return <Empty />;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <Empty />;

  let cumul = 0;
  const gradient = slices
    .map((s) => {
      const pct = (s.value / total) * 100;
      const from = cumul;
      cumul += pct;
      return `${s.color} ${from.toFixed(1)}% ${cumul.toFixed(1)}%`;
    })
    .join(", ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          flexShrink: 0,
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {slices.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: C.muted,
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: C.text,
                marginLeft: "auto",
                paddingLeft: "8px",
              }}
            >
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Empty = () => (
  <div
    style={{
      color: C.dim,
      fontFamily: "monospace",
      fontSize: "0.7rem",
      letterSpacing: "2px",
      padding: "1rem 0",
    }}
  >
    NO DATA
  </div>
);

const Section = ({ title, accent = C.yellow, children }) => (
  <div
    style={{
      background: "#0F0F14",
      border: `1px solid ${C.border}`,
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <div
      style={{
        fontSize: "0.6rem",
        fontWeight: 900,
        letterSpacing: "3px",
        color: accent,
        fontFamily: "'Courier New', monospace",
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: "0.5rem",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

// ── Season Selector ───────────────────────────────────────
const SeasonSelector = ({ seasons, selectedId, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = seasons.find((s) => s.id === selectedId);

  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#0F0F14",
          border: `1px solid ${C.border}`,
          color: C.text,
          padding: "7px 14px",
          cursor: "pointer",
          fontSize: "0.68rem",
          fontWeight: 900,
          letterSpacing: "1.5px",
          fontFamily: "'Courier New', monospace",
          minWidth: "180px",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: selected?.isActive ? C.cyan : C.muted,
              flexShrink: 0,
              boxShadow: selected?.isActive ? `0 0 4px ${C.cyan}` : "none",
            }}
          />
          {selected?.name || "PILIH SEASON"}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          style={{
            opacity: 0.6,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: "#0F0F14",
            border: `1px solid ${C.border}`,
            zIndex: 1000,
            minWidth: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 14px",
                background:
                  s.id === selectedId ? "rgba(255,230,0,0.06)" : "transparent",
                border: "none",
                borderLeft:
                  s.id === selectedId
                    ? `2px solid ${C.yellow}`
                    : "2px solid transparent",
                color: s.id === selectedId ? C.yellow : C.muted,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "1.5px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                textAlign: "left",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (s.id !== selectedId) {
                  e.currentTarget.style.background = "#1A1A1F";
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={(e) => {
                if (s.id !== selectedId) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: s.isActive ? C.cyan : C.dim,
                  flexShrink: 0,
                  boxShadow: s.isActive ? `0 0 4px ${C.cyan}` : "none",
                }}
              />
              {s.name}
              {s.isActive && (
                <span
                  style={{
                    fontSize: "0.5rem",
                    color: C.cyan,
                    letterSpacing: "2px",
                    marginLeft: "auto",
                  }}
                >
                  AKTIF
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Palette ───────────────────────────────────────────────
const PALETTE = [
  C.yellow,
  C.cyan,
  C.magenta,
  C.green,
  "#FF9500",
  "#BF5AF2",
  "#FF453A",
  "#30D158",
];
const colorAt = (i) => PALETTE[i % PALETTE.length];

// ── Main ──────────────────────────────────────────────────
const AnalyticsPage = ({ season, seasons = [] }) => {
  const {
    orders,
    summary,
    workerSummary,
    loading,
    fetchOrders,
    fetchSummary,
    fetchWorkerSummary,
  } = useOrder();

  const [tab, setTab] = useState("overview");

  // selectedSeasonId: default ke season yang dipassing dari sidebar
  const [selectedSeasonId, setSelectedSeasonId] = useState(season?.id || null);

  // Sync jika season prop berubah (user klik season lain di sidebar)
  useEffect(() => {
    if (season?.id && season.id !== selectedSeasonId) {
      setSelectedSeasonId(season.id);
    }
  }, [season?.id]);

  // Derived: season object dari selectedSeasonId
  const selectedSeason = useMemo(
    () => seasons.find((s) => s.id === selectedSeasonId) || season || null,
    [selectedSeasonId, seasons, season],
  );

  const loadData = (sid) => {
    if (!sid) return;
    fetchOrders(sid);
    fetchSummary(sid);
    fetchWorkerSummary(sid);
  };

  useEffect(() => {
    loadData(selectedSeasonId);
  }, [selectedSeasonId]);

  const handleSeasonChange = (id) => {
    setSelectedSeasonId(id);
  };

  const refresh = () => loadData(selectedSeasonId);

  // ── Derived data ─────────────────────────────────────────

  const trendDaily = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const d = o.date ? o.date.split("T")[0] : null;
      if (!d) return;
      map[d] = (map[d] || 0) + (o.price || 0);
    });
    const sorted = Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30);
    return sorted.map(([date, omset]) => ({
      label: new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      omset,
    }));
  }, [orders]);

  const trendMonthly = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const d = o.date ? o.date.split("T")[0] : null;
      if (!d) return;
      const key = d.slice(0, 7);
      map[key] = (map[key] || 0) + (o.price || 0);
    });
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, omset]) => {
        const [y, m] = key.split("-");
        const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
          "id-ID",
          { month: "short", year: "2-digit" },
        );
        return { label, omset };
      });
  }, [orders]);

  const byCategory = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const k = o.category || "LAINNYA";
      if (!map[k]) map[k] = { label: k, value: 0, count: 0 };
      map[k].value += o.price || 0;
      map[k].count += 1;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [orders]);

  const byPayment = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const k = o.payment || "LAINNYA";
      if (!map[k]) map[k] = { label: k, value: 0 };
      map[k].value += 1;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [orders]);

  const byStatus = useMemo(() => {
    const STATUS_COLORS = {
      DONE: C.green,
      PROCESS: C.cyan,
      PENDING: C.yellow,
      CANCEL: C.magenta,
    };
    const map = {};
    orders.forEach((o) => {
      const k = o.status || "UNKNOWN";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({
        label,
        value,
        color: STATUS_COLORS[label] || C.muted,
      }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  const topWorkers = useMemo(
    () =>
      [...(workerSummary || [])]
        .sort((a, b) => b.totalEarned - a.totalEarned)
        .slice(0, 10),
    [workerSummary],
  );

  const unpaidWorkers = useMemo(
    () =>
      (workerSummary || [])
        .filter((w) => w.totalUnpaid > 0)
        .sort((a, b) => b.totalUnpaid - a.totalUnpaid),
    [workerSummary],
  );

  if (!selectedSeason && seasons.length === 0)
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
        BELUM ADA SEASON
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
          overflow: "visible",
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
            // ANALYTICS
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 4rem)",
              fontWeight: 900,
              color: C.cyan,
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
              lineHeight: 0.9,
              textShadow: `0 0 40px ${C.cyan}60`,
            }}
          >
            {selectedSeason?.name || "—"}
          </h1>
          <div
            style={{
              fontSize: "0.78rem",
              color: "#9A9A9A",
              fontFamily: "monospace",
              marginTop: "8px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            {selectedSeason?.label}
          </div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: C.cyan,
              marginTop: "10px",
              boxShadow: `0 0 10px ${C.cyan}`,
            }}
          />
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Season selector */}
          {seasons.length > 1 && (
            <SeasonSelector
              seasons={seasons}
              selectedId={selectedSeasonId}
              onChange={handleSeasonChange}
            />
          )}

          {/* Tab toggle */}
          {["overview", "workers"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? C.cyan : "transparent",
                border: `1px solid ${tab === t ? C.cyan : C.border}`,
                color: tab === t ? "#000" : C.muted,
                padding: "6px 16px",
                fontSize: "0.65rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                boxShadow: tab === t ? `0 0 10px ${C.cyan}40` : "none",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}

          <button
            onClick={refresh}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: C.text,
              padding: "6px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
            }}
          >
            <RefreshCw size={12} strokeWidth={2} /> REFRESH
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
          position: "relative",
        }}
      >
        <StatCard
          label="TOTAL ORDER"
          value={summary?.totalOrder ?? "—"}
          accent={C.yellow}
          Icon={ShoppingBag}
        />
        <StatCard
          label="OMSET"
          value={summary ? fmtRp(summary.totalOmset) : "—"}
          accent={C.cyan}
          Icon={TrendingUp}
        />
        <StatCard
          label="GAJI WORKER"
          value={summary ? fmtRp(summary.totalGajiWorker) : "—"}
          accent={C.magenta}
          Icon={User}
        />
        <StatCard
          label="PROFIT"
          value={summary ? fmtRp(summary.profitBersih) : "—"}
          accent={C.green}
          Icon={DollarSign}
        />
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Section title="// TREND OMSET — 30 HARI TERAKHIR" accent={C.yellow}>
            <VBarChart data={trendDaily} />
          </Section>

          <Section title="// TREND OMSET — PER BULAN" accent={C.yellow}>
            <VBarChart data={trendMonthly} />
          </Section>

          <Section title="// OMSET PER KATEGORI" accent={C.cyan}>
            <HBarChart
              data={byCategory}
              valueKey="value"
              labelKey="label"
              colorFn={(i) => colorAt(i)}
              formatVal={fmtRp}
            />
            <DonutChart
              slices={byCategory.map((d, i) => ({
                label: d.label,
                value: d.value,
                color: colorAt(i),
              }))}
            />
          </Section>

          <Section title="// ORDER PER METODE BAYAR" accent={C.cyan}>
            <HBarChart
              data={byPayment}
              valueKey="value"
              labelKey="label"
              colorFn={(i) => colorAt(i)}
              formatVal={(v) => `${v} order`}
            />
            <DonutChart
              slices={byPayment.map((d, i) => ({
                label: d.label,
                value: d.value,
                color: colorAt(i),
              }))}
            />
          </Section>

          <Section title="// STATUS ORDER" accent={C.magenta}>
            <DonutChart slices={byStatus} />
            <HBarChart
              data={byStatus}
              valueKey="value"
              labelKey="label"
              colorFn={(i) => byStatus[i]?.color}
              formatVal={(v) => `${v} order`}
            />
          </Section>

          <Section title="// MARGIN RATE" accent={C.green}>
            {summary && summary.totalOmset > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  { label: "OMSET", value: summary.totalOmset, color: C.cyan },
                  {
                    label: "GAJI WORKER",
                    value: summary.totalGajiWorker,
                    color: C.magenta,
                  },
                  {
                    label: "PROFIT",
                    value: summary.profitBersih,
                    color: C.green,
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontFamily: "monospace",
                          color: C.muted,
                          letterSpacing: "1px",
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontFamily: "monospace",
                          color: row.color,
                        }}
                      >
                        {((row.value / summary.totalOmset) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ background: "#0A0A0C", height: "10px" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(row.value / summary.totalOmset) * 100}%`,
                          background: row.color,
                          boxShadow: `0 0 6px ${row.color}50`,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "monospace",
                        color: row.color,
                        marginTop: "2px",
                      }}
                    >
                      {fmtRp(row.value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Section>
        </div>
      )}

      {/* ── TAB: WORKERS ── */}
      {tab === "workers" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Section title="// LEADERBOARD GAJI WORKER" accent={C.yellow}>
            <HBarChart
              data={topWorkers.map((w) => ({
                label: w.name,
                value: w.totalEarned,
              }))}
              valueKey="value"
              labelKey="label"
              colorFn={(i) =>
                i === 0
                  ? C.yellow
                  : i === 1
                    ? "#C0C0C0"
                    : i === 2
                      ? "#CD7F32"
                      : C.muted
              }
              formatVal={fmtRp}
            />
          </Section>

          <Section title="// ORDER COUNT PER WORKER" accent={C.cyan}>
            <HBarChart
              data={[...(workerSummary || [])]
                .sort((a, b) => b.orderCount - a.orderCount)
                .slice(0, 10)
                .map((w) => ({ label: w.name, value: w.orderCount }))}
              valueKey="value"
              labelKey="label"
              colorFn={() => C.cyan}
              formatVal={(v) => `${v} order`}
            />
          </Section>

          <Section title="// WORKER BELUM DIBAYAR" accent={C.magenta}>
            {unpaidWorkers.length === 0 ? (
              <div
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  color: C.green,
                  letterSpacing: "1.5px",
                }}
              >
                ✓ SEMUA SUDAH DIBAYAR
              </div>
            ) : (
              <HBarChart
                data={unpaidWorkers.map((w) => ({
                  label: w.name,
                  value: w.totalUnpaid,
                }))}
                valueKey="value"
                labelKey="label"
                colorFn={() => C.magenta}
                formatVal={fmtRp}
              />
            )}
          </Section>

          <div style={{ gridColumn: "1 / -1" }}>
            <Section title="// DETAIL SEMUA WORKER" accent={C.cyan}>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: "0.72rem",
                    fontFamily: "monospace",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {[
                        "#",
                        "WORKER",
                        "ORDER",
                        "TOTAL EARNED",
                        "TOTAL PAID",
                        "UNPAID",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "6px 10px",
                            color: C.yellow,
                            fontWeight: 900,
                            letterSpacing: "1.5px",
                            textAlign: h === "#" ? "center" : "left",
                            whiteSpace: "nowrap",
                            background: "#0D0D0F",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(workerSummary || []).map((w, i) => (
                      <tr
                        key={w.name}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: i % 2 === 0 ? "#0F0F14" : "#0D0D0F",
                        }}
                      >
                        <td
                          style={{
                            padding: "5px 10px",
                            color: C.dim,
                            textAlign: "center",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            color: C.text,
                            fontWeight: 700,
                          }}
                        >
                          {w.name}
                        </td>
                        <td style={{ padding: "5px 10px", color: C.muted }}>
                          {w.orderCount}
                        </td>
                        <td style={{ padding: "5px 10px", color: C.cyan }}>
                          {fmtRp(w.totalEarned)}
                        </td>
                        <td style={{ padding: "5px 10px", color: C.green }}>
                          {fmtRp(w.totalPaid)}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            color: w.totalUnpaid > 0 ? C.magenta : C.dim,
                            fontWeight: w.totalUnpaid > 0 ? 900 : 400,
                          }}
                        >
                          {w.totalUnpaid > 0 ? fmtRp(w.totalUnpaid) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            background: "#131318",
            border: `1px solid ${C.border}`,
            padding: "8px 16px",
            fontSize: "0.65rem",
            fontFamily: "monospace",
            color: C.cyan,
            letterSpacing: "2px",
            zIndex: 999,
          }}
        >
          MEMUAT...
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
