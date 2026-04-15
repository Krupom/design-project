import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const locations = [
  { position: [40.7128, -74.006] as [number, number], title: "New York City", description: "The Big Apple — the most populous city in the United States." },
  { position: [40.7484, -73.9857] as [number, number], title: "Empire State Building", description: "Iconic 102-story Art Deco skyscraper in Midtown Manhattan." },
  { position: [40.6892, -74.0445] as [number, number], title: "Statue of Liberty", description: "A symbol of freedom and democracy, gifted by France in 1886." },
  { position: [40.7580, -73.9855] as [number, number], title: "Times Square", description: "The bustling commercial and entertainment hub of NYC." },
  { position: [40.7794, -73.9632] as [number, number], title: "Central Park", description: "An 843-acre urban park in the heart of Manhattan." },
];

export default function MapInner() {
  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={13}
      zoomControl={false}
      className="h-screen w-screen"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {locations.map((loc) => (
        <Marker key={loc.title} position={loc.position}>
          <Popup>
            <div className="p-1">
              <h3 className="text-sm font-semibold">{loc.title}</h3>
              <p className="mt-1 text-xs text-gray-600">{loc.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
