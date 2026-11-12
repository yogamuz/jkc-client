import { useDataPageColors, glow } from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext";
import Empty from "./Empty";
import { fmtK } from "./analytics.utils";

const VBarChart = ({ data, height = 180, rotateLabels = true }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  if (!data?.length) return <Empty />;
  const max = Math.max(...data.map((d) => d.omset), 1);
  const barArea = Math.max(height - (rotateLabels ? 96 : 72), 40);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "5px",
        height: `${height}px`,
        overflowX: "auto",
        overflowY: "visible",
        paddingTop: "20px",
        paddingBottom: "4px",
        boxSizing: "border-box",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: "1 0 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: "0.58rem",
              color: C.text,
              fontFamily: "monospace",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {fmtK(d.omset)}
          </div>
          <div
            style={{
              width: "60%",
              maxWidth: "28px",
              height: `${Math.max((d.omset / max) * barArea, d.omset > 0 ? 4 : 0)}px`,
              background: C.yellow,
              boxShadow: glow(theme, `0 0 6px ${C.yellow}40`),
              transition: "height 0.4s ease",
            }}
          />
          <div
            style={
              rotateLabels
                ? {
                    fontSize: "0.58rem",
                    color: C.muted,
                    fontFamily: "monospace",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    lineHeight: 1,
                    height: "40px",
                    whiteSpace: "nowrap",
                  }
                : {
                    fontSize: "0.62rem",
                    color: C.muted,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    height: "16px",
                  }
            }
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VBarChart;