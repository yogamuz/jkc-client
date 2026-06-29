import { useState } from "react";
import { DEFAULT_COLUMNS } from "../../constants/joki.constants";
import { C, inputS, labelS } from "../../constants/dataPage.constants";
import DatePicker from "../ui/DatePicker";

const AddOrderModal = ({ season, onClose, onCreate, loading }) => {
  // state tambahan untuk display
  const [priceDisplay, setPriceDisplay] = useState("");

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    if (isNaN(raw)) return;
    setPriceDisplay(Number(raw).toLocaleString("id-ID"));
    setField("price", raw);
  };
  const allColumns = [...DEFAULT_COLUMNS, ...(season.extraColumns || [])];
  const [form, setForm] = useState({
    customerName: "",
    date: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })(),
    category: "JOKI RANK",
    payment: "QRIS",
    price: "",
    status: "PROCESS",
    workers: [{ name: "", rankBreakdown: {} }],
    extraFields: {},
  });

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setWorkerName = (i, val) =>
    setForm((f) => {
      const workers = [...f.workers];
      workers[i] = { ...workers[i], name: val };
      return { ...f, workers };
    });

  const setRankBreakdown = (i, tier, val) =>
    setForm((f) => {
      const workers = [...f.workers];
      const rb = { ...workers[i].rankBreakdown };
      if (val === "" || val === 0) delete rb[tier];
      else rb[tier] = Number(val);
      workers[i] = { ...workers[i], rankBreakdown: rb };
      return { ...f, workers };
    });

  const addWorker = () =>
    setForm((f) => ({
      ...f,
      workers: [...f.workers, { name: "", rankBreakdown: {} }],
    }));

  const removeWorker = (i) =>
    setForm((f) => ({
      ...f,
      workers: f.workers.filter((_, idx) => idx !== i),
    }));

  const TIERS =
    season.rateHistory?.length > 0
      ? season.rateHistory[season.rateHistory.length - 1].rates.map(
          (r) => r.tier,
        )
      : ["EPIC", "LEGEND", "MAWI", "HONOR", "GLORY", "IMO"];

  const handleSubmit = () => {
    if (!form.customerName || !form.price) return;
    onCreate({
      seasonId: season.id,
      customerName: form.customerName,
      date: form.date,
      category: form.category,
      payment: form.payment,
      price: Number(form.price),
      status: form.status,
      workers: form.workers.filter((w) => w.name.trim()),
      extraFields: form.extraFields,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#131318",
          border: `1px solid ${C.border}`,
          boxShadow: `0 0 60px rgba(255,230,0,0.08), 0 0 0 1px #1a1a20`,
          width: "calc(100% - 2rem)",
          maxWidth: "640px",
          maxHeight: "90dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            padding: "0.75rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,230,0,0.04)",
          }}
        >
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.yellow,
              fontFamily: "'Courier New', monospace",
            }}
          >
            // TAMBAH ORDER — {season.name}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: "1rem",
              color: C.muted,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelS}>NAMA CUSTOMER *</label>
              <input
                style={inputS}
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
                placeholder="Nama customer"
              />
            </div>
            <div>
              <label style={labelS}>TANGGAL *</label>
              <DatePicker
                value={form.date}
                onChange={(val) => setField("date", val)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelS}>KATEGORI *</label>
              <select
                style={inputS}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {[
                  "JOKI RANK",
                  "JOKI GENDONG",
                  "JOKI RISING",
                  "JOKI MONTAGE",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelS}>PEMBAYARAN</label>
              <select
                style={inputS}
                value={form.payment}
                onChange={(e) => setField("payment", e.target.value)}
              >
                {["QRIS", "BCA", "DANA", "SPAY", "SEABANK", "OVO", "GOPAY"].map(
                  (p) => (
                    <option key={p}>{p}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label style={labelS}>STATUS</label>
              <select
                style={inputS}
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                {["PROCESS", "DONE", "PENDING"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ maxWidth: "200px" }}>
            <label style={labelS}>HARGA (Rp) *</label>
            <input
              style={inputS}
              type="text"
              inputMode="numeric"
              value={priceDisplay}
              onChange={handlePriceChange}
              placeholder="150.000"
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ ...labelS, marginBottom: 0 }}>WORKERS</span>
              <button
                onClick={addWorker}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.cyan}`,
                  color: C.cyan,
                  padding: "3px 10px",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                + TAMBAH WORKER
              </button>
            </div>
            {form.workers.map((w, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${C.border}`,
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  background: "rgba(255,255,255,0.02)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <input
                    style={{ ...inputS, width: "180px" }}
                    placeholder="Nama worker (ACIL)"
                    value={w.name}
                    onChange={(e) =>
                      setWorkerName(i, e.target.value.toUpperCase())
                    }
                  />
                  {form.workers.length > 1 && (
                    <button
                      onClick={() => removeWorker(i)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.magenta}`,
                        color: C.magenta,
                        fontWeight: 900,
                        cursor: "pointer",
                        padding: "4px 8px",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {TIERS.map((tier) => (
                    <div
                      key={tier}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          fontFamily: "monospace",
                          color: C.muted,
                          letterSpacing: "1px",
                        }}
                      >
                        {tier}
                      </span>
                      <input
                        type="number"
                        min="0"
                        style={{
                          ...inputS,
                          width: "55px",
                          padding: "4px 6px",
                          fontSize: "0.8rem",
                        }}
                        placeholder="0"
                        value={w.rankBreakdown[tier] || ""}
                        onChange={(e) =>
                          setRankBreakdown(i, tier, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "0.875rem 1.25rem",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            background: "#0D0D0F",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.muted,
              padding: "0.5rem 1.25rem",
              fontWeight: 900,
              fontSize: "0.78rem",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1.5px",
            }}
          >
            BATAL
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "transparent" : C.yellow,
              border: `1px solid ${loading ? C.muted : C.yellow}`,
              color: loading ? C.muted : "#000",
              padding: "0.5rem 1.5rem",
              fontWeight: 900,
              fontSize: "0.78rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1.5px",
              boxShadow: loading ? "none" : `0 0 16px ${C.yellow}50`,
            }}
          >
            {loading ? "..." : "SIMPAN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;
