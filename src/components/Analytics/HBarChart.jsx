import { useDataPageColors } from "../../constants/dataPage.constants";
import Empty from "./Empty";

const HBarChart = ({
  data,
  colorFn,
  valueKey = "value",
  labelKey = "label",
  formatVal = (v) => v,
}) => {
  const C = useDataPageColors();

  if (!data?.length) return <Empty />;
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              fontSize: "0.62rem",
              fontFamily: "monospace",
              color: C.muted,
              width: "90px",
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {d[labelKey]}
          </div>
          <div
            style={{
              flex: 1,
              background: C.trackBg,
              height: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${(d[valueKey] / max) * 100}%`,
                background: colorFn ? colorFn(i) : C.cyan,
                transition: "width 0.4s ease",
                minWidth: d[valueKey] > 0 ? "2px" : 0,
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.62rem",
              fontFamily: "monospace",
              color: C.text,
              width: "70px",
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {formatVal(d[valueKey])}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HBarChart;
