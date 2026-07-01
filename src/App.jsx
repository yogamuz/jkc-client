import { useState, useEffect } from "react";
import Lightfall from "./components/LightFall";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DataPage from "./pages/DataPage";
import WorkersPage from "./pages/WorkersPage";
import RateConfigPage from "./pages/RateConfigPage";
import NewSeasonPage from "./pages/NewSeasonPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminsPage from "./pages/AdminsPage";
import Sidebar from "./components/ui/Sidebar";
import ThemeToggle from "./components/ui/sidebar/ThemeToggle";
import { useSidebarColors } from "./components/ui/sidebar/SidebarTokens";
import useAuth from "./hooks/useAuth";
import useSeason from "./hooks/useSeason";

function App() {
  const { user, setUser, checkSession, logout } = useAuth();
  const { seasons, fetchAll } = useSeason();
  const [activePage, setActivePage] = useState("dashboard");
  const [activeSeasonId, setActiveSeasonId] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const C = useSidebarColors();
  const handleAvatarUpdate = (avatarUrl) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
  };
  useEffect(() => {
    checkSession().finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (user) fetchAll();
  }, [user]);
  useEffect(() => {
    if (seasons.length > 0 && !activeSeasonId) {
      const active = seasons.find((s) => s.isActive) || seasons[0];
      setActiveSeasonId(active.id);
    }
  }, [seasons]);

  const handleSelectSeason = (id) => {
    setActiveSeasonId(id);
    setActivePage("data");
  };

  if (checking)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          letterSpacing: "6px",
          fontSize: "0.75rem",
          fontFamily: "monospace",
          color: "#FFE600",
        }}
      >
        LOADING...
      </div>
    );

  if (!user)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          backgroundColor: "#0A29FF",
        }}
      >
        <Lightfall
          colors={["#A6C8FF", "#5227FF", "#FF9FFC"]}
          backgroundColor="#0A29FF"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={0.6}
          density={0.6}
          twinkle={0}
          zoom={3.9}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction={false}
        />
        <LoginPage onLoginSuccess={setUser} />
      </div>
    );

  const activeSeason = seasons.find((s) => s.id === activeSeasonId) || null;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage onNavigate={setActivePage} seasons={seasons} />;
      case "data":
        return <DataPage season={activeSeason} />;
      case "newSeason":
        return <NewSeasonPage onCreated={(id) => handleSelectSeason(id)} />;
      case "workers":
        return (
          <WorkersPage seasons={seasons} activeSeasonId={activeSeasonId} />
        );
      case "analytics":
        return <AnalyticsPage season={activeSeason} seasons={seasons} />;
      case "rates":
        return <RateConfigPage seasons={seasons} />;
      case "admins":
        return <AdminsPage />;
      default:
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
          }}
        />
      )}

      {/* Hamburger + Theme toggle (mobile only) */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 60,
          gap: "0.5rem",
          alignItems: "center",
        }}
        className="mobile-hamburger"
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            background: C.bgPanel,
            border: `1px solid ${C.border}`,
            color: C.yellow,
            cursor: "pointer",
            padding: "6px 8px",
            fontFamily: "monospace",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ☰
        </button>
        <ThemeToggle iconOnly />
      </div>
      <Sidebar
        activePage={activePage}
        activeSeasonId={activeSeasonId}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        onSelectSeason={(id) => {
          handleSelectSeason(id);
          setSidebarOpen(false);
        }}
        seasons={seasons}
        user={user}
        onLogout={logout}
        isOpen={sidebarOpen}
        onAvatarUpdate={handleAvatarUpdate} // ← tambah ini
      />
      <main style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</main>
    </div>
  );
}

const PlaceholderPage = ({ title }) => (
  <div
    style={{
      padding: "2rem 2.5rem",
      background: "#0D0D0D",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "3px",
        color: "#555",
        fontFamily: "monospace",
        marginBottom: "4px",
      }}
    >
      // COMING SOON
    </div>
    <h1
      style={{
        fontSize: "3rem",
        fontWeight: 900,
        color: "#E8E8E8",
        margin: 0,
        letterSpacing: "-3px",
        textTransform: "uppercase",
        fontFamily: "monospace",
        lineHeight: 0.9,
      }}
    >
      {title}
    </h1>
    <div
      style={{
        width: "48px",
        height: "2px",
        background: "#FFE600",
        marginTop: "10px",
        boxShadow: "0 0 8px #FFE600",
      }}
    />
  </div>
);

export default App;