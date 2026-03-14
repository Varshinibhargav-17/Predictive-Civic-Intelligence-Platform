import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  activeView: "authority" | "public";
  onViewChange: (view: "authority" | "public") => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const authorityLinks = [
    { path: "/",         label: "Dashboard",     icon: "⬡" },
    { path: "/triage",   label: "Triage Queue",  icon: "≡" },
    { path: "/forecast", label: "Forecast",      icon: "◈" },
  ];

  const publicLinks = [
    { path: "/",           label: "Inequality Map",  icon: "⬡" },
    { path: "/complaint",  label: "Report Issue",    icon: "+" },
    { path: "/bias",       label: "Bias Scores",     icon: "⚖" },
    { path: "/compare",    label: "Ward Compare",    icon: "⇌" },
    { path: "/investigate",label: "Investigate",     icon: "🔍" },
  ];

  const links = activeView === "authority" ? authorityLinks : publicLinks;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        backgroundColor: scrolled ? "rgba(8, 11, 20, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              fontWeight: "800",
              color: "white",
              fontSize: "1rem",
              fontFamily: "var(--font-display)",
            }}
          >
            N
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              NagaraIQ
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: "600",
                color: "var(--civic-blue-light)",
                background: "var(--primary-light)",
                padding: "0.1rem 0.4rem",
                borderRadius: "4px",
                marginLeft: "0.5rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Beta
            </span>
          </div>
        </Link>

        {/* View Toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "3px",
            gap: "2px",
          }}
        >
          <button
            onClick={() => onViewChange("authority")}
            style={{
              padding: "0.375rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: "600",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeView === "authority"
                ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                : "transparent",
              color: activeView === "authority" ? "white" : "var(--text-secondary)",
              boxShadow: activeView === "authority" ? "0 2px 8px rgba(59,130,246,0.4)" : "none",
            }}
          >
            <span style={{ fontSize: "0.875rem" }}>🏛</span>
            Authority
          </button>
          <button
            onClick={() => onViewChange("public")}
            style={{
              padding: "0.375rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: "600",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeView === "public"
                ? "linear-gradient(135deg, #f87171, #ec4899)"
                : "transparent",
              color: activeView === "public" ? "white" : "var(--text-secondary)",
              boxShadow: activeView === "public" ? "0 2px 8px rgba(248,113,113,0.4)" : "none",
            }}
          >
            <span style={{ fontSize: "0.875rem" }}>🌐</span>
            Public
          </button>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path + link.label}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side: just the live indicator + view switch shortcut */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div
              style={{
                width: "7px",
                height: "7px",
                background: "var(--success)",
                borderRadius: "50%",
                animation: "blink 2s infinite",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>
              Live
            </span>
          </div>

          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />

          {/* Switch view button (no auth needed) */}
          <button
            onClick={() => onViewChange(activeView === "authority" ? "public" : "authority")}
            className="btn btn-primary btn-sm"
            style={{
              background: activeView === "authority"
                ? "linear-gradient(135deg, #f87171, #ec4899)"
                : "linear-gradient(135deg, #3b82f6, #6366f1)",
            }}
          >
            {activeView === "authority" ? (
              <>🌐 Citizen View</>
            ) : (
              <>🏛 Authority View</>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
