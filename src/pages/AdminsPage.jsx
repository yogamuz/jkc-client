import { useState, useEffect } from "react";
import CircuitBg from "../components/ui/CircuitBg";
import CornerGlow from "../components/ui/CornerGlow";
import AdminsTable from "../components/DataPages/AdminsTable.jsx";
import AdminDetailPanel from "../components/DataPages/AdminDetailPanel";
import { getUsers, createUser } from "../services/authService";
import { C } from "../components/DataPages/workers.utils";

const inputStyle = {
  padding: "0.6rem 0.875rem",
  background: "#0A0A0C",
  border: `1px solid #2A2A2E`,
  color: "#E8E8E8",
  fontFamily: "'Courier New', monospace",
  fontSize: "0.78rem",
  outline: "none",
  letterSpacing: "1px",
  width: "160px",
  boxSizing: "border-box",
};

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Create admin form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setAdmins(data.users.filter((u) => u.role === "admin"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async () => {
    setCreateError("");
    setCreateSuccess("");
    if (!newUsername || !newPassword)
      return setCreateError("Semua field wajib diisi.");
    if (newPassword.length < 6)
      return setCreateError("Password minimal 6 karakter.");
    setCreateLoading(true);
    try {
      await createUser({ username: newUsername, password: newPassword });
      setCreateSuccess(`Akun "${newUsername}" berhasil dibuat.`);
      setNewUsername("");
      setNewPassword("");
      fetchAdmins();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  if (selectedAdmin) {
    return (
      <AdminDetailPanel
        admin={selectedAdmin}
        onBack={() => setSelectedAdmin(null)}
        onDeleted={() => {
          setSelectedAdmin(null);
          fetchAdmins();
        }}
      />
    );
  }

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
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "4px",
              color: C.muted,
              fontFamily: "'Courier New', monospace",
              marginBottom: "4px",
            }}
          >
            // ACCOUNT
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 4rem)",
              fontWeight: 900,
              color: C.yellow,
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
              lineHeight: 0.9,
              textShadow: `0 0 40px ${C.yellow}60`,
            }}
          >
            Admins
          </h1>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: C.yellow,
              marginTop: "10px",
              boxShadow: `0 0 10px ${C.yellow}`,
            }}
          />
        </div>
      </div>

      {/* Create Admin form */}
      <div
        style={{
          border: `1px solid ${C.border}`,
          background: "#131318",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.58rem",
            fontWeight: 900,
            letterSpacing: "3px",
            color: C.cyan,
            fontFamily: "'Courier New', monospace",
            marginBottom: "0.875rem",
          }}
        >
          // BUAT AKUN ADMIN
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password (min. 6)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            style={inputStyle}
          />
          <button
            onClick={handleCreate}
            disabled={createLoading}
            style={{
              background: createLoading ? "transparent" : C.yellow,
              border: `1px solid ${createLoading ? C.muted : C.yellow}`,
              color: createLoading ? C.muted : "#000",
              padding: "0.6rem 1.25rem",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              cursor: createLoading ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              boxShadow: createLoading ? "none" : `0 0 14px ${C.yellow}40`,
            }}
          >
            {createLoading ? "..." : "+ TAMBAH"}
          </button>
        </div>
        {createError && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.62rem",
              color: "#ff6b6b",
              fontFamily: "monospace",
              letterSpacing: "1px",
            }}
          >
            ⚠ {createError}
          </div>
        )}
        {createSuccess && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.62rem",
              color: C.cyan,
              fontFamily: "monospace",
              letterSpacing: "1px",
            }}
          >
            ✓ {createSuccess}
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            background: "rgba(255,60,172,0.06)",
            border: `1px solid ${C.magenta}`,
            padding: "0.75rem 1.25rem",
            color: C.magenta,
            fontWeight: 900,
            fontSize: "0.85rem",
            marginBottom: "1.25rem",
            fontFamily: "'Courier New', monospace",
            position: "relative",
            zIndex: 1,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <AdminsTable
        admins={admins}
        loading={loading}
        onSelectAdmin={setSelectedAdmin}
      />
    </div>
  );
};

export default AdminsPage;