import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { C, cell } from "../../constants/dataPage.constants";
import StatusBadge from "../ui/StatusBadge";
import PaidBadge from "../ui/PaidBadge";
import EditOrderModal from "./EditOrderModal";

const OrderTable = ({
  orders,
  loading,
  allCols,
  extraCols,
  season,
  onDelete,
  onUpdateStatus,
  onMarkPaid,
  onUpdate,
}) => {
  const [editOrder, setEditOrder] = useState(null);

  const fmtRp = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const handleUpdate = async (id, body) => {
    await onUpdate(id, body);
    setEditOrder(null);
  };

  return (
    <>
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
            style={{
              borderCollapse: "collapse",
              minWidth: "700px",
              width: "100%",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {allCols.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "0.7rem 0.875rem",
                      fontSize: "0.6rem",
                      letterSpacing: "2px",
                      textAlign: "left",
                      width: col.width,
                      minWidth: col.width,
                      color: C.yellow,
                      borderRight: `1px solid ${C.border}`,
                      background: "#0D0D0F",
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={allCols.length}
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
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={allCols.length}
                    style={{
                      padding: "2.5rem",
                      textAlign: "center",
                      color: C.dim,
                      fontFamily: "monospace",
                      letterSpacing: "4px",
                      fontSize: "0.72rem",
                    }}
                  >
                    BELUM ADA ORDER
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr
                    key={order.id}
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
                    <td
                      style={{
                        ...cell(true),
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {order.customerName}
                      {order.updatedBy?.avatar ? (
                        <img
                          src={order.updatedBy.avatar}
                          alt={order.updatedBy.username}
                          title={order.updatedBy.username}
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `1px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                      ) : order.updatedBy?.username ? (
                        <div
                          title={order.updatedBy.username}
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "#1A1A1A",
                            border: `1px solid ${C.border}`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.5rem",
                            fontWeight: 900,
                            color: C.muted,
                            fontFamily: "monospace",
                            flexShrink: 0,
                          }}
                        >
                          {order.updatedBy.username[0].toUpperCase()}
                        </div>
                      ) : null}
                    </td>
                    <td style={cell(false)}>{fmtDate(order.date)}</td>
                    <td style={cell(false)}>{order.category}</td>
                    <td style={cell(false)}>{order.payment || "—"}</td>
                    <td
                      style={{ ...cell(false), color: C.text, fontWeight: 600 }}
                    >
                      {fmtRp(order.price)}
                    </td>
                    <td style={cell(false)}>
                      {order.workers?.length > 0
                        ? order.workers.map((w) => w.name).join(", ")
                        : "—"}
                    </td>
                    <td
                      style={{ ...cell(false), color: C.text, fontWeight: 600 }}
                    >
                      {fmtRp(order.totalWorkerSalary)}
                    </td>
                    <td
                      style={{
                        ...cell(true),
                        color: order.profit >= 0 ? C.text : C.magenta,
                      }}
                    >
                      {fmtRp(order.profit)}
                    </td>
                    <td style={{ ...cell(false), verticalAlign: "middle" }}>
                      <StatusBadge
                        status={order.status}
                        onClick={() => onUpdateStatus(order.id, order.status)}
                      />
                    </td>
                    {extraCols.map((c) => (
                      <td key={c.key} style={cell(false)}>
                        {order.extraFields?.get?.(c.key) ??
                          order.extraFields?.[c.key] ??
                          "—"}
                      </td>
                    ))}
                    <td style={cell(false)}>
                      {order.workers?.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                        >
                          {order.workers.map((w) => (
                            <PaidBadge
                              key={w.name}
                              isPaid={w.isPaid}
                              onClick={() =>
                                onMarkPaid(order.id, w.name, !w.isPaid)
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td style={{ ...cell(false), textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => setEditOrder(order)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: C.muted,
                            cursor: "pointer",
                            padding: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = C.cyan)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = C.muted)
                          }
                          title="Edit order"
                        >
                          <Pencil size={13} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => onDelete(order.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: C.muted,
                            cursor: "pointer",
                            padding: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = C.magenta)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = C.muted)
                          }
                          title="Hapus order"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editOrder && (
        <EditOrderModal
          order={editOrder}
          season={season}
          onClose={() => setEditOrder(null)}
          onUpdate={handleUpdate}
          loading={loading}
        />
      )}
    </>
  );
};

export default OrderTable;
