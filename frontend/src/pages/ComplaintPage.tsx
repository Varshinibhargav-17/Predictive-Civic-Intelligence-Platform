import React from "react";
import { Link } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm";

const ComplaintPage: React.FC = (): React.JSX.Element => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "1rem", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = "var(--primary)"} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = "var(--text-secondary)"}>
          <span>←</span>
          Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-primary)" }}>
          Report a Civic Issue
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1.125rem" }}>
          Upload an image of the problem and our AI will automatically categorize it for the right department.
        </p>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        <ComplaintForm />
      </div>
    </div>
  );
};

export default ComplaintPage;
