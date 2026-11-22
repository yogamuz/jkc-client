import { Skeleton } from "../ui/Skeleton";
import { useDataPageColors } from "../../constants/dataPage.constants";

/*
 * Potongan kecil yang dipakai ulang oleh skeleton tiap page.
 * Bentuk/tata letak skeleton tetap dibuat sendiri per page.
 */

// Padding & background sama dengan wrapper page asli
export const PageWrap = ({ children }) => {
  const C = useDataPageColors();
  return (
    <div
      style={{
        padding: "clamp(1rem, 4vw, 2.5rem)",
        background: C.bg,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

// Header page: eyebrow kecil, judul besar, garis aksen (+ slot aksi di kanan)
export const HeaderSkeleton = ({ actions = 0 }) => (
  <div
    style={{
      marginBottom: "1.75rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: "1rem",
    }}
  >
    <div style={{ display: "grid", gap: "10px" }}>
      <Skeleton w={110} h={9} />
      <Skeleton w="min(60vw, 340px)" h={44} />
      <Skeleton w={40} h={3} />
    </div>
    {actions > 0 && (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {Array.from({ length: actions }).map((_, i) => (
          <Skeleton key={i} w={96} h={36} />
        ))}
      </div>
    )}
  </div>
);

export const Card = ({ children, style }) => {
  const C = useDataPageColors();
  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        background: C.panel,
        padding: "1rem 1.25rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Deretan kartu angka (label kecil + angka besar)
export const StatCardsSkeleton = ({ count = 4, min = 140, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
      gap: "1rem",
      marginBottom: "1.5rem",
      ...style,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} style={{ display: "grid", gap: "12px" }}>
        <Skeleton w="55%" h={9} />
        <Skeleton w="70%" h={28} />
      </Card>
    ))}
  </div>
);

// Tabel: header kolom + baris, lebar tiap kolom bisa diatur
export const TableSkeleton = ({ cols = 5, rows = 8, widths }) => {
  const C = useDataPageColors();
  const w = (c) => (widths ? widths[c % widths.length] : "65%");
  return (
    <div style={{ border: `1px solid ${C.border}`, background: C.panel, overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: "1rem",
          padding: "0.8rem 0.875rem",
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} w="50%" h={9} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: "1rem",
            padding: "0.85rem 0.875rem",
            borderBottom: r < rows - 1 ? `1px solid ${C.border}` : "none",
          }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} w={w(c)} h={12} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Baris input/filter
export const FilterRowSkeleton = ({ count = 5 }) => (
  <Card
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.75rem",
      marginBottom: "1.25rem",
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} w={i === 0 ? 120 : 140} h={34} />
    ))}
  </Card>
);

// Judul section + isi grafik batang
export const ChartCardSkeleton = ({ bars = 8, height = 160 }) => (
  <Card style={{ display: "grid", gap: "14px" }}>
    <Skeleton w="40%" h={12} />
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <Skeleton
          key={i}
          w="100%"
          h={`${30 + ((i * 37) % 65)}%`}
          r={2}
          style={{ flex: 1 }}
        />
      ))}
    </div>
  </Card>
);