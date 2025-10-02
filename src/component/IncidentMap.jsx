"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix leaflet default icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function IncidentMap({ illegalSites = [], leakageSites = [] }) {
  const allSites = [...illegalSites, ...leakageSites];
  const center =
    allSites.length > 0 ? [allSites[0].lat, allSites[0].lng] : [6.5244, 3.3792]; // fallback: Lagos coords

  return (
    <div className="h-[70vh] w-full mt-8 z-0">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full rounded-lg shadow leaflet-map"
      >
        {/* Esri Satellite Imagery */}
        <TileLayer
          attribution={null}
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {/* Esri Reference Layer (Labels) */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution={null}
        />
        {illegalSites.map((site, idx) => (
          <Marker key={`illegal-${idx}`} position={[site.lat, site.lng]}>
            <Popup>
              <b>{site.category}</b>
              <br />
              {site.location}
            </Popup>
          </Marker>
        ))}
        {leakageSites.map((site, idx) => (
          <Marker key={`leak-${idx}`} position={[site.lat, site.lng]}>
            <Popup>
              <b>{site.category}</b>
              <br />
              {site.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
