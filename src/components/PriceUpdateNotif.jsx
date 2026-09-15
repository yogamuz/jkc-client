import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { useDataPageColors, glow } from "../constants/dataPage.constants"; // sesuaikan path
import { useTheme } from "../context/ThemeContext"; // sesuaikan path

const PriceUpdateNotif = ({ entry, onClose }) => {
  const C = useDataPageColors();
  const { theme } = useTheme();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!entry) return null;

  const dateStr = new Date(entry.effectiveDate).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleClose = () => onClose(dontShowAgain);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.75, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}
          style={{
            position: "relative",
            background: `linear-gradient(160deg, ${C.modalBg} 0%, ${C.bg} 100%)`,
            border: `1px solid ${C.border}`,
            borderRadius: "20px",
            padding: "2rem 1.5rem 1.5rem",
            width: "220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Courier New', monospace",
            boxShadow: theme === "light"
              ? "0 14px 30px rgba(0,0,0,0.15), 0 2px 0 rgba(255,255,255,0.6) inset"
              : `0 18px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset, ${glow(theme, `0 0 28px ${C.cyan}25`)}`,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              color: C.muted,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>

          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${C.cyanBg}, transparent 70%), ${C.panel}`,
              border: `1px solid ${C.cyan}50`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: glow(theme, `0 0 16px ${C.cyan}30`),
            }}
          >
            <Bell size={24} strokeWidth={2} color={C.cyan} />
          </div>

          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 900,
              letterSpacing: "0.5px",
              color: C.yellow,
              marginBottom: "6px",
              textAlign: "center",
            }}
          >
            Price Updated!
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: C.muted,
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            {dateStr}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: C.muted,
              fontSize: "0.73rem",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            Jangan tampilkan lagi
          </label>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PriceUpdateNotif;