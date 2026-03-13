import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getForecast } from "../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastData {
  ds: string;
  yhat: number;
}

const ForecastChart: React.FC = () => {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await getForecast();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setError("Failed to load forecast data.");
        // Mock data if backend is down
        const mock: ForecastData[] = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          
          mock.push({
            ds: d.toISOString().split("T")[0],
            yhat: Math.max(5, Math.floor(Math.random() * 25) + 10)
          });
        }
        setData(mock);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>Loading forecast...</div>;

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.ds);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: "Predicted Complaints",
        data: data.map(d => d.yhat),
        borderColor: "rgb(59, 130, 246)", // var(--primary)
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
        fill: true,
        tension: 0.4 // Smooth curve
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // var(--text-primary)
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 14, weight: "bold" as const },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `Predicted: ${context.parsed.y.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#94a3b8" // var(--text-tertiary)
        }
      },
      y: {
        grid: {
          color: "#f1f5f9", // var(--bg-surface-hover)
          drawBorder: false
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#94a3b8" // var(--text-tertiary)
        },
        beginAtZero: true
      }
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "0.5rem" }}>
      {error && <div style={{ fontSize: "0.75rem", color: "var(--danger)", marginBottom: "0.5rem", textAlign: "center" }}>Preview Mode (Backend Disconnected)</div>}
      <div style={{ position: "relative", height: error ? "calc(100% - 24px)" : "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ForecastChart;
