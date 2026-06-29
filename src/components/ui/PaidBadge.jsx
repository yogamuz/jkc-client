import { CheckCircle, Circle } from "lucide-react";
import { C } from "../../constants/dataPage.constants";

const PaidBadge = ({ isPaid, onClick }) => (
  <button
    onClick={onClick}
    title={isPaid ? "Klik untuk mark UNPAID" : "Klik untuk mark PAID"}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "2px 8px",
      fontSize: "0.6rem",
      fontWeight: 900,
      letterSpacing: "1.5px",
      background: isPaid ? "rgba(0,229,255,0.08)" : "transparent",
      color: isPaid ? C.cyan : C.muted,
      border: `1px solid ${isPaid ? C.cyan : C.dim}`,
      fontFamily: "'Courier New', monospace",
      cursor: "pointer",
    }}
  >
    {isPaid ? (
      <CheckCircle size={10} strokeWidth={2} />
    ) : (
      <Circle size={10} strokeWidth={2} />
    )}
    {isPaid ? "PAID" : "UNPAID"}
  </button>
);

export default PaidBadge;