import { useDataPageColors, glow } from "../../constants/dataPage.constants"
import { useTheme } from "../../context/ThemeContext"; // sesuaikan path

const StatCard = ({ label, value, accent, Icon }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: C.panel2,
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
          fontSize: "clamp(0.85rem, 2.5vw, 1.35rem)",
          fontWeight: 900,
          color: accent,
          fontFamily: "'Courier New', monospace",
          lineHeight: 1.1,
          textShadow: glow(theme, `0 0 16px ${accent}50`),
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default StatCard;
