import { useEffect, useMemo, useRef, useState } from "react";
import { useDataPageColors } from "../../constants/dataPage.constants";
import Empty from "./Empty";
import { fmtK } from "./analytics.utils";

const PAD = { l: 46, r: 16, t: 34, b: 30 };
// lebar minimal per titik data; kalau total lebih besar dari layar -> scroll horizontal
const MIN_STEP = 26;

const TrendChart = ({ data, color, fmt = fmtK, height = 320, win = 2 }) => {
  const C = useDataPageColors();
  const wrapRef = useRef(null);
  const scrollRef = useRef(null);
  const [wrapW, setWrapW] = useState(600);
  const [hover, setHover] = useState(null);
  const [grabbing, setGrabbing] = useState(false);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  // klik-tahan + geser dengan mouse untuk menggeser grafik
  // (di HP geser jari tetap pakai scroll bawaan browser)
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
    };
    el.setPointerCapture?.(e.pointerId);
    setGrabbing(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const el = scrollRef.current;
    if (el) el.scrollLeft = d.startLeft - (e.clientX - d.startX);
  };
  const endDrag = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    scrollRef.current?.releasePointerCapture?.(e.pointerId);
    setGrabbing(false);
  };

  // ukur lebar container asli (bukan lebar chart)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setWrapW(Math.max(e.contentRect.width, 240)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // lebar chart: minimal selebar container, melebar kalau datanya banyak
  const w = Math.max(wrapW, PAD.l + PAD.r + data.length * MIN_STEP);

  const calc = useMemo(() => {
    const n = data.length;
    if (!n) return null;
    const innerW = w - PAD.l - PAD.r;
    const innerH = height - PAD.t - PAD.b;
    const max = Math.max(...data.map((d) => d.value), 1);
    const pts = data.map((d, i) => ({
      ...d,
      x: n > 1 ? PAD.l + (i * innerW) / (n - 1) : PAD.l + innerW / 2,
      y: PAD.t + (1 - d.value / max) * innerH,
    }));

    // puncak (▼ merah) & lembah (▲ hijau)
    const marks = [];
    const thr = max * 0.15;
    for (let i = 1; i < n - 1; i++) {
      const slice = data
        .slice(Math.max(0, i - win), Math.min(n, i + win + 1))
        .map((d) => d.value);
      const mx = Math.max(...slice);
      const mn = Math.min(...slice);
      const v = data[i].value;
      if (mx - mn < thr) continue;
      let type = null;
      if (v === mx && v >= max * 0.25) type = "peak";
      else if (v === mn) type = "trough";
      if (!type) continue;
      const last = marks[marks.length - 1];
      if (last && last.type === type && i - last.i <= win) continue;
      marks.push({ i, type });
    }
    return { n, innerW, innerH, max, pts, marks };
  }, [data, w, height, win]);

  // buka di ujung kanan (data terbaru) saat chart lebih lebar dari layar
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [data, w]);

  const baseY = height - PAD.b;

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      {!calc ? (
        <Empty />
      ) : (
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            cursor: grabbing ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <div style={{ position: "relative", width: w }}>
            <svg
              width={w}
              height={height}
              style={{ display: "block" }}
              onMouseLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* grid + label Y */}
              {[0, 1, 2, 3, 4].map((t) => {
                const y = PAD.t + (1 - t / 4) * calc.innerH;
                return (
                  <g key={t}>
                    <line
                      x1={PAD.l}
                      x2={w - PAD.r}
                      y1={y}
                      y2={y}
                      stroke={C.border}
                      strokeWidth="1"
                      strokeDasharray={t === 0 ? "0" : "3 4"}
                      opacity={t === 0 ? 0.8 : 0.45}
                    />
                    <text
                      x={PAD.l - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fontFamily="monospace"
                      fill={C.muted}
                    >
                      {fmt((calc.max * t) / 4)}
                    </text>
                  </g>
                );
              })}

              {/* area + garis */}
              {calc.n > 1 && (
                <>
                  <path
                    d={`M${calc.pts.map((p) => `${p.x},${p.y}`).join(" L")} L${calc.pts[calc.n - 1].x},${baseY} L${calc.pts[0].x},${baseY} Z`}
                    fill="url(#trendFill)"
                  />
                  <path
                    d={`M${calc.pts.map((p) => `${p.x},${p.y}`).join(" L")}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* label X */}
              {calc.pts.map((p, i) => {
                const every = Math.ceil(
                  calc.n / Math.max(Math.floor(calc.innerW / 64), 1),
                );
                if (i % every !== 0 && i !== calc.n - 1) return null;
                return (
                  <text
                    key={i}
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill={C.muted}
                  >
                    {p.label}
                  </text>
                );
              })}

              {/* marker puncak / lembah */}
              {calc.marks.map(({ i, type }) => {
                const p = calc.pts[i];
                return type === "peak" ? (
                  <path
                    key={`m${i}`}
                    d={`M${p.x - 6},${p.y - 20} L${p.x + 6},${p.y - 20} L${p.x},${p.y - 9} Z`}
                    fill={C.magenta}
                  />
                ) : (
                  <path
                    key={`m${i}`}
                    d={`M${p.x - 6},${p.y + 20} L${p.x + 6},${p.y + 20} L${p.x},${p.y + 9} Z`}
                    fill={C.green}
                  />
                );
              })}

              {/* titik hover */}
              {hover !== null && (
                <>
                  <line
                    x1={calc.pts[hover].x}
                    x2={calc.pts[hover].x}
                    y1={PAD.t}
                    y2={baseY}
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <circle
                    cx={calc.pts[hover].x}
                    cy={calc.pts[hover].y}
                    r="4"
                    fill={color}
                    stroke={C.panel2}
                    strokeWidth="2"
                  />
                </>
              )}

              {/* area tangkap mouse */}
              {calc.pts.map((p, i) => {
                const half = calc.n > 1 ? calc.innerW / (calc.n - 1) / 2 : 20;
                return (
                  <rect
                    key={`h${i}`}
                    x={p.x - half}
                    y={PAD.t}
                    width={half * 2}
                    height={calc.innerH}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onTouchStart={() => setHover(i)}
                  />
                );
              })}
            </svg>

            {hover !== null && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: Math.min(Math.max(calc.pts[hover].x, 60), w - 60),
                  transform: "translateX(-50%)",
                  background: C.panel2,
                  border: `1px solid ${color}`,
                  padding: "3px 9px",
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: C.text,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {calc.pts[hover].fullLabel} · {fmt(calc.pts[hover].value)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;