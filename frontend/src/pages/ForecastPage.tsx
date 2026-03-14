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

            {/* Info Box */}
            <div
                style={{
                    background: "rgba(99,102,241,0.05)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ fontSize: "2rem" }}>💡</div>
                <div>
                    <div style={{ fontWeight: "700", color: var(--text-primary), fontSize: "1rem", marginBottom: "0.5rem" }}>
                        7-Day Forecast — Powered by Prophet + LSTM
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        The forecast above predicts complaint volume for the next 7 days across all wards and categories. Use the filters to focus on specific wards or complaint types. The model learns from historical patterns and external data like weather forecasts to predict surge periods.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForecastPage;
