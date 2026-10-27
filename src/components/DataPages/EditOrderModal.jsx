import { useState, useEffect } from "react";
import {
  useDataPageColors,
  getInputS,
  getLabelS,
} from "../../constants/dataPage.constants";
import DatePicker from "../ui/DatePicker";
import { getWorkersList } from "../../services/orderService";
import WorkerNameInput from "./WorkerNameInput";
import ThemeToggle from "../ui/sidebar/ThemeToggle";

const EditOrderModal = ({ order, season, onClose, onUpdate, loading }) => {
  const C = useDataPageColors();
  const inputS = getInputS(C);
  const labelS = getLabelS(C);

  const TIERS =
    season?.rateHistory?.length > 0
      ? [...season.rateHistory]
          .sort(
            (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate),
          )[0]
          .rates.map((r) => r.tier)
      : ["EPIC", "LEGEND", "MAWI", "HONOR", "GLORY", "IMO"];

  const [form, setForm] = useState({
    customerName: order.customerName || "",
    date: order.date ? new Date(order.date).toISOString().split("T")[0] : "",
    time: order.date
      ? (() => {
          const d = new Date(order.date);
          return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes(),
          ).padStart(2, "0")}`;
        })()
      : "",
    category: order.category || "JOKI RANK",
    payment: order.payment || "QRIS",
    price: order.price || "",
    status: order.status || "PROCESS",
    workers:
      order.workers?.length > 0
        ? order.workers.map((w) => ({
            name: w.name,
            rankBreakdown: w.rankBreakdown
              ? Object.fromEntries(
                  w.rankBreakdown instanceof Map
                    ? w.rankBreakdown
                    : Object.entries(w.rankBreakdown),
                )
              : {},
            bonusBreakdown: w.bonusBreakdown
              ? Object.fromEntries(
                  w.bonusBreakdown instanceof Map
                    ? w.bonusBreakdown
                    : Object.entries(w.bonusBreakdown),
                )
              : {},
            customSalary: w.customSalary ?? "",
            isPaid: w.isPaid || false,
            paidAt: w.paidAt || null,
          }))
        : [
            {
              name: "",
              rankBreakdown: {},
              bonusBreakdown: {},
              customSalary: "",
              isPaid: false,
              paidAt: null,
            },
          ],
  });

  const [openBonus, setOpenBonus] = useState({});
  const [errors, setErrors] = useState({});

  const [workerOptions, setWorkerOptions] = useState([]);

  useEffect(() => {
    getWorkersList(season?.id)
      .then((res) => setWorkerOptions(res.data || []))
      .catch(() => {});
  }, [season?.id]);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

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
      const bb = { ...(workers[i].bonusBreakdown || {}) };
      if (val === "" || Number(val) === 0) {
        delete rb[tier];
        delete bb[tier];
      } else {
        rb[tier] = Number(val);
      }
      workers[i] = { ...workers[i], rankBreakdown: rb, bonusBreakdown: bb };
      return { ...f, workers };
    });
  const setBonusBreakdown = (i, tier, val) =>
    setForm((f) => {
      const workers = [...f.workers];
      const bb = { ...(workers[i].bonusBreakdown || {}) };
      if (val === "" || Number(val) === 0) delete bb[tier];
      else bb[tier] = Number(val);
      workers[i] = { ...workers[i], bonusBreakdown: bb };
      return { ...f, workers };
    });

  const setCustomSalary = (i, val) =>
    setForm((f) => {
      const workers = [...f.workers];
      workers[i] = { ...workers[i], customSalary: val };
      return { ...f, workers };
    });

  const addWorker = () =>
    setForm((f) => ({
      ...f,
      workers: [
        ...f.workers,
        {
          name: "",
          rankBreakdown: {},
          customSalary: "",
          isPaid: false,
          paidAt: null,
        },
      ],
    }));

  const removeWorker = (i) => {
    setOpenBonus({});
    setForm((f) => ({
      ...f,
      workers: f.workers.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!form.customerName.trim())
      newErrors.customerName = "Nama customer wajib diisi.";
    if (!form.price) newErrors.price = "Harga wajib diisi.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const rawPrice = String(form.price).replace(/\./g, "");
    const finalTime =
      form.time ||
      (() => {
        const t = new Date();
        return `${String(t.getHours()).padStart(2, "0")}:${String(
          t.getMinutes(),
        ).padStart(2, "0")}`;
      })();
    onUpdate(order.id, {
      customerName: form.customerName,
      date: `${form.date}T${finalTime}:00+07:00`,
      category: form.category,
      payment: form.payment,
      price: Number(rawPrice),
      status: form.status,
      workers: form.workers
        .filter((w) => w.name.trim())
        .map((w) => ({
          name: w.name.toUpperCase(),
          rankBreakdown: w.rankBreakdown,
          bonusBreakdown: w.bonusBreakdown || {},
          customSalary:
            w.customSalary === "" ? undefined : Number(w.customSalary),
          isPaid: w.isPaid,
          paidAt: w.paidAt,
        })),
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={{
          background: C.modalBg,
          border: `1px solid ${C.border}`,
          boxShadow: `0 0 60px rgba(0,229,255,0.08)`,
          width: "calc(100% - 2rem)",
          maxWidth: "660px",
          maxHeight: "90dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            padding: "0.75rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(0,229,255,0.04)",
          }}
        >
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: C.cyan,
              fontFamily: "'Courier New', monospace",
            }}
          >
            EDIT ORDER — {order.customerName}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle iconOnly />
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.muted,
                fontSize: "1rem",
                fontWeight: 900,
              }}
            >
              ✕
            </button>
          </div>
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
          {/* Row 1 */}
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
                style={{
                  ...inputS,
                  ...(errors.customerName && {
                    border: `1px solid ${C.magenta}`,
                  }),
                }}
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
              />
              {errors.customerName && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: C.magenta,
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.5px",
                  }}
                >
                  ⚠ {errors.customerName}
                </div>
              )}
            </div>
            <div>
              <label style={labelS}>TANGGAL *</label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <DatePicker
                  value={form.date}
                  onChange={(val) => setField("date", val)}
                  style={{ ...inputS, width: "100%", boxSizing: "border-box" }}
                />
                <input
                  type="time"
                  style={{ ...inputS, width: "100px", flexShrink: 0 }}
                  value={form.time}
                  onChange={(e) => setField("time", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
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

          {/* Price */}
          <div style={{ maxWidth: "200px" }}>
            <label style={labelS}>HARGA (Rp) *</label>
            <input
              style={{
                ...inputS,
                ...(errors.price && { border: `1px solid ${C.magenta}` }),
              }}
              type="text"
              inputMode="numeric"
              value={
                form.price === ""
                  ? ""
                  : Number(
                      String(form.price).replace(/\./g, ""),
                    ).toLocaleString("id-ID")
              }
              onChange={(e) => {
                const raw = e.target.value
                  .replace(/\./g, "")
                  .replace(/\D/g, "");
                setField("price", raw);
              }}
              placeholder="150.000"
            />
            {errors.price && (
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: C.magenta,
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.5px",
                }}
              >
                ⚠ {errors.price}
              </div>
            )}
          </div>

          {/* Workers */}
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
                  background: C.subtleBg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <label style={{ ...labelS, marginBottom: "3px" }}>
                      NAMA WORKER
                    </label>
                    <WorkerNameInput
                      value={w.name}
                      onChange={(val) => setWorkerName(i, val)}
                      options={workerOptions}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelS, marginBottom: "3px" }}>
                      CUSTOM GAJI (OPSIONAL)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      style={{ ...inputS, width: "160px" }}
                      placeholder="150.000"
                      value={
                        w.customSalary === "" ||
                        w.customSalary === undefined ||
                        w.customSalary === null
                          ? ""
                          : Number(
                              String(w.customSalary).replace(/\./g, ""),
                            ).toLocaleString("id-ID")
                      }
                      onChange={(e) => {
                        const raw = e.target.value
                          .replace(/\./g, "")
                          .replace(/\D/g, "");
                        setCustomSalary(i, raw);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      alignSelf: "stretch",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      style={{
                        ...labelS,
                        marginBottom: "3px",
                        visibility: "hidden",
                      }}
                    >
                      X
                    </label>
                    <button
                      type="button"
                      onClick={() => removeWorker(i)}
                      title="Hapus worker"
                      style={{
                        ...inputS,
                        width: "44px",
                        flex: 1,
                        padding: 0,
                        textAlign: "center",
                        cursor: "pointer",
                        fontWeight: 900,
                        color: C.magenta,
                        border: `1px solid ${C.magenta}`,
                        background: "transparent",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {TIERS.map((tier) => {
                    const stars = w.rankBreakdown[tier] || 0;
                    const bonus = w.bonusBreakdown?.[tier] || 0;
                    const bonusKey = `${i}-${tier}`;
                    const showBonus =
                      stars > 0 && (bonus > 0 || openBonus[bonusKey]);

                    return (
                      <div
                        key={tier}
                        style={{
                          display: "grid",
                          gridTemplateColumns: showBonus
                            ? "auto 55px auto"
                            : "auto 55px",
                          alignItems: "center",
                          columnGap: "4px",
                          rowGap: "4px",
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
                        {showBonus && <span />}

                        {stars > 0 && (
                          <>
                            <span />
                            {showBonus ? (
                              <input
                                type="number"
                                min="0"
                                autoFocus={!bonus}
                                title="Bonus (tidak dihitung ke gaji)"
                                style={{
                                  ...inputS,
                                  width: "55px",
                                  padding: "4px 6px",
                                  fontSize: "0.8rem",
                                  border: `1px dashed ${C.cyan}`,
                                }}
                                placeholder="0"
                                value={w.bonusBreakdown?.[tier] || ""}
                                onChange={(e) =>
                                  setBonusBreakdown(i, tier, e.target.value)
                                }
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenBonus((o) => ({
                                    ...o,
                                    [bonusKey]: true,
                                  }))
                                }
                                style={{
                                  ...inputS,
                                  width: "55px",
                                  padding: "4px 0",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  cursor: "pointer",
                                  color: C.cyan,
                                  border: `1px dashed ${C.cyan}`,
                                  background: "transparent",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.6rem",
                                    fontWeight: 900,
                                    letterSpacing: "1px",
                                  }}
                                >
                                  + BONUS
                                </span>
                              </button>
                            )}
                            {showBonus && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBonusBreakdown(i, tier, "");
                                  setOpenBonus((o) => ({
                                    ...o,
                                    [bonusKey]: false,
                                  }));
                                }}
                                title="Hapus bonus"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: C.muted,
                                  cursor: "pointer",
                                  fontWeight: 900,
                                  fontSize: "0.7rem",
                                  padding: 0,
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "0.875rem 1.25rem",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            background: C.modalFooterBg,
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
              background: loading ? "transparent" : C.cyan,
              border: `1px solid ${loading ? C.muted : C.cyan}`,
              color: loading ? C.muted : "#000",
              padding: "0.5rem 1.5rem",
              fontWeight: 900,
              fontSize: "0.78rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1.5px",
              boxShadow: loading ? "none" : `0 0 16px ${C.cyan}50`,
            }}
          >
            {loading ? "..." : "SIMPAN PERUBAHAN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;