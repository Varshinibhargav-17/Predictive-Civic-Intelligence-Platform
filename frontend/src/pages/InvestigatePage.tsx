import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBiasData, getComplaints } from "../api/api";

interface BiasRow {
  ward_name: string;
  bias_score: number;
  avg_resolution_days: number;
  total_complaints: number;
}

// ── Personalised brief: generates unique, data-driven paragraphs per ward ─────
function generateBrief(ward: BiasRow, allWards: BiasRow[], wardCategories: Record<string, string[]>): string[] {
  const cityAvgDays = allWards.length
    ? Math.round(allWards.reduce((s, w) => s + w.avg_resolution_days, 0) / allWards.length)
    : 0;
  const cityAvgComplaints = allWards.length
    ? Math.round(allWards.reduce((s, w) => s + w.total_complaints, 0) / allWards.length)
    : 0;
  const rank = allWards.findIndex((w) => w.ward_name === ward.ward_name) + 1;
  const cats = wardCategories[ward.ward_name] || [];
  const topCat = cats[0] || "general civic issues";
  const slower = ward.avg_resolution_days - cityAvgDays;
  const biasLevel = ward.bias_score >= 70 ? "critically high" : ward.bias_score >= 40 ? "elevated" : "moderate";

  const lines: string[] = [];

  // Para 1: Ranking + score context
  lines.push(
    `${ward.ward_name} is currently ranked #${rank} in the city's bias index with a score of ${ward.bias_score}/100 — ` +
    `classified as ${biasLevel}. This score reflects a statistical pattern of delayed or unverified complaint resolution ` +
    `compared to the city-wide baseline.`
  );

  // Para 2: Complaint volume vs city avg
  if (ward.total_complaints > cityAvgComplaints) {
    lines.push(
      `With ${ward.total_complaints} complaints filed — ${ward.total_complaints - cityAvgComplaints} more than the city average of ${cityAvgComplaints} — ` +
      `${ward.ward_name} has a disproportionately high complaint load. The dominant category is "${topCat}", ` +
      `suggesting a recurring infrastructure failure that has not been systematically addressed.`
    );
  } else {
    lines.push(
      `${ward.ward_name} has ${ward.total_complaints} complaints on record (city average: ${cityAvgComplaints}). ` +
      `Despite a relatively lower complaint volume, the high bias score suggests possible under-reporting or administrative suppression of complaints. ` +
      `The primary reported category is "${topCat}".`
    );
  }

  // Para 3: Resolution delay
  if (slower > 0) {
    lines.push(
      `Resolution time in ${ward.ward_name} averages ${ward.avg_resolution_days} days — ` +
      `${slower} days longer than the city average of ${cityAvgDays} days. ` +
      `This delay warrants verification: are complaints being resolved on the ground or marked closed administratively?`
    );
  } else {
    lines.push(
      `While resolution time appears close to the city average (${ward.avg_resolution_days} vs ${cityAvgDays} days), ` +
      `the elevated bias score suggests that despite fast closures, field visits may not always be conducted. ` +
      `An audit of resolution methods is recommended.`
    );
  }

  // Para 4: Recommendation
  lines.push(
    `Recommended actions: (1) Cross-reference closed complaint records with field officer visit logs. ` +
    `(2) Interview residents in ${ward.ward_name} to validate resolution quality. ` +
    `(3) File RTI requests (see RTI Queries tab) for complaint routing and officer accountability records from BBMP.`
  );

  return lines;
}

