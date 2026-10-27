import { useState, useEffect } from "react";
import CornerGlow from "../components/ui/CornerGlow";
import CircuitBg from "../components//ui/CircuitBg";
import ThemeToggle from "../components/ui/sidebar/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { getPublicRates } from "../services/seasonService";

// // Harga Joki Statis
// const STATIC_RATES = {
//   seasonName: "PRICE LIST S41",
//   rates: [
//     { tier: "GRANDMASTER", rate_store_joki: 5000, rate_store_jokgen: 6000 },
//     { tier: "EPIC", rate_store_joki: 7000, rate_store_jokgen: 8000 },
//     { tier: "LEGEND", rate_store_joki: 9000, rate_store_jokgen: 10000 },
//     { tier: "MAWI", rate_store_joki: 16000, rate_store_jokgen: 18000 },
//     { tier: "HONOR", rate_store_joki: 18000, rate_store_jokgen: 20000 },
//     { tier: "GLORY", rate_store_joki: 23000, rate_store_jokgen: 25000 },
//     { tier: "IMO", rate_store_joki: 27000, rate_store_jokgen: 32000 },
//   ],
// };

const formatRupiah = (n) =>
  n && n > 0 ? `Rp${n.toLocaleString("id-ID")}` : "Belum tersedia";

const WA_NUMBER = "62895385134865";

const buildWaLink = (message) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

const TIER_ICONS = {
  GRANDMASTER: "/assets/grandmaster.png",
  EPIC: "/assets/epig.png",
  LEGEND: "/assets/legend.png",
  MAWI: "/assets/mawi.png",
  HONOR: "/assets/honor.png",
  GLORY: "/assets/glory.png",
  IMO: "/assets/immortal.png",
};

const TIER_BONUS = {
  GRANDMASTER: "Order 10+1 bonus ⭐",
  EPIC: "Order 10+1 bonus ⭐",
  LEGEND: "Order 10+1 bonus ⭐",
  MAWI: "Order 10+1 bonus ⭐",
  HONOR: "Order 10+1 bonus ⭐",
  GLORY: "Order 10+1 bonus ⭐",
  IMO: "Order 10+1 bonus ⭐",
};

const TIER_BONUS_COLOR = {
  EPIC: "#4ADE80", // hijau
  LEGEND: "#FACC15", // kuning/emas
  MAWI: "#C0C0C0", // silver
  HONOR: "#22D3EE", // cyan
  GLORY: "#FB923C", // oranye
  IMO: "#A78BFA", // ungu
};

/*
 * (Tidak dipakai lagi) Harga promo kini diatur dari halaman Rate Config
 * dan dikirim lewat API (r.promos). Tabel ini dibiarkan agar tidak
 * mengubah struktur file.
 */
const TIER_PROMO_PRICE = {
  GRANDMASTER: { joki: 50000, jokgen: 60000 },
  EPIC: { joki: 70000, jokgen: 80000 },
  LEGEND: { joki: 90000, jokgen: 100000 },
  MAWI: { joki: 160000, jokgen: 180000 },
  HONOR: { joki: 180000, jokgen: 200000 },
  GLORY: { joki: 230000, jokgen: 250000 },
  IMO: { joki: 270000, jokgen: 320000 },
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
const PromoOrderButton = ({ message, price, label, accentColor, cardBg }) => (
  <a
    href={buildWaLink(message)}
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

const PublicRatesPage = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Data harga murni dari API.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            Harga yang tertera di poster toko adalah harga awal. Promo mid
            season order 10+2. Joki 10+2 Jokgen 10+1
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
          <p
            style={{
              textAlign: "center",
              color: isLight ? "#0891b2" : "#00E5FF",
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
                        <img
                          src={getTierIcon(r.tier)}
                          alt={tierUpper}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "6px",
                            flexShrink: 0,
                            objectFit: "cover",
                          }}
                        />
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
