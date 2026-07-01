import { useTheme } from "../../context/ThemeContext"; // sesuaikan path

/* ── Bottom-right glow decoration ── */
const CornerGlow = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const strokeColor = isLight ? "#B8860B" : "#FFE600";
  const glowBg = isLight
    ? "radial-gradient(ellipse at 100% 100%, rgba(184,134,11,0.08) 0%, transparent 65%)"
    : "radial-gradient(ellipse at 100% 100%, rgba(255,230,0,0.12) 0%, transparent 65%)";
  const svgOpacity = isLight ? 0.22 : 0.5;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "420px",
        height: "300px",
        pointerEvents: "none",
        zIndex: 0,
        background: glowBg,
      }}
    >
      <svg
        style={{ position: "absolute", bottom: 0, right: 0, opacity: svgOpacity }}
        width="340"
        height="220"
        viewBox="0 0 340 220"
      >
        <g fill="none" stroke={strokeColor} strokeWidth="1">
          <line x1="340" y1="220" x2="200" y2="220" />
          <line x1="200" y1="220" x2="160" y2="180" />
          <line x1="160" y1="180" x2="60" y2="180" />
          <line x1="340" y1="180" x2="260" y2="180" />
          <line x1="260" y1="180" x2="220" y2="140" />
          <line x1="220" y1="140" x2="140" y2="140" />
          <line x1="340" y1="140" x2="300" y2="140" />
          <line x1="300" y1="140" x2="280" y2="120" />
          <circle cx="200" cy="220" r="3" fill={strokeColor} />
          <circle cx="260" cy="180" r="3" fill={strokeColor} />
          <circle cx="300" cy="140" r="2" fill={strokeColor} />
        </g>
        {[0, 1, 2, 3, 4, 5].map((row) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={240 + col * 14}
              cy={140 + row * 14}
              r="1"
              fill={strokeColor}
              opacity={0.3 - row * 0.04}
            />
          )),
        )}
      </svg>
    </div>
  );
};

export default CornerGlow;