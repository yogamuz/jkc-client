import { useState } from "react";
import * as XLSX from "xlsx";
import {
  C,
  inputS,
  labelS,
  COLUMN_MAP,
} from "../../constants/dataPage.constants";

const ImportExcelModal = ({ season, onClose, onCreate, loading }) => {
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(0);

  const excelDateToISO = (val) => {
    if (!val) return new Date().toISOString().split("T")[0];
    if (typeof val === "number") {
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      return d.toISOString().split("T")[0];
    }
    const d = new Date(val);
    return isNaN(d)
      ? new Date().toISOString().split("T")[0]
      : d.toISOString().split("T")[0];
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw2D = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

      if (!raw2D.length) {
        setRows([]);
        setPreview(true);
        return;
      }

      // ── Auto-detect header row ────────────────────────────
      const KNOWN_HEADERS = new Set(Object.keys(COLUMN_MAP));
      let headerRowIdx = -1;
      let headerRow = [];

      for (let i = 0; i < raw2D.length; i++) {
        const row = raw2D[i].map((c) =>
          String(c || "")
            .trim()
            .toUpperCase(),
        );
        const matchCount = row.filter((c) => KNOWN_HEADERS.has(c)).length;
        if (matchCount >= 2) {
          headerRowIdx = i;
          headerRow = row;
          break;
        }
      }

      if (headerRowIdx === -1) {
        setRows([]);
        setPreview(true);
        return;
      }

      const dataRows = raw2D.slice(headerRowIdx + 1);

      const mapped = dataRows
        .map((row) => {
          const result = {
            customerName: "",
            date: "",
            category: "JOKI RANK",
            payment: "QRIS",
            price: 0,
            status: "PENDING",
            workers: [],
            totalWorkerSalary: 0,
            extraFields: {},
          };

          headerRow.forEach((colKey, colIdx) => {
            const val = row[colIdx];
            const mappedKey = COLUMN_MAP[colKey];

            if (!colKey || colKey === "") return;

            if (!mappedKey || mappedKey === "_skip") {
              if (
                colKey !== "" &&
                val !== "" &&
                val !== null &&
                val !== undefined
              ) {
                result.extraFields[colKey] = val;
              }
            } else if (mappedKey === "customerName") {
              result.customerName = String(val || "").trim();
            } else if (mappedKey === "date") {
              result.date = excelDateToISO(val);
            } else if (mappedKey === "category") {
              result.category = String(val || "JOKI RANK")
                .trim()
                .toUpperCase();
            } else if (mappedKey === "_type") {
              if (val)
                result.extraFields["TYPE"] = String(val).trim().toUpperCase();
            } else if (mappedKey === "payment") {
              result.payment = String(val || "QRIS")
                .trim()
                .toUpperCase();
            } else if (mappedKey === "price") {
              result.price = Number(val || 0);
            } else if (mappedKey === "_workerSalary") {
              result.totalWorkerSalary = Number(val || 0);
            } else if (mappedKey === "_workerName" && val) {
              result.workers = [
                { name: String(val).toUpperCase().trim(), rankBreakdown: {} },
              ];
            } else if (mappedKey === "_status") {
              const s = String(val || "").toUpperCase();
              result.status =
                s === "DONE" ? "DONE" : s === "PROCESS" ? "PROCESS" : "PENDING";
            } else if (mappedKey === "_paid") {
              if (val)
                result.extraFields["PAID"] = String(val).trim().toUpperCase();
            } else if (mappedKey === "_req") {
              if (val)
                result.extraFields["REQ"] = String(val).trim().toUpperCase();
            }
          });

          return result;
        })
        .filter((r) => r.customerName && r.price > 0);

      setRows(mapped);
      setPreview(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    setImporting(true);
    let count = 0;
    for (const row of rows) {
      await onCreate({ ...row, seasonId: season.id });
      count++;
      setDone(count);
    }
    setImporting(false);
    onClose();
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
        zIndex: 100,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#131318",
          border: `1px solid ${C.border}`,
          width: "calc(100% - 2rem)",
          maxWidth: "700px",
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
            // IMPORT EXCEL — {season.name}
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
          {!preview ? (
            <>
              <div
                style={{
                  color: C.muted,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  lineHeight: 1.6,
                }}
              >
                Upload file Excel (.xlsx). Kolom yang dikenali:
                <br />
                <span style={{ color: C.yellow }}>
                  NAME, DATE, CATEGORY, PAYMENT, PRICE
                </span>
              </div>
              <div>
                <label style={labelS}>PILIH FILE EXCEL</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFile}
                  style={inputS}
                />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  color: C.cyan,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
              >
                {rows.length} order siap diimport ke{" "}
                <span style={{ color: C.yellow }}>{season.name}</span>
              </div>
              {/* Preview table */}
              <div
                style={{ overflowX: "auto", border: `1px solid ${C.border}` }}
              >
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: "#0D0D0F",
                      }}
                    >
                      {["NAME", "DATE", "KATEGORI", "BAYAR", "HARGA"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "6px 10px",
                              color: C.yellow,
                              fontWeight: 900,
                              letterSpacing: "1.5px",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((r, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: i % 2 === 0 ? "#0F0F14" : "#0D0D0F",
                        }}
                      >
                        <td style={{ padding: "5px 10px", color: C.text }}>
                          {r.customerName}
                        </td>
                        <td style={{ padding: "5px 10px", color: "#8A8A9A" }}>
                          {r.date}
                        </td>
                        <td style={{ padding: "5px 10px", color: "#8A8A9A" }}>
                          {r.category}
                        </td>
                        <td style={{ padding: "5px 10px", color: "#8A8A9A" }}>
                          {r.payment}
                        </td>
                        <td style={{ padding: "5px 10px", color: C.green }}>
                          Rp {r.price.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 10 && (
                  <div
                    style={{
                      padding: "6px 10px",
                      color: C.muted,
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                    }}
                  >
                    + {rows.length - 10} order lainnya...
                  </div>
                )}
              </div>
              {importing && (
                <div
                  style={{
                    color: C.cyan,
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                  }}
                >
                  Mengimport... {done}/{rows.length}
                </div>
              )}
            </>
          )}
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
          {preview && (
            <button
              onClick={handleImport}
              disabled={importing || rows.length === 0}
              style={{
                background: importing ? "transparent" : C.cyan,
                border: `1px solid ${importing ? C.muted : C.cyan}`,
                color: importing ? C.muted : "#000",
                padding: "0.5rem 1.5rem",
                fontWeight: 900,
                fontSize: "0.78rem",
                cursor: importing ? "not-allowed" : "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1.5px",
                boxShadow: importing ? "none" : `0 0 16px ${C.cyan}50`,
              }}
            >
              {importing
                ? `${done}/${rows.length}...`
                : `IMPORT ${rows.length} ORDER`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExcelModal;
