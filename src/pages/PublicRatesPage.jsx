import { useState, useEffect } from "react";
import CornerGlow from "../components/ui/CornerGlow";
import CircuitBg from "../components//ui/CircuitBg";
import ThemeToggle from "../components/ui/sidebar/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { getPublicRates } from "../services/seasonService";

const CACHE_KEY = "jokicalm_public_rates_cache";

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // abaikan
  }
};

const formatRupiah = (n) =>
  n && n > 0 ? `Rp${n.toLocaleString("id-ID")}` : "Belum tersedia";

const WA_NUMBER = "62895385134865";

const buildWaLink = (message) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
const TIER_ICONS = {
  EPIC: "/assets/epig.png",
  LEGEND: "/assets/legend.png",
  MAWI: "/assets/mawi.png",
  HONOR: "/assets/honor.png",
  GLORY: "/assets/glory.png",
  IMO: "/assets/immortal.png",
};

const getTierIcon = (tier) =>
  TIER_ICONS[tier.toUpperCase()] ||
  `https://placehold.co/32x32/1a1a1a/FFE600?text=${tier.charAt(0)}`;

const WaIcon = ({ color = "#fff", size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ flexShrink: 0 }}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.92 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm5.8 14.09c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.63-.14.26.09 1.66.79 1.94.93.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
  </svg>
);

/* ── Slim terminal-style order CTA, tetap horizontal di mobile ── */
const WaOrderCard = ({ href, label, accentColor, cardBg, textMuted }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.35rem",
      flex: "1 1 0",
      minWidth: 0,
      textDecoration: "none",
      background: `radial-gradient(ellipse at 70% 15%, ${accentColor}22 0%, ${cardBg}00 60%), ${cardBg}`,
      border: `1px solid ${accentColor}55`,
      borderRadius: "8px",
      padding: "0.55rem 0.4rem",
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `0 0 14px ${accentColor}35`;
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = `${accentColor}55`;
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <WaIcon color={accentColor} size={13} />
    <span
      style={{
        fontSize: "clamp(0.55rem, 2.4vw, 0.7rem)",
        fontWeight: 800,
        color: accentColor,
        fontFamily: "'Courier New', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.2px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </span>
  </a>
);

const PublicRatesPage = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [data, setData] = useState(() => readCache());
  const [loading, setLoading] = useState(!readCache());
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicRates()
      .then((res) => {
        setData(res.data);
        writeCache(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const bg = isLight ? "#FFF7F0" : "#0D0D0D";
  const textPrimary = isLight ? "#1a1a1a" : "#E8E8E8";
  const textMuted = isLight ? "#8a7a6a" : "#888";
  const accent = isLight ? "#B8860B" : "#FFE600";
  const cardBg = isLight ? "#ffffff" : "#141414";
  const border = isLight ? "#e5d9c8" : "#2a2a2a";
  const cyan = isLight ? "#0089A0" : "#00E5FF";
  const magenta = isLight ? "#CC2E89" : "#FF3CAC";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: bg,
        fontFamily: "'Courier New', Courier, monospace",
        overflow: "hidden",
      }}
    >
      <CircuitBg />
      <CornerGlow />

      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 10,
        }}
      >
        <ThemeToggle iconOnly />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "760px",
          margin: "0 auto",
          padding: "3rem 1.5rem 4rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "4px",
              color: textMuted,
              marginBottom: "6px",
            }}
          >
            // DAFTAR HARGA
          </div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 7vw, 2.25rem)",
              fontWeight: 900,
              color: textPrimary,
              margin: 0,
              letterSpacing: "-1px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {data?.seasonName || "Rate Joki"}
          </h1>
          <p
            style={{
              textAlign: "center",
              color: isLight ? "#0891b2" : "#00E5FF",
              fontSize: "clamp(0.7rem, 3.2vw, 0.8rem)",
              lineHeight: 1.6,
              maxWidth: "520px",
              margin: "1.25rem auto 2rem",
            }}
          >
            Harga yang tertera di poster toko adalah harga awal season. Harga
            berubah seiring berjalannya season. Awal season blm ada bonus ⭐ mid
            season baru ada.
            <br />
            <br />
            Coba chat aja dulu, kalo mood atmin lagi bagus bisa dapet promno :v
            #ronaldoPulang
          </p>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: accent,
              margin: "12px auto 0",
              boxShadow: `0 0 8px ${accent}`,
            }}
          />
        </div>

        {loading && !data && (
          <p
            style={{
              textAlign: "center",
              color: textMuted,
              fontSize: "0.85rem",
            }}
          >
            Memuat harga...
          </p>
        )}

        {error && !data && (
          <p
            style={{
              textAlign: "center",
              color: "#ff6b6b",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </p>
        )}

        {data && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.75rem",
                padding: "0 0.25rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: textMuted,
                textTransform: "uppercase",
              }}
            >
              <span>Tier</span>
              <span style={{ textAlign: "right" }}>Joki Rank</span>
              <span style={{ textAlign: "right" }}>Joki Gendong</span>
            </div>

            {data.rates.map((r) => (
              <div
                key={r.tier}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "0.9rem 1rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontWeight: 700,
                    fontSize: "clamp(0.7rem, 3.5vw, 0.9rem)",
                    color: textPrimary,
                    textTransform: "uppercase",
                  }}
                >
                  <img
                    src={getTierIcon(r.tier)}
                    alt={r.tier}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      flexShrink: 0,
                      objectFit: "cover",
                    }}
                  />
                  {r.tier}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    color: r.rate_store_joki > 0 ? accent : textMuted,
                    fontWeight: 700,
                    fontSize:
                      r.rate_store_joki > 0
                        ? "clamp(0.8rem, 4vw, 1rem)"
                        : "clamp(0.65rem, 3vw, 0.75rem)",
                  }}
                >
                  {formatRupiah(r.rate_store_joki)}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    color: r.rate_store_jokgen > 0 ? accent : textMuted,
                    fontWeight: 700,
                    fontSize: r.rate_store_jokgen > 0 ? "1rem" : "0.75rem",
                  }}
                >
                  {formatRupiah(r.rate_store_jokgen)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          <WaOrderCard
            href={buildWaLink("mau joko rank dong")}
            label="JOKI RANK"
            accentColor={cyan}
            cardBg={cardBg}
            textMuted={textMuted}
          />

          <WaOrderCard
            href={buildWaLink("mau jokgen dong")}
            label="JOKI GENDONG"
            accentColor={magenta}
            cardBg={cardBg}
            textMuted={textMuted}
          />

          <WaOrderCard
            href={buildWaLink("mau joko rising star dong")}
            label="RISING STAR"
            accentColor={accent}
            cardBg={cardBg}
            textMuted={textMuted}
          />
        </div>

        <p
          style={{
            textAlign: "center",
            color: textMuted,
            fontSize: "0.7rem",
            marginTop: "1rem",
          }}
        >
          Harga per bintang/rank. Hubungi admin untuk pemesanan.
        </p>
      </div>
    </div>
  );
};

export default PublicRatesPage;
