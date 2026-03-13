import React from "react";
import { Link } from "react-router-dom";
import HotspotMap from "../components/HotspotMap";
import ForecastChart from "../components/ForecastChart";
import BiasTable from "../components/BiasTable";

const Dashboard: React.FC = (): React.JSX.Element => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
            Civic Intelligence Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Real-time analytics and predictive insights for Bengaluru.
          </p>
        </div>
        <Link to="/complaint" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem" }}>
          <span style={{ fontSize: "1.25rem" }}>🚨</span>
          Report Issue
        </Link>
      </div>

      {/* Stats row placeholder */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        {[
          { label: "Total Complaints", value: "1,248", icon: "📈", color: "var(--primary)" },
          { label: "Pending Resolution", value: "342", icon: "⚡", color: "var(--warning)" },
          { label: "Resolved this Month", value: "856", icon: "✅", color: "var(--success)" },
          { label: "Critical Priority", value: "24", icon: "🚨", color: "var(--danger)" },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
            <div style={{ 
              width: "48px", height: "48px", 
              borderRadius: "50%", 
              backgroundColor: `${stat.color}15`, 
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)" }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Map Placeholder */}
        <div className="card" style={{ minHeight: "500px", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            Complaint Hotspots
          </h2>
          <div style={{ flex: 1, backgroundColor: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border-color)", overflow: "hidden" }}>
            <HotspotMap />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Chart Placeholder */}
          <div className="card" style={{ height: "250px", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
              Complaint Forecast
            </h2>
            <div style={{ flex: 1, backgroundColor: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border-color)" }}>
              <ForecastChart />
            </div>
          </div>

          {/* Table Placeholder */}
          <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
              Civic Bias Detection
            </h2>
            <div style={{ flex: 1, backgroundColor: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border-color)", overflow: "hidden" }}>
              <BiasTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