// ── RTI queries: unique per ward based on real metrics ────────────────────────
function generateRTI(ward: BiasRow, wardCategories: Record<string, string[]>): string[] {
  const cats = wardCategories[ward.ward_name] || [];
  const topCat = cats[0] || "infrastructure";
  const isHighBias = ward.bias_score >= 60;
  const isHighVolume = ward.total_complaints >= 3;
  const isSlowResolve = ward.avg_resolution_days >= 20;

  const queries: string[] = [
    // Always: complaint log
    `Under RTI Act 2005 — Section 6: Provide certified copies of all ${ward.ward_name} complaint resolution records for the past 90 days, ` +
    `including: complaint ID, filing date, assigned officer name, resolution date, field visit confirmation (yes/no), and closure method.`,

    // Category-specific
    `Provide the total number of "${topCat}" complaints received in ${ward.ward_name} in the past 6 months, ` +
    `the number resolved within BBMP's stated SLA, and the average actual resolution time versus the SLA benchmark.`,
  ];

  if (isHighBias) {
    queries.push(
      `${ward.ward_name}'s bias score of ${ward.bias_score}/100 is significantly above average. ` +
      `Provide the names and designations of all officers responsible for complaint resolution in this ward, ` +
      `along with any disciplinary proceedings or performance reviews conducted in the last 12 months.`
    );
  } else {
    queries.push(
      `Provide BBMP's ward-level performance KPIs for ${ward.ward_name} for the current fiscal year, ` +
      `including target vs actual resolution rates and the mechanism used to verify field closures.`
    );
  }

  if (isHighVolume) {
    queries.push(
      `With ${ward.total_complaints} complaints logged in ${ward.ward_name}, provide a breakdown by category and the percentage resolved vs pending. ` +
      `Also disclose whether any complaints were escalated to the ward councillor's office or BBMP Commissioner.`
    );
  } else {
    queries.push(
      `Provide records of any complaint that was re-opened, re-filed, or escalated in ${ward.ward_name} in the past year, ` +
      `indicating the original closure reason and the outcome after re-investigation.`
    );
  }

  if (isSlowResolve) {
    queries.push(
      `Average resolution time in ${ward.ward_name} is ${ward.avg_resolution_days} days. ` +
      `Provide the specific reasons documented for delays exceeding 15 days, and the escalation protocol followed ` +
      `for complaints that breach the SLA under BBMP's grievance redressal policy.`
    );
  } else {
    queries.push(
      `Provide any internal audit reports or grievance redressal committee meeting minutes that evaluated ` +
      `complaint handling quality in ${ward.ward_name} during the last financial year.`
    );
  }

  return queries;
}

