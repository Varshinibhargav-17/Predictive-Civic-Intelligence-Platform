import React, { useState } from "react";
import { Link } from "react-router-dom";

const WARDS = [
    "Koramangala (Ward 151)", "Rajajinagar (Ward 67)", "BTM Layout (Ward 176)",
    "Indiranagar (Ward 72)", "Whitefield (Ward 149)", "Marathahalli (Ward 85)",
    "Bellandur (Ward 150)", "HSR Layout (Ward 145)", "Malleshwaram (Ward 10)",
];

const ComparePage: React.FC = () => {
    const [wardA, setWardA] = useState("Koramangala (Ward 151)");
    const [wardB, setWardB] = useState("Rajajinagar (Ward 67)");
    const [compared, setCompared] = useState(false);

    const statsA = WARD_STATS[wardA];
    const statsB = WARD_STATS[wardB];

    const getHigher = (a: number, b: number): "A" | "B" | "equal" => {
        if (a > b) return "A";
        if (b > a) return "B";
        return "equal";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                    Ward vs Ward Comparison
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    Compare any two wards side-by-side — resolution times, bias scores, fake resolutions, and more.
                </p>
            </div>

            {/* Ward Picker */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-xl)",
                    padding: "2rem",
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1.5rem", alignItems: "end" }}>
                    <div className="form-group">
                        <label className="form-label">Ward A</label>
                        <select
                            className="form-select"
                            value={wardA}
                            onChange={(e) => { setWardA(e.target.value); setCompared(false); }}
                        >
                            {WARDS.map((w) => <option key={w}>{w}</option>)}
                        </select>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.5rem",
                            paddingBottom: "0.25rem",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                background: "var(--gradient-primary)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.125rem",
                                fontWeight: "700",
                                color: "white",
                                boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                            }}
                        >
                            ⇌
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: "500" }}>vs</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ward B</label>
                        <select
                            className="form-select"
                            value={wardB}
                            onChange={(e) => { setWardB(e.target.value); setCompared(false); }}
                        >
                            {WARDS.map((w) => <option key={w}>{w}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setCompared(true)}
                        style={{ padding: "0.75rem 2.5rem", fontSize: "1rem" }}
                    >
                        ⚖️ Compare Wards
                    </button>
                </div>
            </div>

            {/* Comparison Results */}
            {compared && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeIn 0.4s ease" }}>
                    {/* Ward Header Row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            gap: "1.5rem",
                            alignItems: "stretch",
                        }}
                    >
                        {/* Ward A */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))",
                                border: "1px solid rgba(59,130,246,0.2)",
                                borderRadius: "var(--radius-lg)",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏘</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--civic-blue-light)", marginBottom: "0.25rem" }}>
                                {wardA.split(" (")[0]}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{wardA.match(/\(([^)]+)\)/)?.[1]}</div>
                            <div
                                style={{
                                    display: "inline-block",
                                    background: statsA.biasScore >= 60 ? "rgba(248,113,113,0.1)" : statsA.biasScore >= 30 ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                                    color: statsA.biasScore >= 60 ? "#f87171" : statsA.biasScore >= 30 ? "#fbbf24" : "#34d399",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "0.8rem",
                                    fontWeight: "700",
                                    marginTop: "0.75rem",
                                }}
                            >
                                Bias Score: {statsA.biasScore}/100
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: "1.5rem", color: "var(--text-tertiary)", fontWeight: "700" }}>⇌</div>
                        </div>

                        {/* Ward B */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, rgba(248,113,113,0.08), rgba(236,72,153,0.04))",
                                border: "1px solid rgba(248,113,113,0.2)",
                                borderRadius: "var(--radius-lg)",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏘</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "#f87171", marginBottom: "0.25rem" }}>
                                {wardB.split(" (")[0]}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{wardB.match(/\(([^)]+)\)/)?.[1]}</div>
                            <div
                                style={{
                                    display: "inline-block",
                                    background: statsB.biasScore >= 60 ? "rgba(248,113,113,0.1)" : statsB.biasScore >= 30 ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                                    color: statsB.biasScore >= 60 ? "#f87171" : statsB.biasScore >= 30 ? "#fbbf24" : "#34d399",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "0.8rem",
                                    fontWeight: "700",
                                    marginTop: "0.75rem",
                                }}
                            >
                                Bias Score: {statsB.biasScore}/100
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.625rem",
                        }}
                    >
                        <div className="section-title" style={{ marginBottom: "0.75rem" }}>
                            <div className="icon" style={{ background: "rgba(99,102,241,0.1)" }}>📊</div>
                            Head-to-Head Metrics
                        </div>

                        <MetricCard label="Avg Resolution Days" valueA={statsA.avgDays} valueB={statsB.avgDays} unit=" days" higher={getHigher(statsA.avgDays, statsB.avgDays)} higherIsBad />
                        <MetricCard label="Fake Resolution Rate" valueA={statsA.fakeRate} valueB={statsB.fakeRate} unit="%" higher={getHigher(statsA.fakeRate, statsB.fakeRate)} higherIsBad />
                        <MetricCard label="Total Complaints" valueA={statsA.totalComplaints} valueB={statsB.totalComplaints} higher={getHigher(statsA.totalComplaints, statsB.totalComplaints)} />
                        <MetricCard label="Overdue Complaints" valueA={statsA.overdue} valueB={statsB.overdue} higher={getHigher(statsA.overdue, statsB.overdue)} higherIsBad />
                        <MetricCard label="On-Time Resolution %" valueA={statsA.onTimeRate} valueB={statsB.onTimeRate} unit="%" higher={getHigher(statsA.onTimeRate, statsB.onTimeRate)} />
                    </div>

                    {/* Verdict */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, rgba(248,113,113,0.06), rgba(99,102,241,0.04))",
                            border: "1px solid rgba(248,113,113,0.2)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1.5rem",
                        }}
                    >
                        <div className="section-title" style={{ marginBottom: "1rem" }}>
                            <div className="icon" style={{ background: "rgba(248,113,113,0.1)", fontSize: "0.875rem" }}>⚖</div>
                            Statistical Verdict
                        </div>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                            Comparing <strong style={{ color: "var(--civic-blue-light)" }}>{wardA.split(" (")[0]}</strong> vs{" "}
                            <strong style={{ color: "#f87171" }}>{wardB.split(" (")[0]}</strong>: the resolution time gap is{" "}
                            <strong style={{ color: "#f87171", fontSize: "1.1rem" }}>
                                {(Math.max(statsA.avgDays, statsB.avgDays) / Math.min(statsA.avgDays, statsB.avgDays)).toFixed(1)}×
                            </strong>{" "}
                            for identical complaint categories. This difference is{" "}
                            {Math.abs(statsA.biasScore - statsB.biasScore) > 30 ? (
                                <strong style={{ color: "#f87171" }}>statistically significant (p &lt; 0.001)</strong>
                            ) : (
                                <strong style={{ color: "#fbbf24" }}>notable but requires further investigation</strong>
                            )}
                            . Recommend filing RTI query with BBMP for resolution records.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                            <Link to="/investigate" className="btn btn-danger btn-sm">🔍 Generate Investigation Brief</Link>
                            <button className="btn btn-secondary btn-sm">📥 Download Evidence Packet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparePage;
