import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  activeView: "authority" | "public";
  onViewChange: (view: "authority" | "public") => void;
}

const Layout: React.FC<LayoutProps> = ({ activeView, onViewChange }) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar activeView={activeView} onViewChange={onViewChange} />
      <main style={{ flex: 1 }}>
        <div className="page-content animate-fade-in">
          <Outlet context={{ activeView }} />
        </div>
      </main>
      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-color)",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "0.65rem",
              }}
            >
              N
            </div>
            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              NagaraIQ
            </span>
          </div>
          <span style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>
            Predictive Civic Intelligence Platform — Bengaluru
          </span>
          <span style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
