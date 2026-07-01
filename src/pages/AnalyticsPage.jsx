import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  User,
  DollarSign,
} from "lucide-react";
import useOrder from "../hooks/useOrder";
import { useDataPageColors, glow } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext"; // sesuaikan path
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";

import StatCard from "../components/Analytics/StatCard";
import HBarChart from "../components/Analytics/HBarChart";
import VBarChart from "../components/Analytics/VBarChart";
import DonutChart from "../components/Analytics/DonutChart";
import Empty from "../components/Analytics/Empty";
import Section from "../components/Analytics/Section";
import SeasonSelector from "../components/Analytics/SeasonSelector";
import { fmtRp, getPalette, getColorAt } from "../components/Analytics/analytics.utils";

// ── Main ──────────────────────────────────────────────────
const AnalyticsPage = ({ season, seasons = [] }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  // Palette — dulu module-level const yang baca C statis, sekarang
  // dihitung per-render karena C reaktif terhadap theme.
  const PALETTE = getPalette(C);
  const colorAt = getColorAt(PALETTE);

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
  }, [orders, C]);

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
              textShadow: glow(theme, `0 0 40px ${C.cyan}60`),
            }}
          >
            {selectedSeason?.name || "—"}
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
            {selectedSeason?.label}
          </div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: C.cyan,
              marginTop: "10px",
              boxShadow: glow(theme, `0 0 10px ${C.cyan}`),
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
                boxShadow: tab === t ? glow(theme, `0 0 10px ${C.cyan}40`) : "none",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}

          <button
            onClick={refresh}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
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
                    <div style={{ background: C.trackBg, height: "10px" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(row.value / summary.totalOmset) * 100}%`,
                          background: row.color,
                          boxShadow: glow(theme, `0 0 6px ${row.color}50`),
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
                            background: C.bg,
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
                          background: i % 2 === 0 ? C.panel2 : C.bg,
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
            background: C.panel2,
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
