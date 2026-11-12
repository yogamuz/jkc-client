// ── Helpers ──────────────────────────────────────────────────
export const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
export const fmtK = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}jt`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}rb`
      : String(n);

// ── Palette ──────────────────────────────────────────────────
// Factory function karena C reaktif terhadap theme.
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

// ── Trend: bandingkan N hari terakhir vs N hari sebelumnya ──
const DAY_MS = 86400000;

export const calcTrend = (orders, getValue, days = 7) => {
  const times = orders
    .map((o) => new Date(o.date).getTime())
    .filter((t) => !isNaN(t));
  if (!times.length) return null;

  const end = Math.max(...times);
  const curStart = end - days * DAY_MS;
  const prevStart = curStart - days * DAY_MS;

  let cur = 0;
  let prev = 0;
  orders.forEach((o) => {
    const t = new Date(o.date).getTime();
    if (isNaN(t)) return;
    const v = getValue(o) || 0;
    if (t > curStart && t <= end) cur += v;
    else if (t > prevStart && t <= curStart) prev += v;
  });

  if (cur === 0 && prev === 0) return null;
  return {
    cur,
    prev,
    diff: cur - prev,
    pct: prev > 0 ? ((cur - prev) / prev) * 100 : null,
  };
};

// ── Trend antar season: season ini vs season sebelumnya ──
export const calcSeasonTrend = (cur, prev) => {
  if (cur === undefined || cur === null) return null;
  if (prev === undefined || prev === null) return null;
  if (cur === 0 && prev === 0) return null;
  return {
    cur,
    prev,
    diff: cur - prev,
    pct: prev > 0 ? ((cur - prev) / prev) * 100 : null,
  };
};