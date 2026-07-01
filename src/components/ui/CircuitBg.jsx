import { useTheme } from "../../context/ThemeContext"; // sesuaikan path

/* ── Circuit decoration SVG (top-right of main area) ── */
const CircuitBg = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const strokeColor = isLight ? "#B8860B" : "#FFE600";
  const svgOpacity = isLight ? 0.18 : 0.35;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        pointerEvents: "none",
        opacity: svgOpacity,
      }}
      width="320"
      height="160"
      viewBox="0 0 320 160"
    >
      <g fill="none" stroke={strokeColor} strokeWidth="1">
        <line x1="320" y1="0" x2="220" y2="0" />
        <line x1="220" y1="0" x2="200" y2="20" />
        <line x1="200" y1="20" x2="100" y2="20" />
        <line x1="100" y1="20" x2="80" y2="40" />
        <line x1="320" y1="40" x2="240" y2="40" />
        <line x1="240" y1="40" x2="220" y2="60" />
        <line x1="220" y1="60" x2="180" y2="60" />
        <circle cx="220" cy="0" r="2" fill={strokeColor} />
        <circle cx="100" cy="20" r="2" fill={strokeColor} />
        <circle cx="240" cy="40" r="2" fill={strokeColor} />
      </g>
      <g fill="none" stroke={strokeColor} strokeWidth="0.5" opacity="0.5">
        <line x1="320" y1="10" x2="260" y2="10" />
        <line x1="320" y1="30" x2="280" y2="30" />
        <line x1="320" y1="50" x2="250" y2="50" />
      </g>
    </svg>
  );
};

export default CircuitBg;