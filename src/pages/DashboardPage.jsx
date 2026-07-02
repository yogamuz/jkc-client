import { useContext, useEffect } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Wallet,
  SlidersHorizontal,
  ArrowRight,
  BarChart2,
  EyeOff,
} from "lucide-react";
import useOrder from "../hooks/useOrder";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import ThemeContext from "../context/ThemeContext"; // sesuaikan path

/* ── Design tokens ─────────────────────────────────────── */
const darkColors = {
  bg: "#0D0D0F",
  panel: "#131318",
  border: "#2A2A2E",
  yellow: "#FFE600",
  cyan: "#00E5FF",
  magenta: "#FF3CAC",
  green: "#39FF14",
  text: "#E8E8E8",
  muted: "#666670",
  dim: "#2A2A2E",
  mutedAlt: "#9A9A9A",
  trackBg: "#0A0A0C",
};

const lightColors = {
  bg: "#FAF7F0",
  panel: "#FFFFFF",
  border: "#1A1A1A",
  yellow: "#B8860B",
  cyan: "#0089A0",
  magenta: "#CC2E89",
  green: "#1F9D2E",
  text: "#1A1A1A",
  muted: "#8A8A8F",
  dim: "#D8D4C8",
  mutedAlt: "#6B6B70",
  trackBg: "#EAE6DA",
};

const getColors = (theme) => (theme === "light" ? lightColors : darkColors);
const useDashboardColors = () => {
  const { theme } = useContext(ThemeContext);
  return getColors(theme);
};

/* glow dimatiin di light mode biar gak norak */
const glow = (theme, value) => (theme === "light" ? "none" : value);

