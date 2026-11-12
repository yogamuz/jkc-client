import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("UI crash:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "'Courier New', monospace",
          color: "#FF3CAC",
          fontSize: "0.8rem",
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 900, letterSpacing: "2px" }}>
          ⚠ TERJADI ERROR
        </div>
        <div style={{ marginTop: "0.5rem", wordBreak: "break-word" }}>
          {String(this.state.error?.message || this.state.error)}
        </div>
        <button
          onClick={() => this.setState({ error: null })}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "1px solid #FF3CAC",
            color: "#FF3CAC",
            padding: "0.4rem 1rem",
            fontFamily: "'Courier New', monospace",
            fontWeight: 900,
            letterSpacing: "1.5px",
            cursor: "pointer",
          }}
        >
          COBA LAGI
        </button>
      </div>
    );
  }
}