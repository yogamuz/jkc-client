import { createPortal } from "react-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useSidebarColors } from "./SidebarTokens";

const CropAvatarModal = ({
  imgSrc,
  imgRef,
  crop,
  setCrop,
  onImageLoad,
  onComplete,
  onConfirm,
  onCancel,
  loading,
}) => {
  const C = useSidebarColors();

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.65rem",
          fontWeight: 900,
          letterSpacing: "3px",
          color: C.yellow,
        }}
      >
        CROP AVATAR
      </div>

      <div
        style={{
          border: `1px solid ${C.border}`,
          maxWidth: "320px",
          maxHeight: "320px",
          overflow: "hidden",
        }}
      >
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={onComplete} aspect={1} circularCrop>
          <img
            ref={imgRef}
            src={imgSrc}
            onLoad={onImageLoad}
            style={{ maxWidth: "320px", maxHeight: "320px", display: "block" }}
            alt="crop preview"
          />
        </ReactCrop>
      </div>

      <div style={{ fontSize: "0.55rem", color: C.muted, fontFamily: "'Courier New', monospace", letterSpacing: "1px" }}>
        DRAG UNTUK MENYESUAIKAN AREA
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "0.5rem 1.5rem",
            background: "transparent",
            border: `1px solid ${C.muted}`,
            color: C.muted,
            fontFamily: "'Courier New', monospace",
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "2px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.text;
            e.currentTarget.style.color = C.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.muted;
            e.currentTarget.style.color = C.muted;
          }}
        >
          BATAL
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: "0.5rem 1.5rem",
            background: loading ? C.dimmed : "transparent",
            border: `1px solid ${loading ? C.dimmed : C.yellow}`,
            color: loading ? C.muted : C.yellow,
            fontFamily: "'Courier New', monospace",
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "2px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "rgba(255,230,0,0.08)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "transparent";
          }}
        >
          {loading ? "UPLOADING..." : "SIMPAN"}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CropAvatarModal;