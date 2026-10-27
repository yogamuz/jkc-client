import { useEffect } from "react";
import { useDataPageColors } from "../../constants/dataPage.constants";

const ConfirmModal = ({
  open,
  title = "KONFIRMASI",
  message,
  confirmText = "YA",
  cancelText = "BATAL",
  variant = "danger", // "danger" | "success" | "info"
  hideCancel = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const C = useDataPageColors();

  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onCancel]);

  if (!open) return null;

  // warna tombol konfirmasi mengikuti variant, border modal selalu cyan
  const accent =
    variant === "danger" ? C.magenta : variant === "success" ? C.green : C.cyan;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div
        style={{
          background: C.modalBg,
          border: `1px solid ${C.cyan}`,
          borderRadius: "10px",
          width: "calc(100% - 2rem)",
          maxWidth: "300px",
          overflow: "hidden",
          boxShadow: `0 0 24px ${C.cyan}25`,
        }}
      >
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            padding: "0.55rem 1rem",
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "2.5px",
            color: C.cyan,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {title}
        </div>
        <div
          style={{
            padding: "0.9rem 1rem",
            color: C.text,
            fontSize: "0.74rem",
            fontFamily: "'Courier New', monospace",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message}
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "0.6rem 1rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            background: C.modalFooterBg,
          }}
        >
          {!hideCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "6px",
                color: C.muted,
                padding: "0.35rem 0.9rem",
                fontWeight: 900,
                fontSize: "0.68rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1.5px",
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: loading ? "transparent" : accent,
              border: `1px solid ${loading ? C.muted : accent}`,
              borderRadius: "6px",
              color: loading ? C.muted : "#000",
              padding: "0.35rem 1rem",
              fontWeight: 900,
              fontSize: "0.68rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1.5px",
            }}
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;