import { useDataPageColors } from "../../constants/dataPage.constants";

const Empty = () => {
  const C = useDataPageColors();
  return (
    <div
      style={{
        color: C.dim,
        fontFamily: "monospace",
        fontSize: "0.7rem",
        letterSpacing: "2px",
        padding: "1rem 0",
      }}
    >
      NO DATA
    </div>
  );
};

export default Empty;
