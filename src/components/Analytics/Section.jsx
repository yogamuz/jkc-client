import { useDataPageColors } from "../../constants/dataPage.constants";

const Section = ({ title, accent, children, style }) => {
  const C = useDataPageColors();
  const resolvedAccent = accent ?? C.yellow;

  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${C.border}`,
        padding: "1.1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: "0.62rem",
          fontWeight: 900,
          letterSpacing: "3px",
          color: resolvedAccent,
          fontFamily: "'Courier New', monospace",
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: "0.5rem",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
};

export default Section;