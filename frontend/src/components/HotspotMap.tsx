import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getHotspots } from "../api/api";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import L from "leaflet";

// Helper component to resize map on load
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 150);
  }, [map]);
  return null;
};

interface Hotspot {
  ward_name: string;
  ward_id: number;
  cluster_id: number;
}

const HotspotMap: React.FC = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const geoResponse = await fetch("/bengaluru_wards.geojson");
        if (!geoResponse.ok) throw new Error("Could not load map data");
        const json = await geoResponse.json();
        setGeoData(json);

        try {
          const hotspotResponse = await getHotspots();
          setHotspots(hotspotResponse.data);
          setError(null);
        } catch {
          setError("Demo mode — live hotspot data unavailable");
          setHotspots([
            { ward_name: "BTM Layout", ward_id: 176, cluster_id: 1 },
            { ward_name: "Marathahalli", ward_id: 85, cluster_id: 1 },
            { ward_name: "Bellandur", ward_id: 150, cluster_id: 2 },
            { ward_name: "Bommanahalli", ward_id: 148, cluster_id: 1 },
            { ward_name: "Rajajinagar", ward_id: 67, cluster_id: 2 },
          ]);
        }
      } catch (err) {
        console.error("Error loading map:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: "var(--text-secondary)",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div className="spinner" />
        <span style={{ fontSize: "0.875rem" }}>Loading Bengaluru map...</span>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "0.5rem",
          color: "var(--danger)",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
        <span style={{ fontSize: "0.875rem" }}>Failed to load ward boundaries</span>
      </div>
    );
  }

  const styleFeature = (feature?: Feature<Geometry, Record<string, unknown>>) => {
    if (!feature) return {};
    const wardName = (feature.properties?.KGISWardNa || feature.properties?.WARD_NAME || feature.properties?.name) as string | undefined;
    const hotspot = hotspots.find((h) => h.ward_name.toLowerCase() === wardName?.toLowerCase());

    if (hotspot) {
      const isHighSeverity = hotspot.cluster_id === 1;
      return {
        fillColor: isHighSeverity ? "#f87171" : "#fbbf24",
        weight: 1.5,
        opacity: 1,
        color: isHighSeverity ? "#ef4444" : "#f59e0b",
        fillOpacity: 0.55,
      };
    }

    return {
      fillColor: "#3b82f6",
      weight: 0.5,
      opacity: 0.8,
      color: "rgba(59,130,246,0.4)",
      fillOpacity: 0.08,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, Record<string, unknown>>, layer: L.Layer) => {
    if (feature.properties) {
      const wardName = (feature.properties.KGISWardNa || feature.properties.WARD_NAME || feature.properties.name || "Unknown Ward") as string;
      const hotspot = hotspots.find((h) => h.ward_name.toLowerCase() === wardName.toLowerCase());

      const isHigh = hotspot?.cluster_id === 1;
      const popup = `
        <div style="font-family: 'Inter', sans-serif; min-width: 140px;">
          <div style="font-weight: 700; font-size: 13px; color: #f1f5f9; margin-bottom: 4px;">${wardName}</div>
          ${hotspot
          ? `<span style="color: ${isHigh ? "#f87171" : "#fbbf24"}; font-size: 11px; font-weight: 600;">
                ${isHigh ? "🔴 High-Density Hotspot" : "🟡 Active Cluster"}
               </span>`
          : `<span style="color: #475569; font-size: 11px;">Normal Activity</span>`
        }
        </div>
      `;
      layer.bindPopup(popup);

      layer.on("mouseover", function () {
        (layer as L.Path).setStyle({ fillOpacity: hotspot ? 0.75 : 0.15, weight: hotspot ? 2 : 1 });
      });
      layer.on("mouseout", function () {
        (layer as L.Path).setStyle(styleFeature(feature));
      });
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", borderRadius: "inherit", overflow: "hidden" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            background: "rgba(13,18,32,0.88)",
            border: "1px solid rgba(251,191,36,0.25)",
            padding: "0.375rem 0.75rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.7rem",
            color: "var(--warning)",
            backdropFilter: "blur(8px)",
          }}
        >
          ⚡ {error}
        </div>
      )}

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
        <GeoJSON
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
        <MapResizer />
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
