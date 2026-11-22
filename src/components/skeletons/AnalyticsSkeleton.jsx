import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card, StatCardsSkeleton, ChartCardSkeleton } from "./parts";

// Layout: header -> kontrol (tab + season) -> kartu ringkasan -> grid grafik
const AnalyticsSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      <Skeleton w={110} h={34} />
      <Skeleton w={110} h={34} />
      <Skeleton w={160} h={34} style={{ marginLeft: "auto" }} />
    </div>
    <StatCardsSkeleton count={4} min={160} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "1rem",
      }}
    >
      <ChartCardSkeleton bars={10} />
      <Card style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <Skeleton w={120} h={120} r={999} />
        <div style={{ flex: 1, display: "grid", gap: "10px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} w={`${90 - i * 12}%`} h={11} />
          ))}
        </div>
      </Card>
      <ChartCardSkeleton bars={7} />
      <ChartCardSkeleton bars={12} />
    </div>
  </PageWrap>
);

export default AnalyticsSkeleton;