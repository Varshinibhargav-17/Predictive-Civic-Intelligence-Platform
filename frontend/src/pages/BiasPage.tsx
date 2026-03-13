import React, { useState } from "react";
import { Link } from "react-router-dom";
import BiasTable from "../components/BiasTable";

const BiasPage: React.FC = () => {
    const [sortBy, setSortBy] = useState<"bias" | "days" | "fake">("bias");
    const [filterSig, setFilterSig] = useState(false);

    const sorted = []

    const getBiasColor = (score: number) => {
        if (score >= 60) return "#f87171";
        if (score >= 40) return "#fbbf24";
        if (score >= 20) return "#60a5fa";
        return "#34d399";
    };

    const getTrendIcon = (trend: string) => {
        if (trend === "worsening") return { icon: "↑", color: "#f87171" };
        if (trend === "improving") return { icon: "↓", color: "#34d399" };
        return { icon: "→", color: "#94a3b8" };
    };

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

            {/* Controls + Table */}
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
                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                            <input type="checkbox" checked={filterSig} onChange={(e) => setFilterSig(e.target.checked)} />
                            Statistically significant only
                        </label>
                        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as "bias" | "days" | "fake")} style={{ width: "auto", height: "36px", fontSize: "0.8125rem" }}>
                            <option value="bias">Sort: Bias Score</option>
                            <option value="days">Sort: Avg Resolution Days</option>
                            <option value="fake">Sort: Fake Resolution Rate</option>
                        </select>
                        <Link to="/investigate" className="btn btn-danger btn-sm">🔍 Investigate Top Ward</Link>
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ward</th>
                                <th>Category</th>
                                <th>Bias Score</th>
                                <th>Avg Resolution</th>
                                <th>vs City Avg</th>
                                <th>Fake Rate</th>
                                <th>Trend</th>
                                <th>Significance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((row, i) => {
                                const biasColor = getBiasColor(row.biasScore);
                                const trend = getTrendIcon(row.trend);
                                const multiplier = (row.avgDays / row.cityAvg).toFixed(1);
                                return (
                                    <tr key={row.ward}>
                                        <td style={{ color: "var(--text-tertiary)", fontWeight: "600", fontSize: "0.875rem" }}>{i + 1}</td>
                                        <td>
                                            <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{row.ward}</div>
                                            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Ward {row.wardId} · {row.complaints} complaints</div>
                                        </td>
                                        <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{row.category}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{ width: "50px", height: "6px", background: "var(--bg-elevated)", borderRadius: "9999px", overflow: "hidden" }}>
                                                    <div style={{ width: `${row.biasScore}%`, height: "100%", background: biasColor }} />
                                                </div>
                                                <span style={{ fontWeight: "800", color: biasColor, fontFamily: "var(--font-display)" }}>
                                                    {row.biasScore}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: "600", color: biasColor }}>{row.avgDays} days</td>
                                        <td>
                                            <span style={{ fontWeight: "700", color: "#f87171" }}>{multiplier}×</span>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginLeft: "0.25rem" }}>longer</span>
                                        </td>
                                        <td>
                                            <span style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: "600" }}>
                                                {row.fakeRate}%
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: trend.color, fontWeight: "700", fontSize: "0.875rem" }}>
                                                {trend.icon} {row.trend}
                                            </span>
                                        </td>
                                        <td>
                                            {row.significant ? (
                                                <span style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: "600" }}>
                                                    p &lt; 0.05 ✓
                                                </span>
                                            ) : (
                                                <span style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>Not significant</span>
                                            )}
                                        </td>
                                        <td>
                                            <Link to="/investigate" className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>
                                                Investigate →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Live Bias component */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                }}
            >
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
                    <div className="section-title">
                        <div className="icon" style={{ background: "var(--primary-light)", fontSize: "0.85rem" }}>📡</div>
                        Live API — Backend Bias Data
                    </div>
                </div>
                <div style={{ padding: "1rem" }}>
                    <BiasTable />
                </div>
            </div>
        </div>
    );
};

export default BiasPage;
