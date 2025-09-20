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
    <div className="h-96 w-full mt-8 z-0">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full rounded-lg shadow"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
