import {
  ShoppingBag,
  TrendingUp,
  User,
  DollarSign,
  EyeOff,
} from "lucide-react";
import {
  useDataPageColors,
  glassCard,
  glow,
} from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext";
/**
 * SummaryCards
 * Props:
 *   summary         : object dari API (data season penuh)
 *   filteredOrders  : array order yang sudah difilter
 *   hasFilter       : boolean — apakah ada filter aktif
 */
const SummaryCards = ({
  summary,
  filteredOrders = [],
  hasFilter = false,
  isOwner = false,
}) => {
  const C = useDataPageColors();
  const { theme } = useTheme();
  const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;

  // Kalau ada filter aktif, hitung dari filteredOrders
  const displayData = hasFilter
    ? {
        totalOrder: filteredOrders.length,
        totalOmset: filteredOrders.reduce((s, o) => s + (o.price || 0), 0),
        totalGajiWorker: filteredOrders.reduce(
          (s, o) => s + (o.totalWorkerSalary || 0),
          0,
        ),
        profitBersih: filteredOrders.reduce((s, o) => s + (o.profit || 0), 0),
      }
    : summary;

  const sensor = (val) => (isOwner ? val : "••••••");

  const summaryCards = [
    {
      label: "TOTAL ORDER",
      value: displayData?.totalOrder ?? "—",
      accent: C.yellow,
      Icon: ShoppingBag,
      sensitive: false,
    },
    {
      label: "OMSET",
      value: sensor(displayData ? fmtRp(displayData.totalOmset) : "—"),
      accent: C.cyan,
      Icon: TrendingUp,
      sensitive: true,
    },
    {
      label: "GAJI WORKER",
      value: displayData ? fmtRp(displayData.totalGajiWorker) : "—",
      accent: C.magenta,
      Icon: User,
      sensitive: false,
    },
    {
      label: "PROFIT",
      value: sensor(displayData ? fmtRp(displayData.profitBersih) : "—"),
      accent: C.green,
      Icon: DollarSign,
      sensitive: true,
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      {summaryCards.map((s) => (
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
                size={16}
                strokeWidth={1.5}
                title="Disembunyikan — hanya owner yang bisa melihat"
                style={{ cursor: "not-allowed", opacity: 0.85 }}
              />
            )}
            <s.Icon size={22} strokeWidth={1.5} />
          </div>
          <div
            style={{
              fontSize: "0.58rem",
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
                s.label === "TOTAL ORDER"
                  ? "clamp(1.4rem, 5vw, 2.2rem)"
                  : "clamp(0.9rem, 3vw, 1.5rem)",
              fontWeight: 900,
              color: s.accent,
              fontFamily: "'Courier New', monospace",
              lineHeight: 1.1,
              letterSpacing: s.label === "TOTAL ORDER" ? "-2px" : "-0.5px",
              textShadow: glow(theme, `0 0 20px ${s.accent}60`),
            }}
          >
            {s.value}
          </div>
          {/* Label kecil kalau sedang mode filter */}
          {hasFilter && (
            <div
              style={{
                fontSize: "0.52rem",
                color: s.accent,
                opacity: 0.5,
                fontFamily: "monospace",
                marginTop: "4px",
                letterSpacing: "1px",
              }}
            >
              FILTERED
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
