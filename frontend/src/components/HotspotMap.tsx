import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getHotspots } from "../api/api";
import type { FeatureCollection, Feature, Geometry } from "geojson";

// Helper: force map to recalculate its dimensions after render
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
};

interface Hotspot {
  ward_name: string;
  ward_id: number;
  cluster_id: number;
  complaint_count: number;
  lat: number;
  lng: number;
}

const CLUSTER_COLORS: Record<number, { fill: string; stroke: string; label: string }> = {
  1: { fill: "#f87171", stroke: "#ef4444", label: "🔴 High-Density Hotspot" },
  2: { fill: "#fbbf24", stroke: "#f59e0b", label: "🟡 Active Cluster" },
  3: { fill: "#34d399", stroke: "#10b981", label: "🟢 Normal Activity" },
};

const HotspotMap: React.FC = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Load ward boundary outlines (for subtle city shape)
      try {
        const geoResponse = await fetch("/bengaluru_wards.geojson");
        if (geoResponse.ok) {
          setGeoData(await geoResponse.json());
        }
      } catch {
        // GeoJSON is optional — markers still work
      }

      // Load real hotspot data with lat/lng
      try {
        const res = await getHotspots();
        const data: Hotspot[] = res.data;
        if (data && data.length > 0) {
          setHotspots(data);
          setIsLive(true);
        } else {
          setIsLive(false);
          setHotspots([]);
        }
      } catch {
        setIsLive(false);
        setHotspots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-secondary)", background: "var(--bg-elevated)" }}>
        <div className="spinner" />
        <span style={{ fontSize: "0.875rem" }}>Loading Bengaluru map...</span>
      </div>
    );
  }

  // Subtle boundary style for all ward polygons
  const boundaryStyle = (_feature?: Feature<Geometry, Record<string, unknown>>) => ({
    fillColor: "#1e293b",
    weight: 0.6,
    opacity: 0.5,
    color: "rgba(59,130,246,0.25)",
    fillOpacity: 0.12,
  });

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", borderRadius: "inherit", overflow: "hidden" }}>
      {/* Live / Demo badge */}
      <div
        style={{
          position: "absolute", top: "10px", left: "10px", zIndex: 1000,
          background: "rgba(13,18,32,0.88)", border: `1px solid ${isLive ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`,
          padding: "0.3rem 0.7rem", borderRadius: "var(--radius-md)", fontSize: "0.68rem",
          color: isLive ? "#34d399" : "#fbbf24", backdropFilter: "blur(8px)", fontWeight: "600",
        }}
      >
        {isLive ? "● Live Hotspot Data" : "⚡ No complaint data yet"}
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute", bottom: "12px", right: "10px", zIndex: 1000,
          background: "rgba(13,18,32,0.88)", border: "1px solid rgba(255,255,255,0.08)",
          padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.68rem",
          color: "var(--text-secondary)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", gap: "4px",
        }}
      >
        {Object.values(CLUSTER_COLORS).map((c) => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.fill, border: `1.5px solid ${c.stroke}` }} />
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Subtle ward boundary outlines */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={boundaryStyle}
          />
        )}

        {/* Hotspot Circle Markers plotted by real lat/lng */}
        {hotspots.map((h) => {
          const clr = CLUSTER_COLORS[h.cluster_id] || CLUSTER_COLORS[3];
          const radius = h.cluster_id === 1 ? 14 : h.cluster_id === 2 ? 10 : 7;
          return (
            <CircleMarker
              key={h.ward_name}
              center={[h.lat, h.lng]}
              radius={radius}
              pathOptions={{
                fillColor: clr.fill,
                color: clr.stroke,
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.75,
              }}
            >
              <Popup>
                <div style={{ fontFamily: "'Inter', sans-serif", minWidth: "160px", background: "#0d1220", color: "#f1f5f9", padding: "2px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "6px", color: "#f1f5f9" }}>{h.ward_name}</div>
                  <div style={{ color: clr.fill, fontWeight: 600, fontSize: "11px", marginBottom: "4px" }}>{clr.label}</div>
                  <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                    📋 {h.complaint_count} complaint{h.complaint_count !== 1 ? "s" : ""}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <MapResizer />
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
