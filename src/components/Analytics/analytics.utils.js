// ── Helpers ───────────────────────────────────────────────
export const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
export const fmtK = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}jt`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}rb`
      : String(n);

// ── Palette ───────────────────────────────────────────────
// Dulu ini module-level const yang baca C statis. Sekarang jadi
// factory function karena C reaktif terhadap theme.
export const getPalette = (c) => [
  c.yellow,
  c.cyan,
  c.magenta,
  c.green,
  "#FF9500",
  "#BF5AF2",
  "#FF453A",
  "#30D158",
];

export const getColorAt = (palette) => (i) => palette[i % palette.length];
