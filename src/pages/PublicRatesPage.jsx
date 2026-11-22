import { useState, useEffect } from "react";
import CornerGlow from "../components/ui/CornerGlow";
import CircuitBg from "../components//ui/CircuitBg";
import ThemeToggle from "../components/ui/sidebar/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { getPublicRates } from "../services/seasonService";
import { getPublicSite } from "../services/siteService";
import { Skeleton as Skel } from "../components/ui/Skeleton";

const formatRupiah = (n) =>
  n && n > 0 ? `Rp${n.toLocaleString("id-ID")}` : "Belum tersedia";

// Default; nomor sebenarnya diatur owner dari dashboard (Halaman Harga).
const WA_NUMBER = "62895385134865";

// Teks default bila pengaturan dari server belum bisa dimuat.
const DEFAULT_ANNOUNCEMENT =
  "Harga yang tertera di poster toko adalah harga awal. Promo akhir season order 10+2 berlaku kelipaatan.";

const buildWaLink = (message, number = WA_NUMBER) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

const TIER_ICONS = {
  GRANDMASTER: "/assets/grandmaster.png",
  EPIC: "/assets/epig.png",
  LEGEND: "/assets/legend.png",
  MAWI: "/assets/mawi.png",
  HONOR: "/assets/honor.png",
  GLORY: "/assets/glory.png",
  IMO: "/assets/immortal.png",
};

const TIER_BONUS_COLOR = {
  EPIC: "#4ADE80", // hijau
  LEGEND: "#FACC15", // kuning/emas
  MAWI: "#C0C0C0", // silver
  HONOR: "#22D3EE", // cyan
  GLORY: "#FB923C", // oranye
  IMO: "#A78BFA", // ungu
};

// Alias nama tier dari DB -> nama tier yang dipakai di tabel & tampilan.
const TIER_ALIAS = {
  GM: "GRANDMASTER",
};

const normalizeTier = (tier) => {
  const up = tier.toUpperCase();
  return TIER_ALIAS[up] || up;
};

const getTierIcon = (tier) =>
  TIER_ICONS[normalizeTier(tier)] ||
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

/*
 * ── Tombol order promo, satu tombol per promo ──
 * Ditempatkan di kolom "Joki Rank" atau "Joki Gendong" sesuai layanan
 * promonya (lihat grid 1fr 1fr 1fr di bawah, kolom pertama dikosongkan).
 */
