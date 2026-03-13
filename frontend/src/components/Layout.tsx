import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = (): React.JSX.Element => {
  return (
    <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="main-content container" style={{ flex: 1, padding: "2rem 1.5rem" }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: "var(--bg-surface)", padding: "1.5rem", textAlign: "center", borderTop: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
        &copy; {new Date().getFullYear()} NagaraIQ. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
