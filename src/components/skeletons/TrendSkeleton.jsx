import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card, StatCardsSkeleton } from "./parts";

// Layout: header -> filter metrik + periode -> ringkasan -> grafik garis besar
const TrendSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} w={88} h={32} />
      ))}
      <Skeleton w={150} h={32} style={{ marginLeft: "auto" }} />
    </div>
    <StatCardsSkeleton count={4} min={150} />
    <Card style={{ display: "grid", gap: "14px" }}>
      <Skeleton w="30%" h={12} />
      <Skeleton h={260} r={4} />
    </Card>
  </PageWrap>
);

export default TrendSkeleton;