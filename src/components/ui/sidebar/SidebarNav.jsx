import {
  LayoutDashboard,
  Database,
  Users,
  BarChart2,
  SlidersHorizontal,
  History,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useSidebarColors, getSubNavBtnStyle } from "./SidebarTokens";

// Klik biasa tetap SPA; Ctrl/Cmd/Shift/klik tengah dibiarkan ke browser (tab baru)
const linkClick = (e, fn) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  fn();
};

const SidebarNav = ({
  activePage,
  activeSeasonId,
  seasons,
  user,
  onNavigate,
  onSelectSeason,
  onOpenChangePw,
  onOpenManageAdmin,
}) => {
  const C = useSidebarColors();
  const subNavBtnStyle = getSubNavBtnStyle(C);
  const [dataOpen, setDataOpen] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    width: "100%",
    padding: "0.65rem 1.25rem",
    background: isActive ? C.activeBg : "transparent",
    border: "none",
    borderLeft: isActive ? `4px solid ${C.yellow}` : "4px solid transparent",
    color: isActive ? C.yellow : C.muted,
    fontWeight: isActive ? 900 : 700,
    fontSize: "0.72rem",
    letterSpacing: "1.5px",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Courier New', monospace",
    textTransform: "uppercase",
    transition: "color 0.15s, background 0.15s, border-left-color 0.15s",
    textDecoration: "none",
  });

  const hoverOn = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = C.bgHover;
      e.currentTarget.style.color = C.text;
    }
  };
  const hoverOff = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = C.muted;
    }
  };

  return (
    <nav style={{ flex: 1, padding: "0.5rem 0" }}>
      {/* Dashboard */}
      <a
        href="/admin/dashboard"
        onClick={(e) => linkClick(e, () => onNavigate("dashboard"))}
        style={navItemStyle(activePage === "dashboard")}
        onMouseEnter={(e) => hoverOn(e, activePage === "dashboard")}
        onMouseLeave={(e) => hoverOff(e, activePage === "dashboard")}
      >
        <LayoutDashboard size={14} strokeWidth={2} />
        Dashboard
      </a>

      {/* Data — collapsible */}
      <div>
        <button
          onClick={() => setDataOpen((v) => !v)}
          style={{
            ...navItemStyle(activePage === "data" && !activeSeasonId),
            justifyContent: "space-between",
          }}
          onMouseEnter={(e) =>
            hoverOn(e, activePage === "data" && !activeSeasonId)
          }
          onMouseLeave={(e) =>
            hoverOff(e, activePage === "data" && !activeSeasonId)
          }
        >
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
          >
            <Database size={14} strokeWidth={2} />
            Data
          </span>
          {dataOpen ? (
            <ChevronDown size={12} strokeWidth={2} />
          ) : (
            <ChevronRight size={12} strokeWidth={2} />
          )}
        </button>

        {dataOpen && (
          <div
            style={{
              background: C.submenuBg,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {seasons.length === 0 ? (
              <div
                style={{
                  padding: "0.5rem 1.25rem 0.5rem 2.5rem",
                  fontSize: "0.6rem",
                  color: C.dimmed,
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "1px",
                  fontWeight: 700,
                }}
              >
                NO SEASONS
              </div>
            ) : (
              seasons.map((s) => {
                const isActive =
                  activePage === "data" && activeSeasonId === s.id;
                return (
                  <a
                    key={s.id}
                    href={`/admin/data/${s.id}`}
                    onClick={(e) => linkClick(e, () => onSelectSeason(s.id))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.5rem 1.25rem 0.5rem 2.5rem",
                      background: isActive ? C.activeBgSoft : "transparent",
                      border: "none",
                      borderLeft: isActive
                        ? `4px solid ${C.yellow}`
                        : "4px solid transparent",
                      color: isActive ? C.yellow : C.muted,
                      fontWeight: isActive ? 900 : 800,
                      fontSize: "0.7rem",
                      letterSpacing: "1.5px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "'Courier New', monospace",
                      textTransform: "uppercase",
                      transition:
                        "color 0.15s, background 0.15s, border-left-color 0.15s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = C.bgHover;
                        e.currentTarget.style.color = C.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = C.muted;
                      }
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        background: s.isActive ? C.cyan : C.dimmed,
                        flexShrink: 0,
                        display: "inline-block",
                        borderRadius: "50%",
                        boxShadow: s.isActive ? `0 0 4px ${C.cyan}` : "none",
                      }}
                    />
                    {s.name}
                  </a>
                );
              })
            )}
            {user?.role === "owner" && (
              <a
                href="/admin/new-season"
                onClick={(e) => linkClick(e, () => onNavigate("newSeason"))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.5rem 1.25rem 0.5rem 2.5rem",
                  background: "transparent",
                  border: "none",
                  borderLeft: "4px solid transparent",
                  color: C.dimmed,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Courier New', monospace",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.cyan;
                  e.currentTarget.style.borderLeftColor = C.cyan;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dimmed;
                  e.currentTarget.style.borderLeftColor = "transparent";
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>＋</span>
                Season Baru
              </a>
            )}
          </div>
        )}
      </div>

      {/* Workers */}
      <a
        href="/admin/workers"
        onClick={(e) => linkClick(e, () => onNavigate("workers"))}
        style={navItemStyle(activePage === "workers")}
        onMouseEnter={(e) => hoverOn(e, activePage === "workers")}
        onMouseLeave={(e) => hoverOff(e, activePage === "workers")}
      >
        <Users size={14} strokeWidth={2} />
        Workers
      </a>
      {/* Analytics — owner only */}
      {user?.role === "owner" && (
        <a
          href="/admin/analytics"
          onClick={(e) => linkClick(e, () => onNavigate("analytics"))}
          style={navItemStyle(activePage === "analytics")}
          onMouseEnter={(e) => hoverOn(e, activePage === "analytics")}
          onMouseLeave={(e) => hoverOff(e, activePage === "analytics")}
        >
          <BarChart2 size={14} strokeWidth={2} />
          Analytics
        </a>
      )}

      {/* Rate Config — owner only */}
      {user?.role === "owner" && (
        <a
          href="/admin/rates"
          onClick={(e) => linkClick(e, () => onNavigate("rates"))}
          style={navItemStyle(activePage === "rates")}
          onMouseEnter={(e) => hoverOn(e, activePage === "rates")}
          onMouseLeave={(e) => hoverOff(e, activePage === "rates")}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Rate Config
        </a>
      )}

      {/* Audit Log — owner only */}
      {user?.role === "owner" && (
        <a
          href="/admin/audit-log"
          onClick={(e) => linkClick(e, () => onNavigate("auditLog"))}
          style={navItemStyle(activePage === "auditLog")}
          onMouseEnter={(e) => hoverOn(e, activePage === "auditLog")}
          onMouseLeave={(e) => hoverOff(e, activePage === "auditLog")}
        >
          <History size={14} strokeWidth={2} />
          Audit Log
        </a>
      )}

      {/* Account — owner only */}
      {user?.role === "owner" && (
        <div>
          <button
            onClick={() => setShowAccountMenu((v) => !v)}
            style={{
              ...navItemStyle(showAccountMenu),
              justifyContent: "space-between",
            }}
            onMouseEnter={(e) => hoverOn(e, showAccountMenu)}
            onMouseLeave={(e) => hoverOff(e, showAccountMenu)}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <Users size={14} strokeWidth={2} />
              Account
            </span>
            {showAccountMenu ? (
              <ChevronDown size={12} strokeWidth={2} />
            ) : (
              <ChevronRight size={12} strokeWidth={2} />
            )}
          </button>

          {showAccountMenu && (
            <div
              style={{
                background: C.submenuBg,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {[
                { label: "Ganti Password", onClick: onOpenChangePw },
                {
                  label: "Kelola Admin",
                  onClick: onOpenManageAdmin,
                  href: "/admin/admins",
                },
              ].map(({ label, onClick, href }) => {
                const Tag = href ? "a" : "button";
                return (
                  <Tag
                    key={label}
                    href={href}
                    onClick={href ? (e) => linkClick(e, onClick) : onClick}
                    style={
                      href
                        ? {
                            ...subNavBtnStyle,
                            textDecoration: "none",
                            display: subNavBtnStyle.display || "block",
                          }
                        : subNavBtnStyle
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = C.text;
                      e.currentTarget.style.background = C.bgHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.muted;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {label}
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default SidebarNav;