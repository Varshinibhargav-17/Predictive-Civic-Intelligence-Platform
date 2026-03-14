import React, { useState } from "react";
import { Link } from "react-router-dom";
import BiasTable from "../components/BiasTable";

const BiasPage: React.FC = () => {



    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                    Resolution Bias Detector
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    Statistical analysis of resolution time inequality across all 198 Bengaluru wards. Powered by scipy Mann-Whitney U tests.
                </p>
            </div>

            {/* Insight cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[
                    {
                        icon: "⚖️",
                        title: "Worst Bias Gap",
                        value: "13.1×",
                        sub: "Rajajinagar vs Koramangala — identical road complaints",
                        color: "#f87171",
                        gradient: "linear-gradient(135deg, rgba(248,113,113,0.1), rgba(236,72,153,0.06))",
                    },
                    {
                        icon: "📊",
                        title: "Statistically Significant",
                        value: "47 wards",
                        sub: "p < 0.05 — bias is not random variation",
                        color: "#fbbf24",
                        gradient: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(249,115,22,0.06))",
                    },
                    {
                        icon: "🔴",
                        title: "City Avg Resolution",
                        value: "3.2 days",
                        sub: "vs 41.7 days in worst ward — 1200% gap",
                        color: "#34d399",
                        gradient: "linear-gradient(135deg, rgba(52,211,153,0.1), rgba(20,184,166,0.06))",
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        className="stat-card"
                        style={{ background: card.gradient, borderColor: `${card.color}30` }}
                    >
                        <div style={{ fontSize: "1.5rem" }}>{card.icon}</div>
                        <div className="stat-value" style={{ color: card.color, fontSize: "1.75rem" }}>{card.value}</div>
                        <div className="stat-label">{card.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Bias Rankings Table */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                    }}
                >
                    <div className="section-title">
                        <div className="icon" style={{ background: "rgba(248,113,113,0.1)", fontSize: "0.85rem" }}>⚖</div>
                        Bias Rankings — All Monitored Wards
                    </div>
                    <Link to="/investigate" className="btn btn-danger btn-sm">🔍 Investigate Top Ward</Link>
                </div>

                <div style={{ padding: "1rem" }}>
                    <BiasTable />
            </div>
        </div>
    );
};

export default BiasPage;
