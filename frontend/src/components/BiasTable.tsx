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
        setError("Failed to load civic bias data. Is the backend running?");
        // Use dummy data for display purposes if backend is down
        setData([
          { ward_name: "BTM Layout", avg_resolution_days: 53.5, bias_score: 64.2 },
          { ward_name: "Koramangala", avg_resolution_days: 12.1, bias_score: -5.4 },
          { ward_name: "Marathahalli", avg_resolution_days: 41.2, bias_score: 22.1 },
          { ward_name: "Whitefield", avg_resolution_days: 18.5, bias_score: 5.2 },
          { ward_name: "Indiranagar", avg_resolution_days: 10.2, bias_score: -12.5 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading bias data...</div>;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {error && <div style={{ backgroundColor: "var(--danger-light)", color: "var(--danger)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", fontSize: "0.875rem" }}>{error} (Showing mock data)</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            <th style={{ padding: "0.75rem 1rem", fontWeight: "600" }}>Ward Name</th>
            <th style={{ padding: "0.75rem 1rem", fontWeight: "600" }}>Avg Days to Resolve</th>
            <th style={{ padding: "0.75rem 1rem", fontWeight: "600" }}>Bias Score</th>
            <th style={{ padding: "0.75rem 1rem", fontWeight: "600" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: BiasData, index: number) => {
            let scoreColor = "var(--success)";
            let statusBadge = { bg: "var(--success-light)", text: "var(--success)", label: "Low Bias" };
            
            if (row.bias_score > 50) {
              scoreColor = "var(--danger)";
              statusBadge = { bg: "var(--danger-light)", text: "var(--danger)", label: "High Bias" };
            } else if (row.bias_score >= 0) {
              scoreColor = "var(--warning)";
              statusBadge = { bg: "var(--warning-light)", text: "var(--warning-hover)", label: "Moderate" };
            }

            return (
              <tr key={index} style={{ borderBottom: index < data.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                <td style={{ padding: "1rem", fontWeight: "500", color: "var(--text-primary)" }}>{row.ward_name}</td>
                <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{row.avg_resolution_days.toFixed(1)} days</td>
                <td style={{ padding: "1rem", fontWeight: "bold", color: scoreColor }}>{row.bias_score.toFixed(1)}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    backgroundColor: statusBadge.bg, 
                    color: statusBadge.text, 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "9999px", 
                    fontSize: "0.75rem", 
                    fontWeight: "600" 
                  }}>
                    {statusBadge.label}
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