const glassCard = (accentColor, c) => ({
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(ellipse at 60% 40%, ${accentColor}18 0%, ${c.panel}00 60%), ${c.panel}`,
  border: `1px solid ${accentColor}60`,
  padding: "1.1rem 1.25rem 1rem",
  flex: "1 1 140px",
  minWidth: "0",
  boxSizing: "border-box",
});

const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const fmtK = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}jt`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}rb`
      : String(n);

// ── Analytics Preview Sub-components ────────────────────

/** Mini vertical bar chart untuk preview */
const MiniVBar = ({ data, colorKey, C }) => {
  if (!data?.length)
    return (
      <div
        style={{
          color: C.dim,
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "2px",
          padding: "0.5rem 0",
        }}
      >
        NO DATA
      </div>
    );
  const max = Math.max(...data.map((d) => d.omset), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "3px",
        height: "80px",
        overflowX: "auto",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            minWidth: "22px",
            flex: "1 0 22px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${Math.max((d.omset / max) * 68, d.omset > 0 ? 3 : 0)}px`,
              background: colorKey,
              opacity: 0.85,
              boxShadow: `0 0 4px ${colorKey}40`,
            }}
          />
          <div
            style={{
              fontSize: "0.42rem",
              color: C.muted,
              fontFamily: "monospace",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              lineHeight: 1,
              maxHeight: "28px",
              overflow: "hidden",
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Mini donut untuk status order */
const MiniDonut = ({ slices, C }) => {
  if (!slices?.length) return null;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;

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
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {slices.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.6rem",
                fontFamily: "monospace",
                color: C.muted,
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                fontFamily: "monospace",
                color: C.text,
                marginLeft: "auto",
                paddingLeft: "6px",
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────

const DashboardPage = ({ onNavigate, seasons = [], user }) => {
  const C = useDashboardColors();
  const { theme } = useContext(ThemeContext);
  const {
    orders,
    summary,
    dashboard,
    workerSummary,
    fetchOrders,
    fetchSummary,
    fetchWorkerSummary,
    fetchDashboard,
    loading,
  } = useOrder();
  const isOwner = user?.role === "owner";

  useEffect(() => {
    fetchDashboard();
  }, []);
  // Ambil season aktif untuk rate terbaru dan analytics preview
  const activeSeason = seasons.find((s) => s.isActive) || seasons[0] || null;

  useEffect(() => {
    if (!activeSeason?.id) return;
    fetchOrders(activeSeason.id);
    if (isOwner) fetchSummary(activeSeason.id);
    fetchWorkerSummary(activeSeason.id);
  }, [activeSeason?.id, isOwner]);

  const activeRates =
    activeSeason?.rateHistory?.length > 0
      ? [...activeSeason.rateHistory].sort(
          (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate),
        )[0]
      : null;

  const STATS = [
    {
      label: "TOTAL SEASON",
      value: loading ? "..." : (dashboard?.totalSeason ?? "—"),
      accent: C.yellow,
      Icon: ShoppingBag,
    },
    {
      label: "TOTAL ORDER",
      value: loading ? "..." : (dashboard?.totalOrder ?? "—"),
      accent: C.cyan,
      Icon: TrendingUp,
    },
    {
      label: "TOTAL WORKER",
      value: loading ? "..." : (dashboard?.totalWorker ?? "—"),
      accent: C.magenta,
      Icon: Users,
    },
    {
      label: "TOTAL INCOME",
      value: !isOwner
        ? "••••••"
        : loading
          ? "..."
          : fmtRp(dashboard?.totalOmset),
      accent: C.green,
      Icon: Wallet,
      sensitive: true,
    },
    {
      label: "TOTAL SALARY",
      value: !isOwner
        ? "••••••"
        : loading
          ? "..."
          : fmtRp(dashboard?.totalGaji),
      accent: C.magenta,
      Icon: Users,
      sensitive: true,
    },
    {
      label: "TOTAL PROFIT",
      value: !isOwner
        ? "••••••"
        : loading
          ? "..."
          : fmtRp(dashboard?.totalProfit),
      accent: C.yellow,
      Icon: DollarSign,
      sensitive: true,
    },
  ];
  // ── Derived data untuk analytics preview ──────────────

  /** Trend 14 hari terakhir */
  const trendPreview = (() => {
    const map = {};
    orders.forEach((o) => {
      const d = o.date ? o.date.split("T")[0] : null;
      if (!d) return;
      map[d] = (map[d] || 0) + (o.price || 0);
    });
    const sorted = Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);
    return sorted.map(([date, omset]) => ({
      label: new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      omset,
    }));
  })();

  /** Status breakdown */
  const STATUS_COLORS = {
    DONE: C.green,
    PROCESS: C.cyan,
    PENDING: C.yellow,
    CANCEL: C.magenta,
  };
  const statusSlices = (() => {
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
  })();

  /** Top 5 workers by earned */
  const topWorkerPreview = [...(workerSummary || [])]
    .sort((a, b) => b.totalEarned - a.totalEarned)
    .slice(0, 5);

  const workerMax = Math.max(...topWorkerPreview.map((w) => w.totalEarned), 1);

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
      <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1 }}>
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
          // OVERVIEW
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 8vw, 4rem)",
            fontWeight: 900,
            color: C.text,
            margin: 0,
            letterSpacing: "-3px",
            textTransform: "uppercase",
            fontFamily: "'Courier New', monospace",
            lineHeight: 0.9,
          }}
        >
          Dashboard
        </h1>
        <div
          style={{
            width: "40px",
            height: "2px",
            background: C.yellow,
            marginTop: "12px",
            boxShadow: glow(theme, `0 0 10px ${C.yellow}`),
          }}
        />
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {STATS.map((s) => (
          <div key={s.label} style={glassCard(s.accent, C)}>
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                color: s.accent,
                opacity: 0.7,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {!isOwner && s.sensitive && (
                <EyeOff
                  size={15}
                  strokeWidth={1.5}
                  title="Disembunyikan — hanya owner yang bisa melihat"
                  style={{ cursor: "not-allowed", opacity: 0.85 }}
                />
              )}
              <s.Icon size={20} strokeWidth={1.5} />
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: C.mutedAlt,
                fontWeight: 700,
                letterSpacing: "2.5px",
                fontFamily: "'Courier New', monospace",
                marginBottom: "8px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize:
                  typeof s.value === "string" && s.value.startsWith("Rp")
                    ? "clamp(0.9rem, 3vw, 1.3rem)"
                    : "clamp(1.4rem, 5vw, 2.2rem)",
                fontWeight: 900,
                color: s.accent,
                fontFamily: "'Courier New', monospace",
                lineHeight: 1,
                letterSpacing:
                  typeof s.value === "string" && s.value.startsWith("Rp")
                    ? "-0.5px"
                    : "-2px",
                textShadow: glow(theme, `0 0 20px ${s.accent}60`),
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Rate Aktif */}
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            padding: "0.65rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.yellow,
              fontFamily: "'Courier New', monospace",
            }}
          >
            // RATE AKTIF — {activeSeason?.name || "—"}
            {activeRates && (
              <span
                style={{
                  color: C.muted,
                  marginLeft: "12px",
                  letterSpacing: "1px",
                }}
              >
                berlaku sejak{" "}
                {new Date(activeRates.effectiveDate).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "numeric" },
                )}
              </span>
            )}
          </span>
          <button
            onClick={() => onNavigate("rates")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${C.yellow}`,
              color: C.yellow,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,230,0,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <SlidersHorizontal size={11} strokeWidth={2} />
            UBAH RATE
            <ArrowRight size={11} strokeWidth={2} />
          </button>
        </div>

        {!activeRates ? (
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
            BELUM ADA RATE — SET DI RATE CONFIG
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: "500px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {[
                    "TIER",
                    "HARGA JOKI RANK",
                    "HARGA JOKI GENDONG",
                    "GAJI WORKER RANK",
                    "GAJI WORKER GENDONG",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.6rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.58rem",
                        fontWeight: 900,
                        letterSpacing: "2px",
                        color: C.muted,
                        fontFamily: "'Courier New', monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeRates.rates.map((r, i) => (
                  <tr
                    key={r.tier}
                    style={{
                      borderBottom:
                        i < activeRates.rates.length - 1
                          ? `1px solid ${C.border}`
                          : "none",
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        color: C.yellow,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.tier}
                    </td>
                    <td
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: C.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtRp(r.rate_store_joki)}
                      <span style={{ color: C.muted, fontSize: "0.65rem" }}>
                        {" "}
                        / ⭐
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: C.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtRp(r.rate_store_jokgen)}
                      <span style={{ color: C.muted, fontSize: "0.65rem" }}>
                        {" "}
                        / ⭐
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: C.cyan,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtRp(r.rate_worker_joki)}
                      <span style={{ color: C.muted, fontSize: "0.65rem" }}>
                        {" "}
                        / ⭐
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: C.cyan,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtRp(r.rate_worker_jokgen)}
                      <span style={{ color: C.muted, fontSize: "0.65rem" }}>
                        {" "}
                        / ⭐
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Analytics Preview ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.cyan,
              fontFamily: "'Courier New', monospace",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <BarChart2 size={13} strokeWidth={2} />
            // ANALYTICS PREVIEW — {activeSeason?.name || "NO SEASON"}
          </div>
          <button
            onClick={() => onNavigate("analytics")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              padding: "4px 14px",
              cursor: "pointer",
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,229,255,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <BarChart2 size={11} strokeWidth={2} />
            VIEW FULL ANALYTICS
            <ArrowRight size={11} strokeWidth={2} />
          </button>
        </div>

        {/* Preview grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {/* Trend 14 hari — khusus owner, pakai data price yang di-strip untuk admin */}
          {isOwner && (
            <div
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                padding: "1.1rem 1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  letterSpacing: "2.5px",
                  color: C.yellow,
                  fontFamily: "'Courier New', monospace",
                  marginBottom: "0.75rem",
                }}
              >
                TREND OMSET — 14 HARI
              </div>
              {activeSeason ? (
                <MiniVBar data={trendPreview} colorKey={C.yellow} C={C} />
              ) : (
                <div
                  style={{
                    color: C.muted,
                    fontFamily: "monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "2px",
                    padding: "1.5rem 0",
                    textAlign: "center",
                  }}
                >
                  PILIH SEASON
                </div>
              )}
            </div>
          )}

          {/* Status order */}
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              padding: "1.1rem 1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.55rem",
                fontWeight: 900,
                letterSpacing: "2.5px",
                color: C.magenta,
                fontFamily: "'Courier New', monospace",
                marginBottom: "0.75rem",
              }}
            >
              STATUS ORDER
            </div>
            {activeSeason && statusSlices.length > 0 ? (
              <MiniDonut slices={statusSlices} C={C} />
            ) : (
              <div
                style={{
                  color: C.muted,
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "2px",
                  padding: "1.5rem 0",
                  textAlign: "center",
                }}
              >
                {activeSeason ? "NO DATA" : "PILIH SEASON"}
              </div>
            )}
          </div>

          {/* Top 5 workers */}
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              padding: "1.1rem 1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.55rem",
                fontWeight: 900,
                letterSpacing: "2.5px",
                color: C.cyan,
                fontFamily: "'Courier New', monospace",
                marginBottom: "0.75rem",
              }}
            >
              TOP WORKER — EARNED
            </div>
            {activeSeason && topWorkerPreview.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {topWorkerPreview.map((w, i) => (
                  <div
                    key={w.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.58rem",
                        fontFamily: "monospace",
                        color:
                          i === 0
                            ? C.yellow
                            : i === 1
                              ? "#C0C0C0"
                              : i === 2
                                ? "#CD7F32"
                                : C.muted,
                        width: "14px",
                        flexShrink: 0,
                        fontWeight: 900,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        fontFamily: "monospace",
                        color: C.muted,
                        width: "72px",
                        flexShrink: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {w.name}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: C.trackBg,
                        height: "12px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${(w.totalEarned / workerMax) * 100}%`,
                          background:
                            i === 0
                              ? C.yellow
                              : i === 1
                                ? "#C0C0C0"
                                : i === 2
                                  ? "#CD7F32"
                                  : C.muted,
                          minWidth: w.totalEarned > 0 ? "2px" : 0,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.58rem",
                        fontFamily: "monospace",
                        color: C.text,
                        width: "60px",
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {fmtK(w.totalEarned)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  color: C.muted,
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "2px",
                  padding: "1.5rem 0",
                  textAlign: "center",
                }}
              >
                {activeSeason ? "NO DATA" : "PILIH SEASON"}
              </div>
            )}
          </div>
          {/* Summary profit margin mini — khusus owner */}
          {isOwner && (
            <div
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                padding: "1.1rem 1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  letterSpacing: "2.5px",
                  color: C.green,
                  fontFamily: "'Courier New', monospace",
                  marginBottom: "0.75rem",
                }}
              >
                MARGIN SEASON INI
              </div>
              {activeSeason && summary && summary.totalOmset > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    {
                      label: "OMSET",
                      value: summary.totalOmset,
                      color: C.cyan,
                    },
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
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "monospace",
                            color: C.muted,
                            letterSpacing: "1px",
                          }}
                        >
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "monospace",
                            color: row.color,
                          }}
                        >
                          {((row.value / summary.totalOmset) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ background: C.trackBg, height: "8px" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(row.value / summary.totalOmset) * 100}%`,
                            background: row.color,
                            boxShadow: glow(theme, `0 0 4px ${row.color}40`),
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          fontFamily: "monospace",
                          color: row.color,
                          marginTop: "1px",
                        }}
                      >
                        {fmtRp(row.value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    color: C.muted,
                    fontFamily: "monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "2px",
                    padding: "1.5rem 0",
                    textAlign: "center",
                  }}
                >
                  {activeSeason ? "NO DATA" : "PILIH SEASON"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            background: C.panel,
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

export default DashboardPage;
