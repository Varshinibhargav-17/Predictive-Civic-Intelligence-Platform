import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/complaint", label: "Report Issue", icon: "⚠️" },
  ];

  return (
    <nav style={{ 
      backgroundColor: "var(--bg-surface)", 
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-sm)"
    }}>
      <div className="container" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        height: "4rem" 
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            backgroundColor: "var(--primary)", 
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold"
          }}>
            N
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)" }}>
            NagaraIQ
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    fontWeight: "500",
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div style={{ width: "1px", height: "1.5rem", backgroundColor: "var(--border-color)" }}></div>

          <Link to="/login" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🔑</span>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
