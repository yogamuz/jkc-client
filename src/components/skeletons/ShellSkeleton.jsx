import { useSidebarColors } from "../ui/sidebar/SidebarTokens";
import { Skeleton } from "../ui/Skeleton";
import DashboardSkeleton from "./DashboardSkeleton";
import DataSkeleton from "./DataSkeleton";
import WorkersSkeleton from "./WorkersSkeleton";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import TrendSkeleton from "./TrendSkeleton";
import RateConfigSkeleton from "./RateConfigSkeleton";
import NewSeasonSkeleton from "./NewSeasonSkeleton";
import AdminsSkeleton from "./AdminsSkeleton";
import AuditLogSkeleton from "./AuditLogSkeleton";
import WorkerRegistrySkeleton from "./WorkerRegistrySkeleton";

// Skeleton milik masing-masing page, dipilih dari halaman aktif (URL)
const PAGE_SKELETON = {
  dashboard: DashboardSkeleton,
  data: DataSkeleton,
  workers: WorkersSkeleton,
  analytics: AnalyticsSkeleton,
  trends: TrendSkeleton,
  rates: RateConfigSkeleton,
  newSeason: NewSeasonSkeleton,
  admins: AdminsSkeleton,
  auditLog: AuditLogSkeleton,
  workerRegistry: WorkerRegistrySkeleton,
};

const NAV_ROWS = 8;

// Kerangka aplikasi saat cek sesi (F5): sidebar + bar atas + skeleton page aktif.
// page = null (mis. di /login) -> layar kosong polos, tanpa kerangka.
const ShellSkeleton = ({ page }) => {
  const C = useSidebarColors();
  const PageSkeleton = PAGE_SKELETON[page] || DashboardSkeleton;

  if (page === null) {
    return <div style={{ width: "100vw", height: "100vh", background: C.bg }} />;
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: C.bg, overflow: "hidden" }}>
      {/* className sama dengan sidebar asli: otomatis tersembunyi di mobile */}
      <aside
        className="app-sidebar"
        style={{
          width: "220px",
          flexShrink: 0,
          background: C.bgPanel,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}`, display: "grid", gap: 8 }}>
          <Skeleton w="65%" h={16} />
          <Skeleton w="85%" h={8} />
        </div>
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: `1px solid ${C.border}`, display: "grid", gap: 10 }}>
          <Skeleton w={70} h={8} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Skeleton w={40} h={40} r={999} />
            <Skeleton w={52} h={18} />
          </div>
        </div>
        <div style={{ padding: "0.75rem 1.25rem", display: "grid", gap: "1.1rem" }}>
          {Array.from({ length: NAV_ROWS }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Skeleton w={14} h={14} r={3} />
              <Skeleton w={`${45 + ((i * 17) % 40)}%`} h={11} />
            </div>
          ))}
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}>
        <main style={{ flex: 1, minHeight: 0, overflowY: "hidden" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", height: 58, padding: "0.75rem 1rem", boxSizing: "border-box" }}>
            <Skeleton w={34} h={34} />
            <Skeleton w={34} h={34} />
          </div>
          <PageSkeleton />
        </main>
      </div>
    </div>
  );
};

export default ShellSkeleton;