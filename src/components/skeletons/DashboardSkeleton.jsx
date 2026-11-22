import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card, ChartCardSkeleton } from "./parts";

// Layout: header -> 6 kartu statistik -> Rate Aktif -> Analytics preview (grid 4 kartu)
const DashboardSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />

    <div className="dash-stats" style={{ gap: "1rem", marginBottom: "2rem" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} style={{ display: "grid", gap: "14px", padding: "1.25rem" }}>
          <Skeleton w="50%" h={9} />
          <Skeleton w="65%" h={34} />
        </Card>
      ))}
    </div>

    <Card style={{ marginBottom: "2rem", display: "grid", gap: "14px" }}>
      <Skeleton w={140} h={12} />
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} w={96} h={54} r={6} />
        ))}
      </div>
    </Card>

    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <Skeleton w={180} h={14} />
      <Skeleton w={90} h={28} />
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
      }}
    >
      <ChartCardSkeleton bars={14} />
      <Card style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <Skeleton w={110} h={110} r={999} />
        <div style={{ flex: 1, display: "grid", gap: "10px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} w={`${85 - i * 15}%`} h={11} />
          ))}
        </div>
      </Card>
      <Card style={{ display: "grid", gap: "12px" }}>
        <Skeleton w="45%" h={12} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton w={20} h={20} r={999} />
            <Skeleton w="25%" h={10} />
            <Skeleton w={`${70 - i * 10}%`} h={10} />
          </div>
        ))}
      </Card>
    </div>
  </PageWrap>
);

export default DashboardSkeleton;