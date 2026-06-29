import { ChevronRight } from "lucide-react";
import { C, cell } from "./workers.utils";

const AdminsTable = ({ admins, loading, onSelectAdmin }) => {
  return (
    <div
      style={{
        border: `1px solid ${C.yellow}60`,
        overflow: "hidden",
        background: "#0F0F14",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ borderCollapse: "collapse", minWidth: "400px", width: "100%" }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["#", "USERNAME", "LAST LOGIN", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.7rem 0.875rem",
                    fontSize: "0.6rem",
                    letterSpacing: "2px",
                    textAlign: "left",
                    color: C.yellow,
                    borderRight: `1px solid ${C.border}`,
                    background: "#0D0D0F",
                    fontFamily: "'Courier New', monospace",
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
            {loading && admins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: C.dim,
                    fontFamily: "monospace",
                    letterSpacing: "4px",
                    fontSize: "0.72rem",
                  }}
                >
                  MEMUAT...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: C.dim,
                    fontFamily: "monospace",
                    letterSpacing: "4px",
                    fontSize: "0.72rem",
                  }}
                >
                  BELUM ADA ADMIN
                </td>
              </tr>
            ) : (
              admins.map((a, i) => (
                <tr
                  key={a._id}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: i % 2 === 0 ? "#0F0F14" : "#0D0D0F",
                  }}
                >
                  <td
                    style={{
                      ...cell(false),
                      color: "#444450",
                      fontSize: "0.72rem",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ ...cell(true), color: C.yellow }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {a.avatar ? (
                        <img
                          src={a.avatar}
                          alt={a.username}
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `1px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "#1A1A1A",
                            border: `1px solid ${C.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.55rem",
                            fontWeight: 900,
                            color: C.muted,
                            fontFamily: "monospace",
                            flexShrink: 0,
                          }}
                        >
                          {a.username[0].toUpperCase()}
                        </div>
                      )}
                      {a.username.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ ...cell(false) }}>
                    {a.lastLogin
                      ? new Date(a.lastLogin).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td style={{ ...cell(false), textAlign: "center" }}>
                    <button
                      onClick={() => onSelectAdmin(a)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        color: C.muted,
                        cursor: "pointer",
                        padding: "4px 10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        letterSpacing: "1px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.cyan;
                        e.currentTarget.style.color = C.cyan;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.color = C.muted;
                      }}
                    >
                      KELOLA <ChevronRight size={11} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsTable;