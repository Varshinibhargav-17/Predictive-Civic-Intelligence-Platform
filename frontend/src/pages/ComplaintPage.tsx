import React from "react";
import { Link } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm";

const ComplaintPage: React.FC = (): React.JSX.Element => {
  return (
    <div style={{ maxWidth: "840px", margin: "0 auto" }}>
      {/* Back nav */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          color: "var(--text-secondary)",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--civic-blue-light)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
      >
        ← Back to Dashboard
      </Link>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(99,102,241,0.04))",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem 2.5rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-60px",
            top: "-60px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
            }}
          >
            🚨
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.875rem",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Report a Civic Issue
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
              Upload a photo of the problem and our AI (distilBERT) will automatically classify it, assign urgency, and route it to the right department.
            </p>
          </div>
        </div>

        {/* AI feature badges */}
        <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          {[
            { icon: "🤖", label: "AI Classification" },
            { icon: "⚡", label: "Auto Urgency Score" },
            { icon: "🏛", label: "Department Routing" },
            { icon: "📍", label: "Location Extraction" },
          ].map((badge) => (
            <span
              key={badge.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "var(--civic-blue-light)",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              <span>{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
        }}
      >
        <ComplaintForm />
      </div>
    </div>
  );
};

export default ComplaintPage;
