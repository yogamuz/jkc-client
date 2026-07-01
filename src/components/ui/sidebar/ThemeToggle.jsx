import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext"; // adjust path if needed
import { useSidebarColors } from "./SidebarTokens";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const C = useSidebarColors();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      title={isLight ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        width: "100%",
        padding: "0.5rem",
        background: "transparent",
        border: `1px solid ${C.border}`,
        color: C.yellow,
        fontFamily: "'Courier New', monospace",
        fontSize: "0.62rem",
        fontWeight: 900,
        letterSpacing: "2px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.yellow)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      {isLight ? <Moon size={12} strokeWidth={2} /> : <Sun size={12} strokeWidth={2} />}
      {isLight ? "DARK MODE" : "LIGHT MODE"}
    </button>
  );
};

export default ThemeToggle;