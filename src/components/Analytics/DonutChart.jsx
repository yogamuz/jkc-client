import { useDataPageColors } from "../../constants/dataPage.constants";
import Empty from "./Empty";

const DonutChart = ({ slices }) => {
  const C = useDataPageColors();

  if (!slices?.length) return <Empty />;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <Empty />;

  let cumul = 0;
  const gradient = slices
    .map((s) => {
      const pct = (s.value / total) * 100;
      const from = cumul;
      cumul += pct;
      return `${s.color} ${from.toFixed(1)}% ${cumul.toFixed(1)}%`;
    })
    .join(", ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          flexShrink: 0,
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {slices.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: C.muted,
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: C.text,
                marginLeft: "auto",
                paddingLeft: "8px",
              }}
            >
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
