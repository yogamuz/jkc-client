import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card } from "./parts";

// Layout: header -> pilih season -> durasi -> form rate per tier -> riwayat rate
const RateConfigSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "980px" }}>
      <Skeleton w={220} h={36} />
      <Card style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <Skeleton w={140} h={34} />
        <Skeleton w={120} h={34} />
        <Skeleton w={90} h={34} />
      </Card>
      <Card style={{ display: "grid", gap: "0.75rem" }}>
        <Skeleton w={160} h={12} />
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: "0.75rem", alignItems: "center" }}
          >
            <Skeleton w="70%" h={12} />
            <Skeleton h={34} />
            <Skeleton h={34} />
            <Skeleton h={34} />
          </div>
        ))}
        <Skeleton w={120} h={36} style={{ marginTop: "0.5rem" }} />
      </Card>
      <Card style={{ display: "grid", gap: "0.75rem" }}>
        <Skeleton w={130} h={12} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <Skeleton w="30%" h={11} />
            <Skeleton w="45%" h={11} />
          </div>
        ))}
      </Card>
    </div>
  </PageWrap>
);

export default RateConfigSkeleton;