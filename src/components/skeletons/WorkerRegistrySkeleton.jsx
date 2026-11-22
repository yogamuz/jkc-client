import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, Card, TableSkeleton } from "./parts";

// Layout: header -> form tambah worker -> tabel worker (nama, status, telegram, kode, aksi)
const WorkerRegistrySkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <Card style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      <Skeleton w={220} h={36} />
      <Skeleton w={100} h={36} />
      <Skeleton w={190} h={36} />
    </Card>
    <TableSkeleton cols={6} rows={6} widths={["40%", "35%", "55%", "40%", "45%", "70%"]} />
  </PageWrap>
);

export default WorkerRegistrySkeleton;