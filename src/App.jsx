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
import AuditLogPage from "./pages/AuditLogPage";
import WorkerRegistryPage from "./pages/WorkerRegistryPage";
import Sidebar from "./components/ui/Sidebar";
import ThemeToggle from "./components/ui/sidebar/ThemeToggle";
import { useSidebarColors } from "./components/ui/sidebar/SidebarTokens";
import useAuth from "./hooks/useAuth";
import useSeason from "./hooks/useSeason";
import { useTheme } from "./context/ThemeContext";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PublicRatesPage from "./pages/PublicRatesPage";
import PriceUpdateNotif from "./components/PriceUpdateNotif";

// ── Pemetaan nama halaman (state lama) <-> segmen URL ─────
const PAGE_PATH = {
  dashboard: "dashboard",
  data: "data",
  newSeason: "new-season",
  workers: "workers",
  analytics: "analytics",
  rates: "rates",
  admins: "admins",
  auditLog: "audit-log",
  workerRegistry: "worker-registry",
};
const PATH_PAGE = Object.fromEntries(
  Object.entries(PAGE_PATH).map(([page, seg]) => [seg, page]),
);

// Bersihkan cache data keuangan di localStorage saat logout
const clearAppCaches = () => {
  try {
    Object.keys(localStorage)
      .filter(
        (k) =>
          k === "jokicalm_seasons_cache" ||
          k === "jokicalm_dashboard_cache" ||
          k.startsWith("jokicalm_orders_"),
      )
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // abaikan
  }
};

const MessagePage = ({ label, title }) => (
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
      {label}
    </div>
    <h1
      style={{
        fontSize: "clamp(2rem, 8vw, 3rem)",
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

const AccessDenied = () => (
  <MessagePage label="// 403" title="Akses Ditolak" />
);

const NotFoundInApp = () => <MessagePage label="// 404" title="Not Found" />;

const NotFoundPage = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      fontFamily: "'Courier New', monospace",
      color: "#E8E8E8",
    }}
  >
    <div style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-2px" }}>
      404
    </div>
    <div style={{ color: "#A8A8B2", fontSize: "0.8rem", letterSpacing: "2px" }}>
      HALAMAN TIDAK DITEMUKAN
    </div>
    <Link
      to="/"
      style={{
        color: "#FFE600",
        border: "1px solid #FFE600",
        padding: "0.5rem 1.25rem",
        fontSize: "0.7rem",
        fontWeight: 900,
        letterSpacing: "2px",
        textDecoration: "none",
      }}
    >
      KE LIST HARGA
    </Link>
  </div>
);

