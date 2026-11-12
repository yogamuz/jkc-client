import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useDataPageColors, glow } from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({
  label,
  value,
  accent,
  Icon,
  trend,
  trendLabel = "",
  upIsGood = true,
}) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  let TrendIcon = Minus;
  let trendColor = C.muted;
  let trendText = "";
  if (trend) {
    const dir = trend.diff > 0 ? "up" : trend.diff < 0 ? "down" : "flat";
    if (dir === "up") TrendIcon = ArrowUpRight;
    if (dir === "down") TrendIcon = ArrowDownRight;
    if (dir !== "flat") {
      const good = (dir === "up") === upIsGood;
      trendColor = good ? C.green : C.magenta;
    }
    trendText =
      trend.pct === null
        ? "BARU"
        : `${dir === "up" ? "+" : dir === "down" ? "-" : ""}${Math.abs(trend.pct).toFixed(1)}%`;
  }

  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${accent}30`,
        padding: "1.1rem 1.25rem",
        position: "relative",
        minWidth: 0,
        containerType: "inline-size",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          color: accent,
          opacity: 0.6,
        }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div
        style={{
          fontSize: "0.58rem",
          color: C.mutedAlt,
          fontWeight: 700,
          letterSpacing: "2.5px",
          fontFamily: "monospace",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "clamp(0.75rem, 10.5cqw, 1.5rem)",
          fontWeight: 900,
          color: accent,
          fontFamily: "'Courier New', monospace",
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          textShadow: glow(theme, `0 0 16px ${accent}50`),
        }}
      >
        {value}
      </div>

      {trend && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: "5px",
            rowGap: "2px",
            marginTop: "8px",
            fontFamily: "monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              color: trendColor,
              whiteSpace: "nowrap",
            }}
          >
            <TrendIcon size={12} strokeWidth={2.5} />
            {trendText}
          </span>
          {trendLabel && (
            <span style={{ color: C.muted, fontWeight: 500 }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;