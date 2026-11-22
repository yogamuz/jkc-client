import { useState, useEffect, useCallback, useRef } from "react";
import { Trash2, Plus, Camera, X } from "lucide-react";
import { centerCrop, makeAspectCrop } from "react-image-crop";
import CropAvatarModal from "../components/ui/sidebar/CropAvatarModal";
import { Skeleton as Skel } from "../components/ui/Skeleton";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useWorkersColors, glow } from "../components/DataPages/workers.utils";
import { useTheme } from "../context/ThemeContext";
import {
  getSpenders,
  getSpenderSuggestions,
  createSpender,
  updateSpender,
  deleteSpender,
  uploadSpenderAvatar,
} from "../services/siteService";

const mono = { fontFamily: "'Courier New', monospace" };
const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const PAGE_SIZES = [5, 10, 20, 50];

// Dua kartu per baris (satu kolom di layar sempit)
const GRID = {
  display: "grid",
  gap: "0.9rem",
  alignItems: "start",
};

const GRID_CSS = `
.jc-spender-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (max-width: 900px) { .jc-spender-grid { grid-template-columns: minmax(0, 1fr); } }
`;

const SpenderSkeleton = ({ C }) => (
  <div
    style={{
      border: `1px solid ${C.border}`,
      background: C.panel,
      padding: "1rem",
      display: "flex",
      gap: "1rem",
    }}
  >
    <Skel w={72} h={72} r={999} style={{ flexShrink: 0 }} />
    <div style={{ flex: 1, display: "grid", gap: "0.6rem", alignContent: "start" }}>
      <Skel w="55%" h={16} />
      <Skel w="45%" h={22} />
      <Skel h={30} />
      <Skel h={30} />
      <Skel h={30} />
    </div>
  </div>
);

const DEFAULT_SOCIALS = [
  { platform: "TikTok", url: "" },
  { platform: "Instagram", url: "" },
];

