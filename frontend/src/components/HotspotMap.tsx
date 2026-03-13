import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getHotspots } from "../api/api";
import type { FeatureCollection, Feature, Geometry } from "geojson";

// Helper component to resize map on load
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
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
        // Fetch GeoJSON
        const geoResponse = await fetch("/bengaluru_wards.geojson");
        if (!geoResponse.ok) throw new Error("Could not load map data");
        const json = await geoResponse.json();
        setGeoData(json);

        // Fetch Hotspots
        try {
          const hotspotResponse = await getHotspots();
          setHotspots(hotspotResponse.data);
          setError(null);
        } catch (apiError) {
          console.error("Failed to load hotspots from API", apiError);
          setError("Showing general map without live hotspot data.");
          // Mock some hotspot data
          setHotspots([
            { ward_name: "BTM Layout", ward_id: 176, cluster_id: 1 },
            { ward_name: "Marathahalli", ward_id: 85, cluster_id: 1 },
            { ward_name: "Bellandur", ward_id: 150, cluster_id: 2 }
          ]);
        }
      } catch (err) {
        console.error("Error loading map components:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>Loading Map...</div>;
  if (!geoData) return <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--danger)" }}>Failed to load geographic boundaries.</div>;

  // Function to style each ward polygon
  const styleFeature = (feature?: Feature<Geometry, any>) => {
    if (!feature) return {};
    
    // Look up if this ward is a hotspot
    const wardName = feature.properties?.KGISWardNa || feature.properties?.WARD_NAME || feature.properties?.name;
    const isHotspot = hotspots.some(h => 
      h.ward_name.toLowerCase() === wardName?.toLowerCase()
    );

    return {
      fillColor: isHotspot ? "var(--danger)" : "var(--primary-light)",
      weight: 1,
      opacity: 1,
      color: isHotspot ? "var(--danger-hover)" : "var(--border-color)",
      fillOpacity: isHotspot ? 0.6 : 0.4,
    };
  };

  // Function to bind popups to each ward
  const onEachFeature = (feature: Feature<Geometry, any>, layer: L.Layer) => {
    if (feature.properties) {
      const wardName = feature.properties.KGISWardNa || feature.properties.WARD_NAME || feature.properties.name || "Unknown Ward";
      const isHotspot = hotspots.some(h => h.ward_name.toLowerCase() === wardName?.toLowerCase());
      
      const popupContent = `
        <div style="font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${wardName}</h3>
          ${isHotspot ? '<span style="color: red; font-weight: bold; font-size: 12px;">Active Hotspot</span>' : '<span style="color: #64748b; font-size: 12px;">Normal Activity</span>'}
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", borderRadius: "inherit", overflow: "hidden" }}>
      {error && (
        <div style={{ 
          position: "absolute", 
          top: "10px", right: "10px", 
          zIndex: 1000, 
          backgroundColor: "rgba(255, 255, 255, 0.9)", 
          padding: "0.5rem 1rem", 
          borderRadius: "var(--radius-md)", 
          boxShadow: "var(--shadow-md)",
          fontSize: "0.75rem",
          color: "var(--warning-hover)",
          border: "1px solid var(--warning-light)"
        }}>
          Preview Mode: {error}
        </div>
      )}
      
      <MapContainer 
        center={[12.9716, 77.5946]} // Bengaluru center
        zoom={11} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
