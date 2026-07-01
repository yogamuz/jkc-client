import { useState } from "react";
import { LogOut, Sparkles } from "lucide-react";
import { changePassword } from "../../services/authService";
import { useSidebarColors } from "./sidebar/SidebarTokens";
import SidebarUserInfo from "./sidebar/SidebarUserInfo";
import SidebarNav from "./sidebar/SidebarNav";
import AccountModal from "./sidebar/AccountModal";
import ThemeToggle from "./sidebar/ThemeToggle";

const Sidebar = ({
  activePage,
  activeSeasonId,
  onNavigate,
  onSelectSeason,
  seasons = [],
  user,
  onLogout,
  isOpen,
  onAvatarUpdate,
}) => {
  const C = useSidebarColors();
  const [showChangePw, setShowChangePw] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const resetFormState = () => {
    setFormError("");
    setFormSuccess("");
  };

  const closeModals = () => {
    setShowChangePw(false);
    resetFormState();
    setPwForm({ currentPassword: "", newPassword: "" });
  };

  const handleChangePw = async () => {
    resetFormState();
    if (!pwForm.currentPassword || !pwForm.newPassword)
      return setFormError("Semua field wajib diisi.");
    if (pwForm.newPassword.length < 6)
      return setFormError("Password baru minimal 6 karakter.");
    setFormLoading(true);
    try {
      await changePassword(pwForm);
      setFormSuccess("Password berhasil diubah. Silakan login ulang.");
      setPwForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => onLogout(), 1500);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <aside
        className={`app-sidebar ${isOpen ? "sidebar-open" : ""}`}
        style={{
          width: "220px",
          background: C.bgPanel,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: `1px solid ${C.border}`,
            background: C.bg,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "2px",
              background: C.yellow,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "4px",
            }}
          >
            <Sparkles size={14} color={C.yellow} strokeWidth={2} />
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                letterSpacing: "1px",
                color: C.yellow,
                fontFamily: "'Courier New', monospace",
                lineHeight: 1,
              }}
            >
              JOKI CALM
            </div>
          </div>
          <div
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              color: C.muted,
              marginTop: "4px",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "3px",
            }}
          >
            MANAGEMENT SYSTEM
          </div>
        </div>

        <SidebarUserInfo user={user} onAvatarUpdate={onAvatarUpdate} />

        <SidebarNav
          activePage={activePage}
          activeSeasonId={activeSeasonId}
          seasons={seasons}
          user={user}
          onNavigate={onNavigate}
          onSelectSeason={onSelectSeason}
          onOpenChangePw={() => {
            setShowChangePw(true);
            resetFormState();
          }}
          onOpenManageAdmin={() => {
            closeModals();
            onNavigate("admins");
          }}
        />

        {/* Theme toggle */}
        <div style={{ padding: "0 1.25rem 0.75rem", flexShrink: 0 }}>
          <ThemeToggle />
        </div>

        {/* Logout */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "transparent",
              border: `1px solid ${C.magenta}`,
              color: C.magenta,
              fontWeight: 900,
              fontSize: "0.68rem",
              letterSpacing: "3px",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: `0 0 8px rgba(255,60,172,0.2)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,60,172,0.1)";
              e.currentTarget.style.boxShadow = `0 0 14px rgba(255,60,172,0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = `0 0 8px rgba(255,60,172,0.2)`;
            }}
          >
            <LogOut size={12} strokeWidth={2} />
            LOGOUT
          </button>
        </div>
      </aside>

      {showChangePw && (
        <AccountModal
          pwForm={pwForm}
          setPwForm={setPwForm}
          formError={formError}
          formSuccess={formSuccess}
          formLoading={formLoading}
          onChangePw={handleChangePw}
          onClose={closeModals}
        />
      )}
    </>
  );
};

export default Sidebar;