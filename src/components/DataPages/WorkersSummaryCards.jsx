import { Users, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { useWorkersColors, glassCard, fmtRp, textGlow } from "./workers.utils";
import { useTheme } from "../../context/ThemeContext";

const WorkersSummaryCards = ({ workers }) => {
  const C = useWorkersColors();
  const { theme } = useTheme();
  const totalEarned = workers.reduce((s, w) => s + w.totalEarned, 0);
  const totalUnpaid = workers.reduce((s, w) => s + w.totalUnpaid, 0);
  const totalOrders = workers.reduce((s, w) => s + w.totalOrders, 0);

  const summaryCards = [
    { label: "TOTAL WORKER", value: workers.length, accent: C.yellow, Icon: Users },
    { label: "TOTAL ORDER", value: totalOrders, accent: C.cyan, Icon: TrendingUp },
    { label: "TOTAL EARNED", value: fmtRp(totalEarned), accent: C.green, Icon: Wallet },
    { label: "BELUM DIBAYAR", value: fmtRp(totalUnpaid), accent: C.magenta, Icon: AlertCircle },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
      position: "relative",
      zIndex: 1,
    }}>
      {summaryCards.map((s) => (
        <div key={s.label} style={glassCard(s.accent, C)}>
          <div style={{ position: "absolute", top: "14px", right: "14px", color: s.accent, opacity: 0.7 }}>
            <s.Icon size={20} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: "0.55rem", color: C.muted, fontWeight: 700, letterSpacing: "2.5px", fontFamily: "'Courier New', monospace", marginBottom: "6px" }}>
            {s.label}
          </div>
          <div style={{
            fontSize: typeof s.value === "number" ? "clamp(1.4rem, 5vw, 2.2rem)" : "clamp(0.9rem, 3vw, 1.3rem)",
            fontWeight: 900, color: s.accent, fontFamily: "'Courier New', monospace", lineHeight: 1.1,
            letterSpacing: typeof s.value === "number" ? "-2px" : "-0.5px",
            textShadow: textGlow(s.accent, theme),
          }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkersSummaryCards;