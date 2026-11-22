import { useTheme } from "../../context/ThemeContext";
import { useDataPageColors } from "../../constants/dataPage.constants";

/*
 * Skeleton loading global — dipakai semua page.
 * - Keyframes di-inject sekali ke <head>
 * - Warna otomatis ikut tema (dark / light)
 * - Hanya bahan dasar: Skeleton (kotak), SkeletonRows (isi <tbody>), SkeletonList.
 * - Layout skeleton tiap page ada di components/skeletons/
 */

const STYLE_ID = "jc-skeleton-style";
const CSS = `
@keyframes jcSkel { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .jc-skel { animation: none !important; } }
`;

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

export const useSkeletonColors = () => {
  const { theme } = useTheme();
  return theme === "light"
    ? { a: "#e4e0d4", b: "#f2efe6" }
    : { a: "#1c1c20", b: "#2b2b31" };
};

export const Skeleton = ({ w = "100%", h = 14, r = 4, style }) => {
  const { a, b } = useSkeletonColors();
  return (
    <div
      className="jc-skel"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        flexShrink: 0,
        background: `linear-gradient(90deg, ${a} 25%, ${b} 50%, ${a} 75%)`,
        backgroundSize: "200% 100%",
        animation: "jcSkel 1.4s linear infinite",
        ...style,
      }}
    />
  );
};

const COL_WIDTHS = ["55%", "80%", "45%", "70%", "60%", "35%"];

// Pengganti teks "MEMUAT..." di dalam <tbody> tabel
export const SkeletonRows = ({ rows = 6, cols = 4 }) => {
  const C = useDataPageColors();
  return Array.from({ length: rows }).map((_, r) => (
    <tr key={r} style={{ borderBottom: `1px solid ${C.border}` }}>
      {Array.from({ length: cols }).map((__, c) => (
        <td key={c} style={{ padding: "0.85rem 0.875rem" }}>
          <Skeleton w={COL_WIDTHS[(r + c) % COL_WIDTHS.length]} h={12} />
        </td>
      ))}
    </tr>
  ));
};

// Pengganti teks "MEMUAT..." untuk body berbentuk daftar (bukan tabel)
export const SkeletonList = ({ rows = 4 }) => (
  <div style={{ display: "grid", gap: "0.75rem", padding: "1.25rem" }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Skeleton w={36} h={36} r={6} />
        <div style={{ flex: 1, display: "grid", gap: "6px" }}>
          <Skeleton w="35%" h={12} />
          <Skeleton w="60%" h={10} />
        </div>
        <Skeleton w={70} h={24} />
      </div>
    ))}
  </div>
);

export default Skeleton;