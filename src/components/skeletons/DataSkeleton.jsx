import { PageWrap, HeaderSkeleton, FilterRowSkeleton, StatCardsSkeleton, TableSkeleton } from "./parts";

// Layout: header + tombol aksi -> kartu ringkasan -> filter -> tabel order
const DataSkeleton = () => (
  <PageWrap>
    <HeaderSkeleton actions={3} />
    <StatCardsSkeleton count={5} />
    <FilterRowSkeleton count={6} />
    <TableSkeleton
      cols={8}
      rows={8}
      widths={["30%", "70%", "55%", "40%", "60%", "50%", "45%", "35%"]}
    />
  </PageWrap>
);

export default DataSkeleton;