const Toggle = ({ on, onChange, label, C }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    style={{
      ...mono,
      background: "transparent",
      border: `1px solid ${on ? C.green : C.muted}`,
      color: on ? C.green : C.muted,
      padding: "3px 10px",
      fontSize: "0.6rem",
      fontWeight: 900,
      letterSpacing: "1px",
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    {label}: {on ? "ON" : "OFF"}
  </button>
);

const SpenderCard = ({ s, rank, C, onSaved, onError, onDelete }) => {
  const [draft, setDraft] = useState({
    name: s.name,
    displayName: s.displayName || "",
    aliases: (s.aliases || []).join(", "),
    socials: s.socials?.length ? s.socials.map((x) => ({ ...x })) : DEFAULT_SOCIALS,
  });
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const input = {
    ...mono,
    background: C.trackBg,
    color: C.text,
    border: `1px solid ${C.border}`,
    padding: "0.4rem 0.55rem",
    fontSize: "0.72rem",
    outline: "none",
    boxSizing: "border-box",
    minWidth: 0,
  };
  const lbl = {
    ...mono,
    fontSize: "0.58rem",
    fontWeight: 900,
    letterSpacing: "1.5px",
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: "4px",
  };

  const run = async (fn, msg) => {
    setBusy(true);
    try {
      await fn();
      onSaved(msg);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(
      () =>
        updateSpender(s.id, {
          name: draft.name,
          displayName: draft.displayName,
          aliases: draft.aliases.split(",").map((a) => a.trim()).filter(Boolean),
          socials: draft.socials,
        }),
      `${draft.displayName || draft.name} disimpan.`,
    );

  const toggle = (key, val) =>
    run(() => updateSpender(s.id, { [key]: val }), `${s.name} diperbarui.`);

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    setCrop(
      centerCrop(
        makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
        width,
        height,
      ),
    );
  };

  const closeCrop = () => {
    setImgSrc("");
    setCompletedCrop(null);
  };

  const cropConfirm = () => {
    if (!completedCrop || !imgRef.current) return;
    run(async () => {
      const img = imgRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const size = 300;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(
        img,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        size,
        size,
      );
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await uploadSpenderAvatar(s.id, file);
      closeCrop();
    }, "Avatar diganti.");
  };

  const setSocial = (i, key, val) =>
    setDraft((d) => ({
      ...d,
      socials: d.socials.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)),
    }));

  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        background: C.panel,
        padding: "1rem",
        opacity: s.isVisible ? 1 : 0.65,
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div
            onClick={() => fileRef.current?.click()}
            title="Ganti avatar"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: `2px solid ${C.yellow}`,
              background: s.avatar ? `url(${s.avatar}) center/cover` : C.trackBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.muted,
            }}
          >
            {!s.avatar && <Camera size={22} />}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={pickFile}
            style={{ display: "none" }}
          />
          {imgSrc && (
            <CropAvatarModal
              imgSrc={imgSrc}
              imgRef={imgRef}
              crop={crop}
              setCrop={setCrop}
              onImageLoad={onImageLoad}
              onComplete={(c) => setCompletedCrop(c)}
              onConfirm={cropConfirm}
              onCancel={closeCrop}
              loading={busy}
            />
          )}
          <div style={{ ...mono, fontSize: "0.6rem", color: C.muted, marginTop: 4 }}>
            #{rank}
          </div>
        </div>

        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ ...mono, fontWeight: 900, color: C.text, fontSize: "1rem" }}>
              {s.displayName || s.name}
              {s.displayName && (
                <span
                  title="Nama di order (hanya terlihat di dashboard)"
                  style={{
                    color: C.muted,
                    opacity: 0.6,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  ({s.name})
                </span>
              )}
            </span>
            <span style={{ ...mono, fontWeight: 900, color: C.yellow, fontSize: "0.95rem" }}>
              {fmtRp(s.total)}{" "}
              <span style={{ color: C.muted, fontSize: "0.62rem", fontWeight: 700 }}>
                · {s.orders} order
              </span>
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.6rem 0" }}>
            <Toggle
              C={C}
              on={s.isVisible}
              label="TAMPIL PUBLIK"
              onChange={(v) => toggle("isVisible", v)}
            />
            <Toggle
              C={C}
              on={s.showAmount}
              label="TAMPIL NOMINAL"
              onChange={(v) => toggle("showAmount", v)}
            />
          </div>

          <div style={{ display: "grid", gap: "0.6rem" }}>
            <div>
              <div style={lbl}>Nama tampil di halaman publik</div>
              <input
                value={draft.displayName}
                onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                placeholder={`kosong = pakai "${draft.name}"`}
                maxLength={40}
                style={{ ...input, width: "100%" }}
              />
            </div>
            <div>
              <div style={lbl}>Nama di order (untuk pencocokan, tidak tampil publik)</div>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                maxLength={40}
                style={{ ...input, width: "100%", opacity: 0.7 }}
              />
            </div>
            <div>
              <div style={lbl}>Alias nama di order (pisah koma)</div>
              <input
                value={draft.aliases}
                onChange={(e) => setDraft({ ...draft, aliases: e.target.value })}
                placeholder="contoh: BUDI, BUDI S, KAK BUDI"
                style={{ ...input, width: "100%" }}
              />
            </div>
            <div>
              <div style={lbl}>Sosmed</div>
              {draft.socials.map((soc, i) => (
                <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <input
                    value={soc.platform}
                    onChange={(e) => setSocial(i, "platform", e.target.value)}
                    placeholder="Platform"
                    style={{ ...input, width: "28%" }}
                  />
                  <input
                    value={soc.url}
                    onChange={(e) => setSocial(i, "url", e.target.value)}
                    placeholder="https://..."
                    style={{ ...input, flex: 1 }}
                  />
                  <button
                    type="button"
                    title="Hapus sosmed"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        socials: d.socials.filter((_, idx) => idx !== i),
                      }))
                    }
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      color: C.muted,
                      cursor: "pointer",
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, socials: [...d.socials, { platform: "", url: "" }] }))
                }
                style={{
                  ...mono,
                  background: "transparent",
                  border: `1px dashed ${C.cyan}`,
                  color: C.cyan,
                  padding: "3px 10px",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                + TAMBAH PLATFORM
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              style={{
                ...mono,
                background: "transparent",
                border: `1px solid ${C.yellow}`,
                color: C.yellow,
                padding: "0.4rem 1.1rem",
                fontSize: "0.65rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              SIMPAN
            </button>
            <button
              type="button"
              onClick={() => onDelete(s)}
              disabled={busy}
              title="Hapus spender"
              style={{
                background: "transparent",
                border: "1px solid #ff6b6b",
                color: "#ff6b6b",
                padding: "0.4rem 0.7rem",
                cursor: "pointer",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpendersPage = () => {
  const C = useWorkersColors();
  const { theme } = useTheme();

  const [list, setList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [perPage, setPerPage] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const fetchAll = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([getSpenders(), getSpenderSuggestions()]);
      setList(a.data);
      setSuggestions(b.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const add = async (n) => {
    const value = (n ?? name).trim();
    if (!value) return;
    setAdding(true);
    setError("");
    try {
      await createSpender({ name: value, socials: DEFAULT_SOCIALS });
      setFlash(`"${value}" ditambahkan.`);
      setName("");
      fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await deleteSpender(confirm.id);
      setFlash(`${confirm.name} dihapus.`);
      setConfirm(null);
      fetchAll();
    } catch (err) {
      setError(err.message);
      setConfirm(null);
    } finally {
      setConfirming(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * perPage;
  const pageItems = list.slice(pageStart, pageStart + perPage);

  const pagerBtn = (disabled) => ({
    ...mono,
    background: "transparent",
    border: `1px solid ${C.border}`,
    color: C.text,
    padding: "3px 10px",
    fontSize: "0.65rem",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

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
      <style>{GRID_CSS}</style>
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
          OWNER ONLY · RANKING SEASON AKTIF
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
          Top Spender
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

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          style={{
            border: `1px solid ${C.border}`,
            background: C.panel,
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Nama customer"
              maxLength={40}
              style={{
                ...mono,
                flex: "1 1 200px",
                background: C.trackBg,
                color: C.text,
                border: `1px solid ${C.border}`,
                padding: "0.5rem 0.7rem",
                fontSize: "0.78rem",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => add()}
              disabled={adding || !name.trim()}
              style={{
                ...mono,
                background: "transparent",
                border: `1px solid ${C.yellow}`,
                color: C.yellow,
                padding: "0.5rem 1rem",
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                opacity: adding || !name.trim() ? 0.5 : 1,
              }}
            >
              <Plus size={13} /> TAMBAH
            </button>
          </div>

          {suggestions.length > 0 && (
            <div style={{ marginTop: "0.8rem" }}>
              <div
                style={{
                  ...mono,
                  fontSize: "0.58rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  color: C.muted,
                  marginBottom: 6,
                }}
              >
                CUSTOMER BELUM PUNYA PROFIL (klik untuk buat)
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {suggestions.slice(0, 12).map((x) => (
                  <button
                    key={x.name}
                    type="button"
                    onClick={() => add(x.name)}
                    style={{
                      ...mono,
                      background: "transparent",
                      border: `1px solid ${C.cyan}`,
                      color: C.cyan,
                      padding: "2px 8px",
                      fontSize: "0.62rem",
                      cursor: "pointer",
                    }}
                  >
                    {x.name} · {fmtRp(x.total)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ ...mono, fontSize: "0.72rem", color: "#ff6b6b", marginBottom: 8 }}>
            {error}
          </div>
        )}
        {flash && (
          <div style={{ ...mono, fontSize: "0.72rem", color: C.green, marginBottom: 8 }}>
            {flash}
          </div>
        )}

        {loading ? (
          <div className="jc-spender-grid" style={GRID}>
            {[0, 1, 2, 3].map((n) => (
              <SpenderSkeleton key={n} C={C} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div style={{ ...mono, color: C.muted, fontSize: "0.8rem" }}>
            Belum ada spender. Tambahkan nama customer di atas.
          </div>
        ) : (
          <>
            <div className="jc-spender-grid" style={GRID}>
              {pageItems.map((s, i) => (
                <SpenderCard
                  key={`${s.id}-${s.updatedAt}`}
                  s={s}
                  rank={pageStart + i + 1}
                  C={C}
                  onSaved={(msg) => {
                    setError("");
                    setFlash(msg);
                    fetchAll();
                  }}
                  onError={setError}
                  onDelete={setConfirm}
                />
              ))}
            </div>

            <div
              style={{
                ...mono,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "1rem",
                fontSize: "0.68rem",
                color: C.muted,
              }}
            >
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                PER HALAMAN
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    ...mono,
                    background: C.trackBg,
                    color: C.text,
                    border: `1px solid ${C.border}`,
                    padding: "3px 6px",
                    fontSize: "0.68rem",
                  }}
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span>
                {pageStart + 1}-{Math.min(pageStart + perPage, list.length)} dari{" "}
                {list.length}
              </span>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                  style={pagerBtn(safePage <= 1)}
                >
                  PREV
                </button>
                <span>
                  {safePage}/{totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                  style={pagerBtn(safePage >= totalPages)}
                >
                  NEXT
                </button>
              </span>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={!!confirm}
        variant="danger"
        title="HAPUS SPENDER"
        message={`Hapus profil "${confirm?.name}"? Order customer tidak ikut terhapus.`}
        confirmText="HAPUS"
        loading={confirming}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default SpendersPage;