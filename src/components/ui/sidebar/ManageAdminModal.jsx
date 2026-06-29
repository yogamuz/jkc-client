import { C, inputStyle } from "./SidebarTokens";

const ManageAdminModal = ({
  adminList,
  adminListLoading,
  resetPwTarget,
  setResetPwTarget,
  resetPwValue,
  setResetPwValue,
  formError,
  formSuccess,
  formLoading,
  onResetPw,
  onDelete,
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
      boxSizing: "border-box",
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
      KELOLA ADMIN
    </div>

    {/* Admin list table */}
    <div
      style={{
        width: "min(680px, 90vw)",
        border: `1px solid ${C.border}`,
        background: "#0D0D0D",
        maxHeight: "min(420px, 60vh)",
        overflowY: "auto",
      }}
    >
      {adminListLoading ? (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            color: C.muted,
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "2px",
          }}
        >
          MEMUAT...
        </div>
      ) : adminList.length === 0 ? (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            color: C.muted,
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "2px",
          }}
        >
          BELUM ADA ADMIN
        </div>
      ) : (
        adminList.map((admin) => (
          <div
            key={admin._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.6rem 0.875rem",
              borderBottom: `1px solid ${C.border}`,
              background:
                resetPwTarget?.id === admin._id
                  ? "rgba(0,229,255,0.04)"
                  : "transparent",
            }}
          >
            {/* Avatar + username */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.username}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `1px solid ${C.border}`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: C.bgHover,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.55rem",
                    fontWeight: 900,
                    color: C.text,
                    fontFamily: "monospace",
                  }}
                >
                  {admin.username[0].toUpperCase()}
                </div>
              )}
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "1px",
                }}
              >
                {admin.username.toUpperCase()}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => {
                  setResetPwTarget({ id: admin._id, username: admin.username });
                  setResetPwValue("");
                }}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.cyan}`,
                  color: C.cyan,
                  padding: "3px 8px",
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,229,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                RESET PW
              </button>
              <button
                onClick={() => onDelete(admin._id, admin.username)}
                disabled={formLoading}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.magenta}`,
                  color: C.magenta,
                  padding: "3px 8px",
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  cursor: formLoading ? "not-allowed" : "pointer",
                  fontFamily: "'Courier New', monospace",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,60,172,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                DEL
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Reset PW inline form */}
    {resetPwTarget && (
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            fontSize: "0.55rem",
            color: C.cyan,
            fontFamily: "monospace",
            letterSpacing: "1.5px",
            fontWeight: 700,
          }}
        >
          RESET PASSWORD — {resetPwTarget.username.toUpperCase()}
        </div>
        <input
          type="password"
          placeholder="Password baru (min. 6)"
          value={resetPwValue}
          onChange={(e) => setResetPwValue(e.target.value)}
          style={inputStyle}
        />
      </div>
    )}

    {formError && (
      <div
        style={{
          fontSize: "0.6rem",
          color: "#ff6b6b",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "1px",
          maxWidth: "380px",
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
          maxWidth: "380px",
        }}
      >
        {formSuccess}
      </div>
    )}

    {/* Footer buttons */}
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
        TUTUP
      </button>
      {resetPwTarget && (
        <button
          onClick={onResetPw}
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
      )}
    </div>
  </div>
);

export default ManageAdminModal;