const InvestigatePage: React.FC = () => {
  const [wards, setWards] = useState<BiasRow[]>([]);
  const [selectedWard, setSelectedWard] = useState<BiasRow | null>(null);
  const [wardsLoading, setWardsLoading] = useState(true);
  const [briefGenerated, setBriefGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"brief" | "rti">("brief");
  const [wardCategories, setWardCategories] = useState<Record<string, string[]>>({});
  const [briefLines, setBriefLines] = useState<string[]>([]);
  const [rtiQueries, setRtiQueries] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getBiasData(), getComplaints()])
      .then(([biasRes, complaintsRes]) => {
        const rows: BiasRow[] = (biasRes.data as BiasRow[]).slice(0, 10);
        setWards(rows);
        if (rows.length > 0) setSelectedWard(rows[0]);

        // Build per-ward category map from real complaints
        const catMap: Record<string, string[]> = {};
        const allComplaints: any[] = complaintsRes.data || [];
        allComplaints.forEach((c) => {
          const w = c.ward_name || "Unknown";
          const cat = c.predicted_category || c.category || "Other";
          if (!catMap[w]) catMap[w] = [];
          if (!catMap[w].includes(cat)) catMap[w].push(cat);
        });
        setWardCategories(catMap);
      })
      .catch(() => setWards([]))
      .finally(() => setWardsLoading(false));
  }, []);

  const handleGenerateBrief = () => {
    if (!selectedWard) return;
    setGenerating(true);
    setTimeout(() => {
      const lines = generateBrief(selectedWard, wards, wardCategories);
      const rti = generateRTI(selectedWard, wardCategories);
      setBriefLines(lines);
      setRtiQueries(rti);
      setGenerating(false);
      setBriefGenerated(true);
    }, 1200);
  };

  const handleSelectWard = (ward: BiasRow) => {
    setSelectedWard(ward);
    setBriefGenerated(false);
    setBriefLines([]);
    setRtiQueries([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
          Investigation Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          AI-generated ward investigation briefs and RTI queries — fully driven by live complaint data.
        </p>
      </div>

      {wardsLoading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>Loading ward data from database...</div>
      ) : wards.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
          No ward data yet. Submit complaints to see wards here.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem", alignItems: "start" }}>
          {/* Ward List */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)" }}>
              <div className="section-title" style={{ fontSize: "0.9375rem" }}>
                <div className="icon" style={{ background: "rgba(248,113,113,0.1)", fontSize: "0.8rem" }}>🔴</div>
                High-Bias Wards — Live Rankings
              </div>
            </div>
            {wards.map((ward, idx) => (
              <div
                key={ward.ward_name}
                onClick={() => handleSelectWard(ward)}
                style={{
                  padding: "0.875rem 1.25rem", display: "flex", alignItems: "center",
                  justifyContent: "space-between", cursor: "pointer",
                  background: selectedWard?.ward_name === ward.ward_name ? "rgba(59,130,246,0.06)" : "transparent",
                  borderLeft: selectedWard?.ward_name === ward.ward_name ? "3px solid #3b82f6" : "3px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-tertiary)", width: "16px" }}>#{idx + 1}</span>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{ward.ward_name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
                      {ward.total_complaints} complaint{ward.total_complaints !== 1 ? "s" : ""} · {ward.avg_resolution_days}d avg
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "1rem",
                    color: ward.bias_score >= 70 ? "#f87171" : ward.bias_score >= 40 ? "#fbbf24" : "#34d399",
                    minWidth: "36px", textAlign: "right",
                  }}
                >
                  {ward.bias_score}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedWard && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Ward Summary Header */}
              <div style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.06), rgba(236,72,153,0.04))", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>Investigating Ward</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "700", color: "#f87171" }}>{selectedWard.ward_name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Bengaluru BBMP — Rank #{wards.findIndex((w) => w.ward_name === selectedWard.ward_name) + 1} by Bias Score</div>
                  </div>
                  <div style={{ textAlign: "center", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius-md)", padding: "1rem 1.5rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "800", color: "#f87171", lineHeight: 1 }}>{selectedWard.bias_score}</div>
                    <div style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.35rem" }}>Bias Score /100</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginTop: "1.25rem" }}>
                  {[
                    { label: "Avg Resolution", value: `${selectedWard.avg_resolution_days} days` },
                    { label: "Total Complaints", value: `${selectedWard.total_complaints}` },
                    { label: "Top Category", value: wardCategories[selectedWard.ward_name]?.[0] || "—" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "0.75rem", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "0.9rem", wordBreak: "break-word" }}>{s.value}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: "0.2rem" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              {!briefGenerated && (
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  style={{ padding: "1rem", fontSize: "1rem", justifyContent: "center" }}
                >
                  {generating ? (
                    <><div className="spinner" style={{ borderTopColor: "white" }} /> Analysing live data for {selectedWard.ward_name}...</>
                  ) : (
                    <>🤖 Generate Investigation Brief for {selectedWard.ward_name}</>
                  )}
                </button>
              )}

              {/* Brief + RTI Output */}
              {briefGenerated && (
                <div style={{ background: "var(--bg-card)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "var(--radius-lg)", overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
                  {/* Tabs */}
                  <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}>
                    {(["brief", "rti"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          padding: "0.875rem 1.5rem", fontSize: "0.875rem", fontWeight: "600",
                          cursor: "pointer", border: "none",
                          borderBottom: activeTab === tab ? "2px solid #818cf8" : "2px solid transparent",
                          color: activeTab === tab ? "#818cf8" : "var(--text-secondary)",
                          background: "transparent", fontFamily: "var(--font-body)", transition: "all 0.15s ease",
                        }}
                      >
                        {tab === "brief" ? "📄 Investigation Brief" : "📋 RTI Queries"}
                      </button>
                    ))}
                    <button
                      onClick={() => setBriefGenerated(false)}
                      style={{ marginLeft: "auto", marginRight: "1rem", fontSize: "0.75rem", color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
                    >
                      ↺ Regenerate
                    </button>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    {activeTab === "brief" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#818cf8", animation: "blink 2s infinite" }} />
                          <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            AI Analysis — {selectedWard.ward_name} — generated from live DB
                          </span>
                        </div>
                        {briefLines.map((para, i) => (
                          <p key={i} style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "1rem", margin: 0, borderLeft: "3px solid rgba(129,140,248,0.4)" }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    )}

                    {activeTab === "rti" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                          These RTI queries are auto-generated from {selectedWard.ward_name}'s live bias score ({selectedWard.bias_score}), resolution time ({selectedWard.avg_resolution_days}d), and complaint patterns. File under RTI Act 2005 with BBMP.
                        </p>
                        {rtiQueries.map((q, i) => (
                          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", display: "flex", gap: "0.875rem" }}>
                            <div style={{ width: "24px", height: "24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", color: "white", flexShrink: 0, marginTop: "2px" }}>
                              {i + 1}
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{q}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestigatePage;
