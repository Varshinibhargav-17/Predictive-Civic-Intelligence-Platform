import React from "react";
import { Link } from "react-router-dom";

const Register: React.FC = (): React.JSX.Element => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏛</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.75rem" }}>
          Officer Registration
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
          Registration for NagaraIQ Authority Portal is by invitation only.<br />
          Contact your BBMP ward supervisor for access credentials.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ justifyContent: "center" }}>
          → Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
