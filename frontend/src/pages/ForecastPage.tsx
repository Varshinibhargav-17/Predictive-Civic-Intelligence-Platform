import React, { useState } from "react";
import { Link } from "react-router-dom";
import ForecastChart from "../components/ForecastChart";

const WARDS = [
    "All Wards", "BTM Layout", "Koramangala", "Indiranagar", "Whitefield",
    "Marathahalli", "Bellandur", "HSR Layout", "Rajajinagar", "JP Nagar",
];

const CATEGORIES = ["All Categories", "Road & Potholes", "Drainage", "Water Supply", "Sanitation", "Electricity"];

const ForecastPage: React.FC = () => {
    const [selectedWard, setSelectedWard] = useState("All Wards");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                    Complaint Forecast
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    7-day predictive analytics powered by Prophet/LSTM time-series models + OpenWeatherMap data.
                </p>
            </div>

            {/* Controls */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Ward:</label>
                    <select className="form-select" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} style={{ width: "auto", height: "38px", fontSize: "0.875rem" }}>
                        {WARDS.map((w) => <option key={w}>{w}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Category:</label>
                    <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: "auto", height: "38px", fontSize: "0.875rem" }}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div
                    style={{
                        marginLeft: "auto",
                        background: "rgba(251,191,36,0.1)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        borderRadius: "var(--radius-md)",
                        padding: "0.5rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span style={{ fontSize: "0.9rem" }}>🌧</span>
                    <div>
                        <div style={{ fontSize: "0.75rem", color: "var(--warning)", fontWeight: "600" }}>Heavy Rain Forecast</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Tue–Thu · Expect surge in Drainage complaints</div>
                    </div>
                </div>
            </div>

            {/* Main forecast chart */}
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
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div className="section-title">
                            <div className="icon" style={{ background: "rgba(99,102,241,0.1)", fontSize: "0.9rem" }}>◈</div>
                            7-Day Prediction — {selectedWard} · {selectedCategory}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>
                            Prophet model · Confidence interval shown
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {[
                            { color: "#3b82f6", label: "Predicted" },
                            { color: "rgba(59,130,246,0.3)", label: "Confidence Band" },
                        ].map((l) => (
                            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                <div style={{ width: "12px", height: "3px", background: l.color, borderRadius: "2px" }} />
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ height: "300px", padding: "1rem" }}>
                    <ForecastChart />
                </div>
            </div>

            {/* Ward-level SLA Tracker + Forecast */}
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
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div className="section-title">
                        <div className="icon" style={{ background: "var(--success-light)", fontSize: "0.85rem" }}>⏱</div>
                        SLA Compliance Tracker — Ward by Ward
                    </div>
                    <button className="btn btn-secondary btn-sm">📊 Full Report</button>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ward</th>
                                <th>Category</th>
                                <th>On-Time %</th>
                                <th>Overdue</th>
                                <th>Avg Days</th>
                                <th>7-Day Forecast</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SLA_DATA.map((row, i) => {
                                const slaColor = row.onTime >= 70 ? "#34d399" : row.onTime >= 50 ? "#fbbf24" : "#f87171";
                                const forecastColor = row.predicted.startsWith("↑") ? "#f87171" : row.predicted.startsWith("↓") ? "#34d399" : "#94a3b8";
                                return (
                                    <tr key={i}>
                                        <td style={{ fontWeight: "600" }}>{row.ward}</td>
                                        <td style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{row.category}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{ flex: 1, height: "6px", background: "var(--bg-elevated)", borderRadius: "9999px", overflow: "hidden", minWidth: "60px" }}>
                                                    <div style={{ width: `${row.onTime}%`, height: "100%", background: slaColor, borderRadius: "9999px" }} />
                                                </div>
                                                <span style={{ fontWeight: "700", color: slaColor, fontSize: "0.875rem", minWidth: "36px" }}>
                                                    {row.onTime}%
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: "600" }}>
                                                {row.overdue}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--text-secondary)" }}>{row.avgDays} days</td>
                                        <td>
                                            <span style={{ color: forecastColor, fontWeight: "600", fontSize: "0.85rem" }}>
                                                {row.predicted}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm">Deploy Team</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Surge Prediction Alert */}
            <div
                style={{
                    background: "rgba(248,113,113,0.05)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ fontSize: "2rem" }}>⚡</div>
                <div>
                    <div style={{ fontWeight: "700", color: "#f87171", fontSize: "1rem", marginBottom: "0.5rem" }}>
                        Predicted Surge Alert — Bellandur + Marathahalli
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        LSTM model detects <strong style={{ color: "var(--text-primary)" }}>heavy rainfall Thursday</strong> will trigger a{" "}
                        <strong style={{ color: "#f87171" }}>+340% spike in drainage complaints</strong> by Friday across these two wards based on historical monsoon pattern matching.
                        Recommend pre-deployment of 3 field teams to Bellandur and 2 to Marathahalli by Wednesday.
                    </p>
                </div>
                <button className="btn btn-danger btn-sm" style={{ whiteSpace: "nowrap", marginTop: "0.25rem" }}>
                    Deploy Alert
                </button>
            </div>
        </div>
    );
};

export default ForecastPage;
