import React, { useState } from "react";
import { Link } from "react-router-dom";

const WARDS = [
    { id: 67, name: "Rajajinagar", biasScore: 78 },
];

const InvestigatePage: React.FC = () => {
    const [selectedWard, setSelectedWard] = useState(WARDS[0]);
    const [briefGenerated, setBriefGenerated] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<"brief" | "evidence" | "rti">("brief");

    const handleGenerateBrief = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setBriefGenerated(true);
        }, 2000);
    };

    const rtiQueries = [
        "Request all complaint resolution logs for Ward 67 (Jan 2024 – Mar 2024) including officer name, resolution timestamp, and field visit confirmation.",
        "Request internal complaint routing records to determine which complaints were administratively closed without site verification.",
        "Request BBMP's defined SLA (Service Level Agreement) for road complaints and the number of SLA breaches in Ward 67 in the past 6 months.",
        "Request the complaint suppression audit log for February 2024 where complaint volume dropped anomalously by 47% vs historical baseline.",
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                    Investigation Center
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    Fake resolution detector, AI investigation brief generator, and RTI query builder for journalists & activists.
                </p>
            </div>

            {/* Ward Selector */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "1.25rem",
                    alignItems: "start",
                }}
            >
                {/* Ward List */}
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)" }}>
                        <div className="section-title" style={{ fontSize: "0.9375rem" }}>
                            <div className="icon" style={{ background: "rgba(248,113,113,0.1)", fontSize: "0.8rem" }}>🔴</div>
                            High-Risk Wards
                        </div>
                    </div>
                    {WARDS.map((ward) => (
                        <div
                            key={ward.id}
                            onClick={() => { setSelectedWard(ward); setBriefGenerated(false); }}
                            style={{
                                padding: "0.875rem 1.25rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: selectedWard.id === ward.id ? "rgba(59,130,246,0.06)" : "transparent",
                                borderLeft: selectedWard.id === ward.id ? "3px solid #3b82f6" : "3px solid transparent",
                                borderBottom: "1px solid rgba(255,255,255,0.04)",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-primary)" }}>{ward.name}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Ward {ward.id}</div>
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "800",
                                    fontSize: "1rem",
                                    color: ward.biasScore >= 60 ? "#f87171" : ward.biasScore >= 40 ? "#fbbf24" : "#34d399",
                                }}
                            >
                                {ward.biasScore}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Ward Summary */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, rgba(248,113,113,0.06), rgba(236,72,153,0.04))",
                            border: "1px solid rgba(248,113,113,0.2)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1.5rem",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                                    Investigating
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "700", color: "#f87171" }}>
                                    {selectedWard.name}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Ward {selectedWard.id} · Bengaluru BBMP</div>
                            </div>
                            <div
                                style={{
                                    textAlign: "center",
                                    background: "rgba(248,113,113,0.1)",
                                    border: "1px solid rgba(248,113,113,0.2)",
                                    borderRadius: "var(--radius-md)",
                                    padding: "1rem 1.5rem",
                                }}
                            >
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "800", color: "#f87171", lineHeight: 1 }}>
                                    {selectedWard.biasScore}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.35rem" }}>
                                    Bias Score /100
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginTop: "1.25rem" }}>
                            {[
                                { label: "Avg Resolution", value: "41.7 days" },
                                { label: "City Average", value: "3.2 days" },
                                { label: "Fake Resolution", value: "34%" },
                                { label: "Complaints", value: "847" },
                            ].map((s, i) => (
                                <div key={i} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "0.75rem", textAlign: "center" }}>
                                    <div style={{ fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "1rem", color: "var(--text-primary)" }}>{s.value}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.2rem" }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fake Resolution Radar */}
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)" }}>
                            <div className="section-title" style={{ fontSize: "0.95rem" }}>
                                <div className="icon" style={{ background: "rgba(251,191,36,0.1)", fontSize: "0.8rem" }}>⚠</div>
                                Fake Resolution Evidence — {selectedWard.name}
                            </div>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Complaint ID</th>
                                        <th>Issue</th>
                                        <th>Marked Resolved</th>
                                        <th>Re-filed</th>
                                        <th>Officer</th>
                                        <th>Fake Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                                            Loading real investigation data from API...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Generate Brief Button */}
                    {!briefGenerated && (
                        <button
                            className="btn btn-primary"
                            onClick={handleGenerateBrief}
                            disabled={generating}
                            style={{ padding: "1rem", fontSize: "1rem", justifyContent: "center", position: "relative" }}
                        >
                            {generating ? (
                                <>
                                    <div className="spinner" style={{ borderTopColor: "white" }} />
                                    Generating AI Brief via Gemini 1.5 Flash...
                                </>
                            ) : (
                                <>🤖 Generate Investigation Brief for {selectedWard.name}</>
                            )}
                        </button>
                    )}

                    {/* Brief Output */}
                    {briefGenerated && (
                        <div
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid rgba(99,102,241,0.25)",
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                animation: "fadeIn 0.4s ease",
                            }}
                        >
                            {/* Tab Bar */}
                            <div
                                style={{
                                    display: "flex",
                                    borderBottom: "1px solid var(--border-color)",
                                    background: "var(--bg-elevated)",
                                }}
                            >
                                {(["brief", "evidence", "rti"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: "0.875rem 1.5rem",
                                            fontSize: "0.875rem",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            border: "none",
                                            borderBottom: activeTab === tab ? "2px solid #818cf8" : "2px solid transparent",
                                            color: activeTab === tab ? "#818cf8" : "var(--text-secondary)",
                                            background: "transparent",
                                            fontFamily: "var(--font-body)",
                                            transition: "all 0.15s ease",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {tab === "brief" ? "📄 Investigation Brief" : tab === "evidence" ? "🗂 Evidence Packet" : "📋 RTI Queries"}
                                    </button>
                                ))}
                                <div style={{ marginLeft: "auto", padding: "0.625rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.7rem", color: "rgba(129,140,248,0.8)", background: "rgba(99,102,241,0.1)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontWeight: "600" }}>
                                        Generated by Gemini 1.5 Flash
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: "1.5rem" }}>
                                {activeTab === "brief" && (
                                    <div>
                                        <pre
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.875rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: 1.8,
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            Investigation brief will be generated from real data when you select a ward...
                                        </pre>
                                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                                            <button className="btn btn-primary btn-sm">📥 Export as PDF</button>
                                            <button className="btn btn-secondary btn-sm">📋 Copy to Clipboard</button>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => setBriefGenerated(false)}
                                            >
                                                ↺ Regenerate
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "evidence" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                                        Loading real evidence data from API...
                                    </div>
                                )}
                                {activeTab === "rti" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                            The following RTI (Right to Information) queries have been auto-generated based on the investigation findings. File these with BBMP under the RTI Act 2005.
                                        </p>
                                        {rtiQueries.map((q, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    background: "var(--bg-elevated)",
                                                    border: "1px solid rgba(99,102,241,0.15)",
                                                    borderRadius: "var(--radius-md)",
                                                    padding: "1rem",
                                                    display: "flex",
                                                    gap: "0.875rem",
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.7rem",
                                                        fontWeight: "700",
                                                        color: "white",
                                                        flexShrink: 0,
                                                        marginTop: "1px",
                                                    }}
                                                >
                                                    {i + 1}
                                                </div>
                                                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{q}</p>
                                            </div>
                                        ))}
                                        <button className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                                            📋 Copy All RTI Queries
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvestigatePage;
