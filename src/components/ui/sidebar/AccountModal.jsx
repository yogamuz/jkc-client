import { C, inputStyle } from "./SidebarTokens";

const AccountModal = ({
  pwForm,
  setPwForm,
  formError,
  formSuccess,
  formLoading,
  onChangePw,
  onClose,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 999,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
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
      GANTI PASSWORD
    </div>

    <div
      style={{
        width: "100%",
        maxWidth: "280px",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <input
        type="password"
        placeholder="Password lama"
        value={pwForm.currentPassword}
        onChange={(e) =>
          setPwForm((p) => ({ ...p, currentPassword: e.target.value }))
        }
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password baru (min. 6)"
        value={pwForm.newPassword}
        onChange={(e) =>
          setPwForm((p) => ({ ...p, newPassword: e.target.value }))
        }
        style={inputStyle}
      />

      {formError && (
        <div
          style={{
            fontSize: "0.6rem",
            color: "#ff6b6b",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "1px",
          }}
        >
          {formError}
        </div>
      )}
      {formSuccess && (
        <div
          style={{
            fontSize: "0.6rem",
            color: C.cyan,
            fontFamily: "'Courier New', monospace",
            letterSpacing: "1px",
          }}
        >
          {formSuccess}
        </div>
      )}
    </div>

    <div style={{ display: "flex", gap: "0.75rem" }}>
      <button
        onClick={onClose}
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
        onClick={onChangePw}
        disabled={formLoading}
        style={{
          padding: "0.5rem 1.5rem",
          background: formLoading ? C.dimmed : "transparent",
          border: `1px solid ${formLoading ? C.dimmed : C.yellow}`,
          color: formLoading ? C.muted : C.yellow,
          fontFamily: "'Courier New', monospace",
          fontSize: "0.65rem",
          fontWeight: 900,
          letterSpacing: "2px",
          cursor: formLoading ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!formLoading)
            e.currentTarget.style.background = "rgba(255,230,0,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!formLoading) e.currentTarget.style.background = "transparent";
        }}
      >
        {formLoading ? "LOADING..." : "SIMPAN"}
      </button>
    </div>
  </div>
);

export default AccountModal;