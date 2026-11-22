import { useState, useEffect } from "react";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import { useWorkersColors, glow } from "../components/DataPages/workers.utils";
import { useTheme } from "../context/ThemeContext";
import { getSiteSettings, updateSiteSettings } from "../services/siteService";
import { Skeleton } from "../components/ui/Skeleton";

const mono = { fontFamily: "'Courier New', monospace" };

const SiteSettingsPage = () => {
  const C = useWorkersColors();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    announcementText: "",
    waNumber: "",
    spenderTitle: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    getSiteSettings()
      .then((res) =>
        setForm({
          announcementText: res.data.announcementText || "",
          waNumber: res.data.waNumber || "",
          spenderTitle: res.data.spenderTitle || "",
        }),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await updateSiteSettings(form);
      setForm({
        announcementText: res.data.announcementText,
        waNumber: res.data.waNumber,
        spenderTitle: res.data.spenderTitle,
      });
      setFlash("Pengaturan tersimpan. Halaman harga langsung ikut berubah.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const label = {
    ...mono,
    display: "block",
    fontSize: "0.62rem",
    fontWeight: 900,
    letterSpacing: "2px",
    color: C.muted,
    marginBottom: "6px",
    textTransform: "uppercase",
  };
  const input = {
    ...mono,
    width: "100%",
    boxSizing: "border-box",
    background: C.trackBg,
    color: C.text,
    border: `1px solid ${C.border}`,
    padding: "0.6rem 0.75rem",
    fontSize: "0.8rem",
    outline: "none",
  };
  const hint = { ...mono, fontSize: "0.62rem", color: C.muted, marginTop: "5px" };

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
      <CircuitBg />
      <CornerGlow />

      <div style={{ marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            ...mono,
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "4px",
            color: C.muted,
            marginBottom: "4px",
          }}
        >
          OWNER ONLY
        </div>
        <h1
          style={{
            ...mono,
            fontSize: "clamp(2rem, 8vw, 4rem)",
            fontWeight: 900,
            color: C.yellow,
            margin: 0,
            letterSpacing: "-2px",
            textTransform: "uppercase",
            lineHeight: 0.9,
            textShadow: glow(theme, `0 0 40px ${C.yellow}60`),
          }}
        >
          Halaman Harga
        </h1>
        <div
          style={{
            width: "40px",
            height: "2px",
            background: C.yellow,
            marginTop: "10px",
            boxShadow: glow(theme, `0 0 10px ${C.yellow}`),
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "640px",
          border: `1px solid ${C.border}`,
          background: C.panel,
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
        }}
      >
        {loading ? (
          <div style={{ display: "grid", gap: "1.1rem" }}>
            <Skeleton h={110} />
            <Skeleton h={36} />
            <Skeleton h={36} />
          </div>
        ) : (
          <>
            <div>
              <label style={label}>Teks pengumuman</label>
              <textarea
                value={form.announcementText}
                onChange={set("announcementText")}
                rows={5}
                maxLength={500}
                style={{ ...input, resize: "vertical", lineHeight: 1.5 }}
              />
              <div style={hint}>
                Tampil di atas daftar harga. Enter = baris baru. (
                {form.announcementText.length}/500)
              </div>
            </div>

            <div>
              <label style={label}>Nomor WhatsApp order</label>
              <input
                value={form.waNumber}
                onChange={set("waNumber")}
                placeholder="62895385134865"
                style={input}
              />
              <div style={hint}>
                Format 62xxxxxxxxxx (tanpa + atau spasi). Dipakai semua tombol order.
              </div>
            </div>

            <div>
              <label style={label}>Judul section spender</label>
              <input
                value={form.spenderTitle}
                onChange={set("spenderTitle")}
                maxLength={60}
                style={input}
              />
            </div>

            {error && (
              <div style={{ ...mono, fontSize: "0.72rem", color: "#ff6b6b" }}>{error}</div>
            )}
            {flash && (
              <div style={{ ...mono, fontSize: "0.72rem", color: C.green }}>{flash}</div>
            )}

            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  ...mono,
                  background: "transparent",
                  border: `1px solid ${C.yellow}`,
                  color: C.yellow,
                  padding: "0.55rem 1.4rem",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "MENYIMPAN..." : "SIMPAN"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteSettingsPage;