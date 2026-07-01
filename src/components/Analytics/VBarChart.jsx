import { useDataPageColors, glow } from "../../constants/dataPage.constants";
import { useTheme } from "../../context/ThemeContext"; // sesuaikan path
import Empty from "./Empty";
import { fmtK } from "./analytics.utils";

const VBarChart = ({ data }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();

  if (!data?.length) return <Empty />;
  const max = Math.max(...data.map((d) => d.omset), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "140px", // ← naikan dari 120px
        overflowX: "auto",
        overflowY: "visible", // ← tambah ini
        paddingTop: "20px", // ← tambah ruang untuk label angka di atas bar
        paddingBottom: "4px",
        boxSizing: "border-box",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            minWidth: "28px",
          }}
        >
          <div
            style={{
              fontSize: "0.5rem",
              color: C.muted,
              fontFamily: "monospace",
            }}
          >
            {fmtK(d.omset)}
          </div>
          <div
            style={{
              width: "20px",
              height: `${Math.max((d.omset / max) * 90, d.omset > 0 ? 4 : 0)}px`,
              background: C.yellow,
              boxShadow: glow(theme, `0 0 6px ${C.yellow}40`),
            }}
          />
          <div
            style={{
              fontSize: "0.5rem",
              color: C.muted,
              fontFamily: "monospace",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              lineHeight: 1,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VBarChart;