function AdminApp() {
  const { user, setUser, checkSession, logout } = useAuth();
  const { seasons, fetchAll } = useSeason();
  const location = useLocation();
  const navigate = useNavigate();

  // Halaman aktif sekarang diturunkan dari URL (/admin/<halaman>/<seasonId?>)
  const segs = location.pathname
    .replace(/^\/(admin|login)\/?/, "")
    .split("/")
    .filter(Boolean);
  const activePage = segs[0] ? PATH_PAGE[segs[0]] || "__notfound" : "dashboard";
  const urlSeasonId = segs[0] === "data" && segs[1] ? segs[1] : null;

  const [activeSeasonId, setActiveSeasonId] = useState(urlSeasonId);
  const [focusOrder, setFocusOrder] = useState(null);
  const [focusWorker, setFocusWorker] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceNotif, setPriceNotif] = useState(null);
  const C = useSidebarColors();
  const { theme } = useTheme();
  const activeSeason = seasons.find((s) => s.id === activeSeasonId) || null;

  // Nama & signature sama dengan versi state lama, tapi sekarang mengubah URL
  const setActivePage = (page, seasonId = activeSeasonId) => {
    const seg = PAGE_PATH[page] || "dashboard";
    navigate(
      page === "data" && seasonId
        ? `/admin/${seg}/${seasonId}`
        : `/admin/${seg}`,
    );
  };

  const getLatestRateEntry = (season) => {
    if (!season?.rateHistory || season.rateHistory.length === 0) return null;
    const sorted = [...season.rateHistory].sort(
      (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate),
    );
    return sorted[0];
  };

  const handleClosePriceNotif = (dontShowAgain) => {
    if (dontShowAgain && priceNotif && activeSeason) {
      localStorage.setItem(
        `jokicalm_price_seen_${activeSeason.id}`,
        String(priceNotif.effectiveDate),
      );
    }
    setPriceNotif(null);
  };
  const handleAvatarUpdate = (avatarUrl) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
  };
  const handleLogout = async () => {
    clearAppCaches();
    await logout();
  };
  useEffect(() => {
    checkSession().finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (user) fetchAll();
  }, [user]);
  // Sinkronkan season dari URL (link langsung / back-forward)
  useEffect(() => {
    if (urlSeasonId && urlSeasonId !== activeSeasonId) {
      setActiveSeasonId(urlSeasonId);
    }
  }, [urlSeasonId]);
  useEffect(() => {
    if (seasons.length > 0 && !activeSeasonId) {
      const active = seasons.find((s) => s.isActive) || seasons[0];
      setActiveSeasonId(active.id);
    }
  }, [seasons]);

  const latestStamp = getLatestRateEntry(activeSeason)?.effectiveDate
    ? String(getLatestRateEntry(activeSeason).effectiveDate)
    : null;

  useEffect(() => {
    if (!activeSeason?.id || !latestStamp) return;
    const latest = getLatestRateEntry(activeSeason);
    const seenKey = `jokicalm_price_seen_${activeSeason.id}`;
    const seenTimestamp = localStorage.getItem(seenKey);
    if (seenTimestamp !== latestStamp) {
      setPriceNotif(latest);
    }
  }, [activeSeason?.id, latestStamp]);
  const handleSelectSeason = (id) => {
    setActiveSeasonId(id);
    setActivePage("data", id);
  };

  const handleGoToOrder = ({ seasonId, workerName, orderId, date }) => {
    if (seasonId) setActiveSeasonId(String(seasonId));
    setFocusOrder({ workerName, orderId, date });
    setActivePage("data", seasonId ? String(seasonId) : activeSeasonId);
  };

  const handleGoToWorker = (workerName) => {
    setFocusWorker(workerName);
    setActivePage("workers");
  };
  if (checking)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          letterSpacing: "6px",
          fontSize: "0.75rem",
          fontFamily: "monospace",
          color: C.yellow,
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

  // Sudah login tapi masih di /login atau /admin kosong -> masuk dashboard
  if (/^\/(login|admin)\/?$/.test(location.pathname))
    return <Navigate to="/admin/dashboard" replace />;

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
        return (
          <DataPage
            season={activeSeason}
            user={user}
            focusOrder={focusOrder}
            onFocusHandled={() => setFocusOrder(null)}
            onGoToWorker={handleGoToWorker}
          />
        );
      case "newSeason":
        return user.role === "owner" ? (
          <NewSeasonPage onCreated={(id) => handleSelectSeason(id)} />
        ) : (
          <AccessDenied />
        );
      case "workers":
        return (
          <WorkersPage
            seasons={seasons}
            activeSeasonId={activeSeasonId}
            onGoToOrder={handleGoToOrder}
            focusWorker={focusWorker}
            onFocusWorkerHandled={() => setFocusWorker(null)}
          />
        );
      case "analytics":
        return <AnalyticsPage season={activeSeason} seasons={seasons} />;
      case "rates":
        return user.role === "owner" ? (
          <RateConfigPage seasons={seasons} onRefresh={fetchAll} />
        ) : (
          <AccessDenied />
        );
      case "admins":
        return user.role === "owner" ? <AdminsPage /> : <AccessDenied />;
      case "auditLog":
        return user.role === "owner" ? <AuditLogPage /> : <AccessDenied />;
      case "workerRegistry":
        return user.role === "owner" ? <WorkerRegistryPage /> : <AccessDenied />;
      default:
        return <NotFoundInApp />;
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
      {priceNotif && (
        <PriceUpdateNotif entry={priceNotif} onClose={handleClosePriceNotif} />
      )}
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
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onAvatarUpdate={handleAvatarUpdate}
      />
      <main style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRatesPage />} />
      <Route path="/login" element={<AdminApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;