import { PageWrap, HeaderSkeleton, FilterRowSkeleton, TableSkeleton } from "./parts";

// Layout: header -> filter -> tabel log (waktu, user, aksi, entitas, detail)
const AuditLogSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton />
    <FilterRowSkeleton count={4} />
    <TableSkeleton cols={5} rows={9} widths={["50%", "40%", "30%", "35%", "75%"]} />
  </PageWrap>
);

export default AuditLogSkeleton;