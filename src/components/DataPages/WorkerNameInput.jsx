import { useState, useRef, useEffect } from "react";
import { Users } from "lucide-react";
import {
  useDataPageColors,
  getInputS,
} from "../../constants/dataPage.constants";

const WorkerNameInput = ({
  value,
  onChange,
  options = [],
  placeholder = "ACIL",
}) => {
  const C = useDataPageColors();
  const inputS = getInputS(C);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = value
    ? options.filter((w) => w.name.toUpperCase().includes(value.toUpperCase()))
    : options;

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "180px" }}>
      <input
        style={{ ...inputS, width: "180px" }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toUpperCase());
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: C.modalBg,
            border: `1px solid ${C.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 10px",
              borderBottom: `1px solid ${C.border}`,
              fontFamily: "'Courier New', monospace",
              fontSize: "0.75rem",
              fontWeight: 900,
              letterSpacing: "1px",
              color: C.mutedAlt,
              background: C.trackBg,
            }}
          >
            <Users size={12} strokeWidth={2} />
            {options.length}
          </div>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            {filtered.map((w) => (
              <div
                key={w.name}
                onMouseDown={() => {
                  onChange(w.name);
                  setOpen(false);
                }}
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  color: C.text,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {w.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerNameInput;
