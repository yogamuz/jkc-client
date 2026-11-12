import { useState, useEffect, useCallback } from "react";
import { KeyRound, RotateCcw, Power, Trash2, Download, Copy, Check } from "lucide-react";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  useWorkersColors,
  cell,
  glow,
} from "../components/DataPages/workers.utils";
import { useTheme } from "../context/ThemeContext";
import {
  getWorkerRegistry,
  addRegistryWorker,
  importRegistryFromOrders,
  generateWorkerInvite,
  resetRegistryWorker,
  setRegistryWorkerActive,
  deleteRegistryWorker,
} from "../services/workerRegistryService";

const mono = { fontFamily: "'Courier New', monospace" };

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const Badge = ({ color, children }) => (
  <span
    style={{
      ...mono,
      display: "inline-block",
      padding: "2px 8px",
      fontSize: "0.58rem",
      fontWeight: 900,
      letterSpacing: "1px",
      color,
      border: `1px solid ${color}`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const ActionBtn = ({ color, title, disabled, onClick, children }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    style={{
      ...mono,
      background: "transparent",
      border: `1px solid ${color}`,
      color,
      padding: "3px 8px",
      fontSize: "0.58rem",
      fontWeight: 900,
      letterSpacing: "1px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

// Modal kode: kode yang masih berlaku bisa dilihat lagi, jadi sediakan tombol copy
const CodeModal = ({ info, onClose, C }) => {
  const [copied, setCopied] = useState("");
  if (!info) return null;

  const prettyCode = `${info.code.slice(0, 4)}-${info.code.slice(4)}`;
  const expires = fmtDateTime(info.expiresAt);
  const message =
    `Kode daftar worker JOKI CALM untuk ${info.name}: ${info.code}\n` +
    (info.link
      ? `Klik link ini untuk daftar di bot:\n${info.link}\n`
      : `Buka bot, tekan Daftar, lalu masukkan kode di atas.\n`) +
    `Berlaku sampai ${expires}. Jangan dibagikan ke siapa pun.`;

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      // clipboard tidak tersedia, user bisa salin manual
    }
  };

  const copyBtn = (key, text, label) => (
    <button
      type="button"
      onClick={() => copy(key, text)}
      style={{
        ...mono,
        background: "transparent",
        border: `1px solid ${C.cyan}`,
        color: C.cyan,
        padding: "0.4rem 0.9rem",
        fontSize: "0.65rem",
        fontWeight: 900,
        letterSpacing: "1.5px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {copied === key ? <Check size={12} /> : <Copy size={12} />}
      {copied === key ? "TERSALIN" : label}
    </button>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.cyan}`,
          width: "calc(100% - 2rem)",
          maxWidth: "420px",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
        }}
      >
        <div
          style={{
            ...mono,
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "3px",
            color: C.cyan,
          }}
        >
          KODE DAFTAR — {info.name}
        </div>
        <div
          style={{
            ...mono,
            fontSize: "clamp(1.6rem, 8vw, 2.2rem)",
            fontWeight: 900,
            letterSpacing: "6px",
            color: C.yellow,
            textAlign: "center",
            padding: "0.6rem",
            background: C.trackBg,
            border: `1px dashed ${C.border}`,
            userSelect: "all",
          }}
        >
          {prettyCode}
        </div>
        <div style={{ ...mono, fontSize: "0.68rem", color: C.muted, lineHeight: 1.6 }}>
          {info.reused
            ? "Kode ini masih berlaku dan sama dengan yang dibuat sebelumnya. "
            : "Kode baru dibuat. "}
          Sekali pakai, berlaku sampai {expires}. Kirim ke worker lewat WA, lalu
          worker tekan <b>Daftar</b> di bot dan masukkan kodenya
          {info.link ? " (atau klik link di bawah)." : "."}
        </div>
        {info.link && (
          <div
            style={{
              ...mono,
              fontSize: "0.62rem",
              color: C.muted,
              wordBreak: "break-all",
            }}
          >
            {info.link}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {copyBtn("code", info.code, "COPY KODE")}
          {copyBtn("msg", message, "COPY PESAN WA")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...mono,
              background: C.yellow,
              border: `1px solid ${C.yellow}`,
              color: "#000",
              padding: "0.45rem 1.25rem",
              fontWeight: 900,
              fontSize: "0.68rem",
              letterSpacing: "1.5px",
              cursor: "pointer",
            }}
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkerRegistryPage = () => {
  const C = useWorkersColors();
  const { theme } = useTheme();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [codeInfo, setCodeInfo] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type, worker }
  const [confirming, setConfirming] = useState(false);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getWorkerRegistry();
      setWorkers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const run = async (id, fn) => {
    setError("");
    setBusyId(id);
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    setError("");
    try {
      await addRegistryWorker(name);
      setFlash(`Worker "${name.trim().toUpperCase()}" ditambahkan.`);
      setName("");
      fetchWorkers();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleImport = async () => {
    setError("");
    setAdding(true);
    try {
      const res = await importRegistryFromOrders();
      setFlash(res.message);
      fetchWorkers();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleInvite = (w) =>
    run(w.id, async () => {
      const res = await generateWorkerInvite(w.id);
      setCodeInfo({ ...res.data, name: w.name });
      fetchWorkers();
    });

  const handleToggle = (w) =>
    run(w.id, async () => {
      await setRegistryWorkerActive(w.id, !w.isActive);
      setFlash(`${w.name} ${w.isActive ? "dinonaktifkan" : "diaktifkan"}.`);
      fetchWorkers();
    });

  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirming(true);
    const { type, worker } = confirm;
    await run(worker.id, async () => {
      if (type === "reset") {
        await resetRegistryWorker(worker.id);
        setFlash(`Verifikasi ${worker.name} di-reset.`);
      } else {
        await deleteRegistryWorker(worker.id);
        setFlash(`Worker "${worker.name}" dihapus.`);
      }
      fetchWorkers();
    });
    setConfirming(false);
    setConfirm(null);
  };

  const inputStyle = {
    ...mono,
    padding: "0.6rem 0.875rem",
    background: C.trackBg,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: "0.78rem",
    outline: "none",
    letterSpacing: "1px",
    width: "200px",
    boxSizing: "border-box",
  };

  const statusBadge = (w) => {
    if (w.isVerified) return <Badge color={C.green}>TERVERIFIKASI</Badge>;
    if (w.hasPendingInvite) return <Badge color={C.yellow}>MENUNGGU DAFTAR</Badge>;
    return <Badge color={C.muted}>BELUM DIVERIFIKASI</Badge>;
  };

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

      {/* Header */}
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
          Kelola Worker
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

      {/* Tambah worker */}
      <div
        style={{
          border: `1px solid ${C.border}`,
          background: C.panel,
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            ...mono,
            fontSize: "0.58rem",
            fontWeight: 900,
            letterSpacing: "3px",
            color: C.cyan,
            marginBottom: "0.875rem",
          }}
        >
          TAMBAH NAMA WORKER
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ACIL"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={inputStyle}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !name.trim()}
            style={{
              ...mono,
              background: adding || !name.trim() ? "transparent" : C.yellow,
              border: `1px solid ${adding || !name.trim() ? C.muted : C.yellow}`,
              color: adding || !name.trim() ? C.muted : "#000",
              padding: "0.6rem 1.25rem",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              cursor: adding || !name.trim() ? "not-allowed" : "pointer",
              boxShadow:
                adding || !name.trim() ? "none" : glow(theme, `0 0 14px ${C.yellow}40`),
            }}
          >
            + TAMBAH
          </button>
          <button
            onClick={handleImport}
            disabled={adding}
            title="Ambil semua nama worker yang pernah dipakai di order"
            style={{
              ...mono,
              background: "transparent",
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              padding: "0.6rem 1rem",
              fontWeight: 900,
              fontSize: "0.68rem",
              letterSpacing: "1.5px",
              cursor: adding ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={12} strokeWidth={2} /> IMPOR DARI ORDER
          </button>
        </div>
        <div
          style={{
            ...mono,
            marginTop: "0.6rem",
            fontSize: "0.62rem",
            color: C.muted,
            letterSpacing: "0.5px",
          }}
        >
          Hanya nama yang ada di daftar ini yang bisa mendaftar lewat bot. Setelah
          menambah nama, buat kode lalu kirim ke worker. Kode berlaku 15 menit.
        </div>
      </div>

      {flash && (
        <div
          style={{
            ...mono,
            border: `1px solid ${C.cyan}`,
            background: C.cyanBg,
            color: C.cyan,
            padding: "0.6rem 1rem",
            fontSize: "0.72rem",
            fontWeight: 900,
            letterSpacing: "1px",
            marginBottom: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          ✓ {flash}
        </div>
      )}
      {error && (
        <div
          style={{
            ...mono,
            background: C.magentaBg,
            border: `1px solid ${C.magenta}`,
            padding: "0.75rem 1.25rem",
            color: C.magenta,
            fontWeight: 900,
            fontSize: "0.8rem",
            marginBottom: "1.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Tabel */}
      <div
        style={{
          border: `1px solid ${C.yellow}60`,
          overflow: "hidden",
          background: C.panel,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "760px", width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["#", "NAMA", "STATUS", "TELEGRAM", "TERVERIFIKASI", "AKSI"].map((h) => (
                  <th
                    key={h}
                    style={{
                      ...mono,
                      padding: "0.7rem 0.875rem",
                      fontSize: "0.6rem",
                      letterSpacing: "2px",
                      textAlign: "left",
                      color: C.yellow,
                      borderRight: `1px solid ${C.border}`,
                      background: C.bg,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && workers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...mono, padding: "2.5rem", textAlign: "center", color: C.dim, letterSpacing: "4px", fontSize: "0.72rem" }}>
                    MEMUAT...
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...mono, padding: "2.5rem", textAlign: "center", color: C.dim, letterSpacing: "4px", fontSize: "0.72rem" }}>
                    BELUM ADA WORKER
                  </td>
                </tr>
              ) : (
                workers.map((w, i) => {
                  const busy = busyId === w.id;
                  return (
                    <tr
                      key={w.id}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: i % 2 === 0 ? C.panel : C.rowAlt,
                        opacity: w.isActive ? 1 : 0.65,
                      }}
                    >
                      <td style={{ ...cell(false, C), color: C.muted, fontSize: "0.72rem" }}>
                        {i + 1}
                      </td>
                      <td style={{ ...cell(true, C), color: C.yellow }}>{w.name}</td>
                      <td style={cell(false, C)}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          {statusBadge(w)}
                          {!w.isActive && <Badge color={C.magenta}>NONAKTIF</Badge>}
                        </div>
                      </td>
                      <td style={cell(false, C)}>
                        {w.isVerified
                          ? w.telegramUsername
                            ? `@${w.telegramUsername}`
                            : `ID ${w.telegramId}`
                          : "—"}
                      </td>
                      <td style={cell(false, C)}>{fmtDateTime(w.verifiedAt)}</td>
                      <td style={cell(false, C)}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          {!w.isVerified && (
                            <ActionBtn
                              color={C.cyan}
                              disabled={busy || !w.isActive}
                              title={
                                w.isActive
                                  ? w.hasPendingInvite
                                    ? "Lihat kode yang masih berlaku"
                                    : "Buat kode daftar baru"
                                  : "Aktifkan worker dulu"
                              }
                              onClick={() => handleInvite(w)}
                            >
                              <KeyRound size={11} strokeWidth={2} />
                              {w.hasPendingInvite ? "LIHAT KODE" : "BUAT KODE"}
                            </ActionBtn>
                          )}
                          {w.isVerified && (
                            <ActionBtn
                              color={C.yellow}
                              disabled={busy}
                              title="Lepas akun Telegram (HP ganti/hilang), keluarkan dari grup"
                              onClick={() => setConfirm({ type: "reset", worker: w })}
                            >
                              <RotateCcw size={11} strokeWidth={2} /> RESET
                            </ActionBtn>
                          )}
                          <ActionBtn
                            color={w.isActive ? C.muted : C.green}
                            disabled={busy}
                            title={w.isActive ? "Nonaktifkan (dikeluarkan dari grup)" : "Aktifkan lagi"}
                            onClick={() => handleToggle(w)}
                          >
                            <Power size={11} strokeWidth={2} />
                            {w.isActive ? "NONAKTIFKAN" : "AKTIFKAN"}
                          </ActionBtn>
                          <ActionBtn
                            color={C.magenta}
                            disabled={busy}
                            title="Hapus worker"
                            onClick={() => setConfirm({ type: "delete", worker: w })}
                          >
                            <Trash2 size={11} strokeWidth={2} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CodeModal info={codeInfo} onClose={() => setCodeInfo(null)} C={C} />

      <ConfirmModal
        open={!!confirm}
        variant="danger"
        title={confirm?.type === "reset" ? "RESET VERIFIKASI" : "HAPUS WORKER"}
        message={
          confirm?.type === "reset"
            ? `Lepas akun Telegram milik "${confirm?.worker.name}" dan keluarkan dari grup? Worker harus daftar ulang pakai kode baru.`
            : `Hapus "${confirm?.worker.name}" dari daftar worker? Order lama tidak ikut terhapus.`
        }
        confirmText={confirm?.type === "reset" ? "RESET" : "HAPUS"}
        loading={confirming}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default WorkerRegistryPage;