const PromoOrderButton = ({
  message,
  price,
  label,
  accentColor,
  cardBg,
  waNumber,
}) => (
  <a
    href={buildWaLink(message, waNumber)}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      justifySelf: "end",
      width: "fit-content",
      maxWidth: "100%",
      gap: "0.3rem",
      textDecoration: "none",
      background: `radial-gradient(ellipse at 70% 15%, ${accentColor}22 0%, ${cardBg}00 60%), ${cardBg}`,
      border: `1px solid ${accentColor}55`,
      borderRadius: "8px",
      padding: "0.4rem 0.55rem",
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
    <WaIcon color={accentColor} size={11} />
    <span
      style={{
        fontSize: "clamp(0.5rem, 2.1vw, 0.62rem)",
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
      {label} {formatRupiah(price)}
    </span>
  </a>
);

/* ── Animasi & skeleton (keyframes global untuk halaman ini) ── */
const PUBLIC_CSS = `
@keyframes jcRise { from { opacity: 0; transform: translateY(22px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes jcFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes jcPulse { 0%, 100% { box-shadow: 0 0 10px var(--c); } 50% { box-shadow: 0 0 26px var(--c); } }
@keyframes jcShine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.jc-spender { animation: jcRise 0.7s cubic-bezier(.2,.8,.2,1) both; transition: transform .25s ease, box-shadow .25s ease; }
.jc-spender:hover { transform: translateY(-4px); }
.jc-first { animation: jcRise 0.7s cubic-bezier(.2,.8,.2,1) both, jcPulse 2.8s ease-in-out 0.9s infinite; }
.jc-avatar-first { animation: jcFloat 3s ease-in-out infinite; }
.jc-rank {
  background: linear-gradient(90deg, var(--c) 0%, #fff 50%, var(--c) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: jcShine 3s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .jc-spender, .jc-first, .jc-avatar-first, .jc-rank { animation: none !important; }
}
`;

/* ── Icon tier: skeleton sampai gambar selesai dimuat ── */
const TierIcon = ({ src, alt }) => {
  const [ready, setReady] = useState(false);
  return (
    <span
      style={{
        position: "relative",
        width: 32,
        height: 32,
        flexShrink: 0,
        display: "inline-block",
      }}
    >
      {!ready && (
        <Skel w={32} h={32} r={6} style={{ position: "absolute", inset: 0 }} />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
        style={{
          width: 32,
          height: 32,
          borderRadius: "6px",
          objectFit: "cover",
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </span>
  );
};

/* ── Top Spender: link sosmed (handle @user juga diterima) ── */
const SOCIAL_BASE = {
  tiktok: "https://www.tiktok.com/@",
  instagram: "https://www.instagram.com/",
};
const socialHref = (platform, url) => {
  if (/^https?:\/\//i.test(url)) return url;
  const base = SOCIAL_BASE[String(platform).toLowerCase()];
  const handle = url.replace(/^@/, "");
  return base ? `${base}${handle}` : `https://${url}`;
};

const PODIUM_COLORS = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };

const SpenderCard = ({ s, cardBg, textPrimary, textMuted }) => {
  const color = PODIUM_COLORS[s.rank] || "#888";
  const first = s.rank === 1;
  const size = first ? 76 : 60;
  const [avatarReady, setAvatarReady] = useState(!s.avatar);
  useEffect(() => {
    if (!s.avatar) return undefined;
    let active = true;
    const img = new Image();
    img.onload = img.onerror = () => {
      if (active) setAvatarReady(true);
    };
    img.src = s.avatar;
    return () => {
      active = false;
    };
  }, [s.avatar]);
  return (
    <div
      className={first ? "jc-spender jc-first" : "jc-spender"}
      style={{
        "--c": color,
        animationDelay: `${s.rank === 1 ? 0.25 : s.rank === 2 ? 0.1 : 0.4}s`,
        flex: "1 1 0",
        minWidth: 0,
        order: s.rank === 1 ? 2 : s.rank === 2 ? 1 : 3,
        alignSelf: "flex-end",
        textAlign: "center",
        background: `radial-gradient(ellipse at 50% 0%, ${color}22 0%, ${cardBg}00 65%), ${cardBg}`,
        border: `1px solid ${color}66`,
        borderRadius: "10px",
        padding: first ? "1.1rem 0.5rem 1rem" : "0.8rem 0.4rem 0.8rem",
      }}
    >
      <div
        className={first ? "jc-rank" : undefined}
        style={{
          fontSize: "0.7rem",
          fontWeight: 900,
          color,
          letterSpacing: "1px",
          marginBottom: "0.5rem",
        }}
      >
        TOP {s.rank}
      </div>
      {!avatarReady ? (
        <Skel w={size} h={size} r={999} style={{ margin: "0 auto 0.5rem" }} />
      ) : (
      <div
        className={first ? "jc-avatar-first" : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          margin: "0 auto 0.5rem",
          border: `2px solid ${color}`,
          background: s.avatar ? `url(${s.avatar}) center/cover` : `${color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: first ? "1.6rem" : "1.2rem",
          color,
        }}
      >
        {!s.avatar && s.name.charAt(0).toUpperCase()}
      </div>
      )}
      <div
        style={{
          fontWeight: 800,
          fontSize: "clamp(0.65rem, 3vw, 0.85rem)",
          color: textPrimary,
          textTransform: "uppercase",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          padding: "0 0.25rem",
        }}
      >
        {s.name}
      </div>
      {s.total != null && (
        <div
          style={{
            fontWeight: 800,
            fontSize: "clamp(0.6rem, 2.8vw, 0.78rem)",
            color,
            marginTop: "0.2rem",
          }}
        >
          {formatRupiah(s.total)}
        </div>
      )}
      {s.socials?.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.3rem",
            marginTop: "0.55rem",
          }}
        >
          {s.socials.map((soc) => (
            <a
              key={`${soc.platform}-${soc.url}`}
              href={socialHref(soc.platform, soc.url)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.55rem",
                fontWeight: 800,
                color: textMuted,
                textDecoration: "none",
                border: `1px solid ${color}55`,
                borderRadius: "999px",
                padding: "2px 7px",
                textTransform: "uppercase",
              }}
            >
              {soc.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const PublicRatesPage = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Data harga murni dari API.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Teks, nomor WA & Top Spender dari CMS (diatur owner di dashboard).
  const [site, setSite] = useState(null);
  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicSite()
      .then((res) => {
        if (active && res?.data) setSite(res.data);
      })
      .catch(() => {
        // gagal muat CMS: pakai teks & nomor default
      })
      .finally(() => {
        if (active) setSiteLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getPublicRates()
      .then((res) => {
        const payload = res?.data;
        if (
          active &&
          payload &&
          Array.isArray(payload.rates) &&
          payload.rates.length > 0
        ) {
          setData(payload);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const waNumber = site?.waNumber || WA_NUMBER;
  const topSpenders = site?.spenders || [];

  const bg = isLight ? "#FFF7F0" : "#0D0D0D";
  const textPrimary = isLight ? "#1a1a1a" : "#E8E8E8";
  const textMuted = isLight ? "#8a7a6a" : "#888";
  const accent = isLight ? "#B8860B" : "#FFE600";
  const cardBg = isLight ? "#ffffff" : "#141414";
  const border = isLight ? "#e5d9c8" : "#2a2a2a";
  const cyan = isLight ? "#0089A0" : "#00E5FF";
  const magenta = isLight ? "#287A74" : "#CCFBFA";

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
      <style>{PUBLIC_CSS}</style>
      <CircuitBg />
      <CornerGlow />

      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 10,
        }}
      ></div>

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
          ></div>
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
            {siteLoading ? (
              <span style={{ display: "block" }}>
                <Skel h={11} style={{ margin: "0 auto 8px" }} />
                <Skel h={11} w="75%" style={{ margin: "0 auto" }} />
              </span>
            ) : (
              <span style={{ whiteSpace: "pre-line" }}>
                {site?.announcementText || DEFAULT_ANNOUNCEMENT}
              </span>
            )}
            <br />
            <br />
            <strong>
              Harga di update{" "}
              {data?.updatedAt
                ? new Date(data.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })
                : "20 Oktober"}
            </strong>
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "0.9rem 1rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Skel w={32} h={32} r={6} style={{ flexShrink: 0 }} />
                  <Skel w="60%" h={12} />
                </div>
                <Skel w="70%" h={14} style={{ marginLeft: "auto" }} />
                <Skel w="70%" h={14} style={{ marginLeft: "auto" }} />
              </div>
            ))}
          </div>
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
                color: textPrimary,
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: textPrimary }}>Tier</span>
              <span style={{ textAlign: "right", color: cyan }}>Joki Rank</span>
              <span style={{ textAlign: "right", color: magenta }}>
                Joki Gendong
              </span>
            </div>

            {data.rates.map((r) => {
              const tierUpper = normalizeTier(r.tier);
              const tierLower = tierUpper.toLowerCase();
              const promos = (r.promos || []).filter(
                (p) => p.buyQty > 0 && p.bonusQty > 0,
              );
              // promo dipisah per layanan; promo lama tanpa "service" = joki rank
              const promosJoki = promos.filter(
                (p) => (p.service || "joki") === "joki",
              );
              const promosJokgen = promos.filter((p) => p.service === "jokgen");
              const btnColor = TIER_BONUS_COLOR[tierUpper] || accent;

              return (
                <div
                  key={r.tier}
                  style={{
                    background: cardBg,
                    border: `1px solid ${border}`,
                    borderRadius: "10px",
                    padding: "0.9rem 1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
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
                        <TierIcon src={getTierIcon(r.tier)} alt={tierUpper} />
                        {tierUpper}
                      </span>
                    </div>
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

                  {promos.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "0.75rem",
                        marginTop: "0.6rem",
                      }}
                    >
                      {/* spacer, sejajar dengan kolom Tier */}
                      <div />

                      {/* promo Joki Rank, sejajar dengan kolom Joki Rank */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.4rem",
                        }}
                      >
                        {promosJoki.map((p, idx) => {
                          const price =
                            p.price > 0
                              ? p.price
                              : r.rate_store_joki * p.buyQty;
                          return price > 0 ? (
                            <PromoOrderButton
                              key={`joki-${idx}-${p.buyQty}-${p.bonusQty}`}
                              message={`mau joko ${tierLower} ${p.buyQty}+${p.bonusQty} dong`}
                              label={`${p.buyQty}+${p.bonusQty}`}
                              price={price}
                              accentColor={btnColor}
                              cardBg={cardBg}
                              waNumber={waNumber}
                            />
                          ) : null;
                        })}
                      </div>

                      {/* promo Joki Gendong, sejajar dengan kolom Joki Gendong */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.4rem",
                        }}
                      >
                        {promosJokgen.map((p, idx) => {
                          const price =
                            p.price > 0
                              ? p.price
                              : r.rate_store_jokgen * p.buyQty;
                          return price > 0 ? (
                            <PromoOrderButton
                              key={`jokgen-${idx}-${p.buyQty}-${p.bonusQty}`}
                              message={`mau jokgen ${tierLower} ${p.buyQty}+${p.bonusQty}`}
                              label={`${p.buyQty}+${p.bonusQty}`}
                              price={price}
                              accentColor={btnColor}
                              cardBg={cardBg}
                              waNumber={waNumber}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(siteLoading || topSpenders.length > 0) && (
          <div style={{ marginTop: "2rem" }}>
            <h2
              style={{
                textAlign: "center",
                fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
                fontWeight: 900,
                letterSpacing: "2px",
                color: accent,
                textTransform: "uppercase",
                margin: "0 0 1rem",
              }}
            >
              {siteLoading ? (
                <Skel w="40%" h={16} style={{ margin: "0 auto" }} />
              ) : (
                site?.spenderTitle || "TOP SPENDER"
              )}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
              {siteLoading &&
                [2, 1, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      flex: "1 1 0",
                      minWidth: 0,
                      background: cardBg,
                      border: `1px solid ${border}`,
                      borderRadius: "10px",
                      padding: n === 1 ? "1.1rem 0.5rem 1rem" : "0.8rem 0.4rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Skel w="40%" h={10} />
                    <Skel w={n === 1 ? 76 : 60} h={n === 1 ? 76 : 60} r={999} />
                    <Skel w="70%" h={12} />
                    <Skel w="50%" h={10} />
                  </div>
                ))}
              {topSpenders.map((sp) => (
                <SpenderCard
                  key={sp.rank}
                  s={sp}
                  cardBg={cardBg}
                  textPrimary={textPrimary}
                  textMuted={textMuted}
                />
              ))}
            </div>
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
            href={buildWaLink("mau joko rank dong", waNumber)}
            label="JOKI RANK"
            accentColor={cyan}
            cardBg={cardBg}
            textMuted={textMuted}
          />

          <WaOrderCard
            href={buildWaLink("mau jokgen dong", waNumber)}
            label="JOKI GENDONG"
            accentColor={magenta}
            cardBg={cardBg}
            textMuted={textMuted}
          />

          <WaOrderCard
            href={buildWaLink("mau joko rising star dong", waNumber)}
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