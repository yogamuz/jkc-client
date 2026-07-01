import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDataPageColors } from "../../constants/dataPage.constants";

const SeasonSelector = ({ seasons, selectedId, onChange }) => {
  const C = useDataPageColors();
  const [open, setOpen] = useState(false);
  const selected = seasons.find((s) => s.id === selectedId);

  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: C.panel2,
          border: `1px solid ${C.border}`,
          color: C.text,
          padding: "7px 14px",
          cursor: "pointer",
          fontSize: "0.68rem",
          fontWeight: 900,
          letterSpacing: "1.5px",
          fontFamily: "'Courier New', monospace",
          minWidth: "180px",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: selected?.isActive ? C.cyan : C.muted,
              flexShrink: 0,
              boxShadow: selected?.isActive ? `0 0 4px ${C.cyan}` : "none",
            }}
          />
          {selected?.name || "PILIH SEASON"}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          style={{
            opacity: 0.6,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: C.panel2,
            border: `1px solid ${C.border}`,
            zIndex: 1000,
            minWidth: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 14px",
                background:
                  s.id === selectedId ? "rgba(255,230,0,0.06)" : "transparent",
                border: "none",
                borderLeft:
                  s.id === selectedId
                    ? `2px solid ${C.yellow}`
                    : "2px solid transparent",
                color: s.id === selectedId ? C.yellow : C.muted,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "1.5px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                textAlign: "left",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (s.id !== selectedId) {
                  e.currentTarget.style.background = C.hoverBg;
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={(e) => {
                if (s.id !== selectedId) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: s.isActive ? C.cyan : C.dim,
                  flexShrink: 0,
                  boxShadow: s.isActive ? `0 0 4px ${C.cyan}` : "none",
                }}
              />
              {s.name}
              {s.isActive && (
                <span
                  style={{
                    fontSize: "0.5rem",
                    color: C.cyan,
                    letterSpacing: "2px",
                    marginLeft: "auto",
                  }}
                >
                  AKTIF
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonSelector;
