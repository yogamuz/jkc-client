import { useState, useEffect } from "react";
import SoftAurora from "./components/SoftAurora";
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
import { useTheme } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import PublicRatesPage from "./pages/PublicRatesPage";

function AdminApp() {
  const { user, setUser, checkSession, logout } = useAuth();
  const { seasons, fetchAll } = useSeason();
  const [activePage, setActivePage] = useState("dashboard");
  const [activeSeasonId, setActiveSeasonId] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const C = useSidebarColors();
  const { theme } = useTheme();
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
          backgroundColor: "#0D0D0D",
        }}
      >
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1}
          color1="#10B981"
          color2="#06B6D4"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.25}
        />
        <LoginPage onLoginSuccess={setUser} />
      </div>
    );

  const activeSeason = seasons.find((s) => s.id === activeSeasonId) || null;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardPage
            onNavigate={setActivePage}
            seasons={seasons}
            user={user}
          />
        );
      case "data":
        return <DataPage season={activeSeason} user={user} />;
      case "newSeason":
        return <NewSeasonPage onCreated={(id) => handleSelectSeason(id)} />;
      case "workers":
        return (
          <WorkersPage seasons={seasons} activeSeasonId={activeSeasonId} />
        );
      case "analytics":
        return <AnalyticsPage season={activeSeason} seasons={seasons} />;
      case "rates":
        return user.role === "owner" ? (
          <RateConfigPage seasons={seasons} />
        ) : (
          <AccessDenied />
        );
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
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          gap: "0.5rem",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background:
            theme === "light" ? "rgba(255,247,240,0.6)" : "rgba(13,13,13,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        className="mobile-hamburger"
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            background: C.bgPanel,
            border: `1px solid ${C.border}`,
            color: C.yellow,
            cursor: "pointer",
            padding: 0,
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRatesPage />} />
      <Route path="/login" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
