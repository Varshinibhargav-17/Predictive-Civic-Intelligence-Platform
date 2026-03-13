import React, { useEffect, useState } from "react";
import { getBiasData } from "../api/api";

interface BiasData {
  ward_name: string;
  avg_resolution_days: number;
  bias_score: number;
}

const BiasTable: React.FC = () => {
  const [data, setData] = useState<BiasData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBiasData();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bias data:", err);
        setError("Backend offline — showing demo data");
        setData([
          { ward_name: "Rajajinagar", avg_resolution_days: 41.7, bias_score: 78 },
          { ward_name: "BTM Layout", avg_resolution_days: 21.3, bias_score: 64 },
          { ward_name: "Marathahalli", avg_resolution_days: 14.5, bias_score: 52 },
          { ward_name: "Whitefield", avg_resolution_days: 5.2, bias_score: 24 },
          { ward_name: "Koramangala", avg_resolution_days: 3.2, bias_score: 8 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "40px", borderRadius: "8px" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {error && (
        <div
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(251,191,36,0.08)",
            borderBottom: "1px solid rgba(251,191,36,0.15)",
            fontSize: "0.75rem",
            color: "var(--warning)",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          ⚠ {error}
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            {["Ward", "Avg Days", "Bias", "Level"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "0.625rem 1rem",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "left",
                  background: "var(--bg-elevated)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: BiasData, index: number) => {
            const biasColor =
              row.bias_score >= 60 ? "#f87171"
                : row.bias_score >= 30 ? "#fbbf24"
                  : "#34d399";
            const biasLabel =
              row.bias_score >= 60 ? "High"
                : row.bias_score >= 30 ? "Moderate"
                  : "Low";

            return (
              <tr
                key={index}
                style={{
                  borderBottom: index < data.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.75rem 1rem", fontWeight: "600", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  {row.ward_name}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {row.avg_resolution_days.toFixed(1)}d
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: "32px", height: "3px", background: "var(--bg-elevated)", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.abs(row.bias_score))}%`, height: "100%", background: biasColor }} />
                    </div>
                    <span style={{ fontWeight: "700", color: biasColor, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>
                      {row.bias_score.toFixed(0)}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      background: `${biasColor}15`,
                      color: biasColor,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                    }}
                  >
                    {biasLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BiasTable;
