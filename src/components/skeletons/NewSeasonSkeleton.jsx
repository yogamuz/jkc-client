import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card } from "./parts";

// Layout: header -> info dasar -> tabel rate (100px 1fr 1fr 1fr 1fr 36px) -> tombol buat
const NewSeasonSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "820px" }}>
      <Card style={{ display: "grid", gap: "1rem" }}>
        <Skeleton w={120} h={10} />
        <Skeleton h={36} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <Skeleton h={36} />
          <Skeleton h={36} />
        </div>
      </Card>
      <Card style={{ display: "grid", gap: "0.5rem" }}>
        <Skeleton w={110} h={10} style={{ marginBottom: "0.5rem" }} />
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 36px",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <Skeleton w="70%" h={12} />
            <Skeleton h={32} />
            <Skeleton h={32} />
            <Skeleton h={32} />
            <Skeleton h={32} />
            <Skeleton w={32} h={32} />
          </div>
        ))}
      </Card>
      <Skeleton w={150} h={40} />
    </div>
  </PageWrap>
);

export default NewSeasonSkeleton;