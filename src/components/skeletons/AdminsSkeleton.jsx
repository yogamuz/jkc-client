import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card, TableSkeleton } from "./parts";

// Layout: header -> form tambah admin (inline) -> tabel admin
const AdminsSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <Card style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      <Skeleton w={180} h={36} />
      <Skeleton w={180} h={36} />
      <Skeleton w={110} h={36} />
    </Card>
    <TableSkeleton cols={4} rows={5} widths={["45%", "30%", "50%", "25%"]} />
  </PageWrap>
);

export default AdminsSkeleton;