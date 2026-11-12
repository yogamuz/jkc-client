import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useDataPageColors, glow } from "../constants/dataPage.constants";
import { useTheme } from "../context/ThemeContext";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import Section from "../components/Analytics/Section";
import TrendChart from "../components/Analytics/TrendChart";
import { fmtRp, fmtK } from "../components/Analytics/analytics.utils";
import * as orderService from "../services/orderService";

const DAY_LABEL = { day: "numeric", month: "short" };

const TrendPage = ({ season, seasons = [] }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  const [seasonId, setSeasonId] = useState(season?.id || "ALL");
  const [metric, setMetric] = useState("omset");
  const [gran, setGran] = useState("day");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const METRICS = {
    omset: { label: "OMSET", color: C.cyan, get: (o) => o.price || 0, money: true },
    profit: { label: "PROFIT", color: C.green, get: (o) => o.profit || 0, money: true },
    gaji: { label: "GAJI WORKER", color: C.magenta, get: (o) => o.totalWorkerSalary || 0, money: true },
    order: { label: "ORDER", color: C.yellow, get: () => 1, money: false },
  };
  const m = METRICS[metric];
  const fmt = m.money ? fmtK : (v) => String(Math.round(v));
  const fmtFull = m.money ? fmtRp : (v) => `${v} order`;

  // ikut season dari sidebar saat pertama kali tersedia
  useEffect(() => {
    if (season?.id) setSeasonId(season.id);
  }, [season?.id]);

  useEffect(() => {
    const ids =
      seasonId === "ALL" ? seasons.map((s) => s.id) : seasonId ? [seasonId] : [];
    if (!ids.length) {
      setOrders([]);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all(
      ids.map((id) =>
        orderService
          .getOrders(id)
          .then((r) => r.data || [])
          .catch(() => []),
      ),
    )
      .then((lists) => active && setOrders(lists.flat()))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [seasonId, seasons.length, tick]);

  // ── Bentuk deret waktu (isi hari kosong dengan 0) ──
  const series = useMemo(() => {
    const buckets = {};
    orders.forEach((o) => {
      const d = new Date(o.date);
      if (isNaN(d)) return;
      let k = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (gran === "week") k.setDate(k.getDate() - ((k.getDay() + 6) % 7));
      buckets[k.getTime()] = (buckets[k.getTime()] || 0) + m.get(o);
    });
    const keys = Object.keys(buckets).map(Number);
    if (!keys.length) return [];
    const step = gran === "week" ? 7 : 1;
    const out = [];
    const cur = new Date(Math.min(...keys));
    const end = Math.max(...keys);
    while (cur.getTime() <= end) {
      out.push({
        value: buckets[cur.getTime()] || 0,
        label: cur.toLocaleDateString("id-ID", DAY_LABEL),
        fullLabel:
          (gran === "week" ? "Minggu " : "") +
          cur.toLocaleDateString("id-ID", { ...DAY_LABEL, year: "2-digit" }),
      });
      cur.setDate(cur.getDate() + step);
    }
    return out;
  }, [orders, metric, gran]);

  const stats = useMemo(() => {
    if (!series.length) return null;
    const total = series.reduce((s, d) => s + d.value, 0);
    const peak = series.reduce((a, b) => (b.value > a.value ? b : a));
    return { total, avg: total / series.length, peak };
  }, [series]);

  const btn = (active, color) => ({
    background: active ? color : "transparent",
    border: `1px solid ${active ? color : C.border}`,
    color: active ? "#000" : C.muted,
    padding: "6px 14px",
    fontSize: "0.65rem",
    fontWeight: 900,
    letterSpacing: "1.5px",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    boxShadow: active ? glow(theme, `0 0 10px ${color}40`) : "none",
  });

  const statBox = (label, value, color) => (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${color}30`,
        padding: "0.9rem 1.1rem",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "0.58rem",
          color: C.mutedAlt,
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
          fontSize: "clamp(0.8rem, 2.4vw, 1.25rem)",
          fontWeight: 900,
          color,
          fontFamily: "'Courier New', monospace",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
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
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          zIndex: 2,
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
            OWNER ONLY
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 4rem)",
              fontWeight: 900,
              color: m.color,
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
              lineHeight: 0.9,
              textShadow: glow(theme, `0 0 40px ${m.color}60`),
            }}
          >
            Trend
          </h1>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: m.color,
              marginTop: "10px",
              boxShadow: glow(theme, `0 0 10px ${m.color}`),
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
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              color: C.text,
              padding: "0.5rem 0.875rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              outline: "none",
              cursor: "pointer",
              letterSpacing: "1px",
            }}
          >
            <option value="ALL">SEMUA SEASON</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setTick((t) => t + 1)}
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
            <RefreshCw size={13} strokeWidth={2} /> REFRESH
          </button>
        </div>
      </div>

      {/* Filter metrik + periode */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {Object.entries(METRICS).map(([key, x]) => (
          <button key={key} onClick={() => setMetric(key)} style={btn(metric === key, x.color)}>
            {x.label}
          </button>
        ))}
        <span style={{ width: "1px", height: "22px", background: C.border, margin: "0 0.25rem" }} />
        <button onClick={() => setGran("day")} style={btn(gran === "day", C.yellow)}>
          HARIAN
        </button>
        <button onClick={() => setGran("week")} style={btn(gran === "week", C.yellow)}>
          MINGGUAN
        </button>
      </div>

      {/* Ringkasan */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
            gap: "1rem",
            marginBottom: "1.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {statBox(`TOTAL ${m.label}`, fmtFull(stats.total), m.color)}
          {statBox(
            gran === "week" ? "RATA-RATA / MINGGU" : "RATA-RATA / HARI",
            fmtFull(Math.round(stats.avg)),
            C.yellow,
          )}
          {statBox(
            "PUNCAK TERTINGGI",
            `${fmtFull(stats.peak.value)}`,
            C.green,
          )}
          {statBox("TANGGAL PUNCAK", stats.peak.fullLabel, C.magenta)}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <Section
          title={`TREND ${m.label} — ${seasonId === "ALL" ? "SEMUA SEASON" : seasons.find((s) => s.id === seasonId)?.name || ""}`}
          accent={m.color}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              fontFamily: "monospace",
              fontSize: "0.62rem",
              color: C.muted,
            }}
          >
            <span style={{ color: C.magenta }}>▼ puncak</span>
            <span style={{ color: C.green }}>▲ lembah</span>
          </div>
          <TrendChart data={series} color={m.color} fmt={fmt} />
        </Section>
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            background: C.panel2,
            border: `1px solid ${C.border}`,
            padding: "8px 16px",
            fontSize: "0.7rem",
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

export default TrendPage;