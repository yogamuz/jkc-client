import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import CircuitBg from "../ui/CircuitBg";
import CornerGlow from "../ui/CornerGlow";
import { resetUserPassword, deleteUser } from "../../services/authService";
import { useWorkersColors, textGlow } from "./workers.utils";
import { useTheme } from "../../context/ThemeContext";

const getInputStyle = (C) => ({
  padding: "0.6rem 0.875rem",
  background: C.trackBg,
  border: `1px solid ${C.border}`,
  color: C.text,
  fontFamily: "'Courier New', monospace",
  fontSize: "0.78rem",
  outline: "none",
  width: "280px",
  boxSizing: "border-box",
  letterSpacing: "1px",
});

const AdminDetailPanel = ({ admin, onBack, onDeleted }) => {
  const C = useWorkersColors();
  const { theme } = useTheme();
  const inputStyle = getInputStyle(C);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPw = async () => {
    setError("");
    setSuccess("");
    if (!newPassword || newPassword.length < 6)
      return setError("Password baru minimal 6 karakter.");
    setLoading(true);
    try {
      await resetUserPassword(admin._id, newPassword);
      setSuccess("Password berhasil direset.");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus akun admin "${admin.username}"?`)) return;
    setError("");
    setLoading(true);
    try {
      await deleteUser(admin._id);
      onDeleted();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "clamp(1rem, 4vw, 2.5rem)",
        background: C.bg,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CircuitBg />
      <CornerGlow />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: C.muted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "2px",
              marginBottom: "0.75rem",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            <ChevronLeft size={13} strokeWidth={2} /> BACK
          </button>
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "4px",
              color: C.muted,
              fontFamily: "'Courier New', monospace",
              marginBottom: "4px",
            }}
          >
            // ADMIN DETAIL
          </div>

          {/* Avatar + name */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "4px" }}
          >
            {admin.avatar ? (
              <img
                src={admin.avatar}
                alt={admin.username}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${C.cyan}`,
                  boxShadow: `0 0 16px ${C.cyan}40`,
                }}
              />
            ) : (
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: C.hoverBg,
                  border: `2px solid ${C.cyan}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: C.cyan,
                  fontFamily: "monospace",
                  boxShadow: `0 0 16px ${C.cyan}40`,
                }}
              >
                {admin.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1
                style={{
                  fontSize: "clamp(1.8rem, 7vw, 3.5rem)",
                  fontWeight: 900,
                  color: C.cyan,
                  margin: 0,
                  letterSpacing: "-2px",
                  fontFamily: "'Courier New', monospace",
                  lineHeight: 0.9,
                  textShadow: textGlow(C.cyan, theme),
                }}
              >
                {admin.username.toUpperCase()}
              </h1>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: C.muted,
                  fontFamily: "monospace",
                  marginTop: "6px",
                  letterSpacing: "1px",
                }}
              >
                {admin.lastLogin
                  ? `Last login: ${new Date(admin.lastLogin).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                  : "Belum pernah login"}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: C.cyan,
              marginTop: "12px",
              boxShadow: `0 0 10px ${C.cyan}`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: "480px",
        }}
      >
        {/* Reset Password */}
        <div
          style={{
            border: `1px solid ${C.border}`,
            background: C.panel,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.cyan,
              fontFamily: "'Courier New', monospace",
              marginBottom: "1rem",
            }}
          >
            // RESET PASSWORD
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="password"
              placeholder="Password baru (min. 6)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPw()}
              style={inputStyle}
            />
            <button
              onClick={handleResetPw}
              disabled={loading}
              style={{
                background: loading ? "transparent" : C.yellow,
                border: `1px solid ${loading ? C.muted : C.yellow}`,
                color: loading ? C.muted : "#000",
                padding: "0.6rem 1.25rem",
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Courier New', monospace",
                boxShadow: loading ? "none" : `0 0 14px ${C.yellow}40`,
              }}
            >
              {loading ? "..." : "SIMPAN"}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.65rem",
                color: "#ff6b6b",
                fontFamily: "monospace",
                letterSpacing: "1px",
              }}
            >
              ⚠ {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.65rem",
                color: C.cyan,
                fontFamily: "monospace",
                letterSpacing: "1px",
              }}
            >
              ✓ {success}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div
          style={{
            border: `1px solid ${C.magenta}40`,
            background: "rgba(255,60,172,0.03)",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.magenta,
              fontFamily: "'Courier New', monospace",
              marginBottom: "0.75rem",
            }}
          >
            // DANGER ZONE
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              color: C.muted,
              fontFamily: "monospace",
              marginBottom: "1rem",
              letterSpacing: "0.5px",
            }}
          >
            Hapus akun admin ini secara permanen.
          </div>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              background: "transparent",
              border: `1px solid ${C.magenta}`,
              color: C.magenta,
              padding: "0.55rem 1.25rem",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,60,172,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            HAPUS AKUN
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailPanel;