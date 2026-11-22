import { Skeleton } from "../ui/Skeleton";
import { PageWrap, HeaderSkeleton, StatCardsSkeleton, TableSkeleton } from "./parts";

// Layout: header + dropdown season -> kartu ringkasan worker -> tabel worker
const WorkersSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <Skeleton w={200} h={36} style={{ marginBottom: "1.25rem" }} />
    <StatCardsSkeleton count={4} />
    <TableSkeleton
      cols={8}
      rows={7}
      widths={["20%", "55%", "40%", "50%", "45%", "60%", "50%", "35%"]}
    />
  </PageWrap>
);

export default WorkersSkeleton;