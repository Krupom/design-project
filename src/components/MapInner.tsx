import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Location {
  position: [number, number];
  title: string;
  description: string;
  image?: string;
}

const bangkokLocations: Location[] = [
  { position: [13.7563, 100.5018], title: "Grand Palace", description: "Former royal residence and Bangkok's most famous landmark, featuring stunning architecture and the sacred Emerald Buddha.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chakri_Maha_Prasat_Throne_Hall.jpg/640px-Chakri_Maha_Prasat_Throne_Hall.jpg" },
  { position: [13.7468, 100.5331], title: "Wat Arun", description: "The Temple of Dawn, an iconic riverside temple adorned with colorful porcelain and seashells.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Wat_Arun%2C_view_from_Chao_Phraya_River.jpg/640px-Wat_Arun%2C_view_from_Chao_Phraya_River.jpg" },
  { position: [13.7516, 100.4915], title: "Wat Pho", description: "Home to the massive 46-meter Reclining Buddha and Thailand's first public university of traditional medicine.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wat_Pho%2C_Bangkok%2C_Thailand.jpg/640px-Wat_Pho%2C_Bangkok%2C_Thailand.jpg" },
  { position: [13.7466, 100.5392], title: "Khao San Road", description: "The famous backpacker street, bustling with street food, shops, bars, and vibrant nightlife." },
  { position: [13.7469, 100.5349], title: "Siam Paragon", description: "One of Bangkok's largest and most luxurious shopping malls with an aquarium, cineplex, and designer boutiques." },
  { position: [13.7274, 100.5234], title: "Lumphini Park", description: "Bangkok's largest green oasis in the heart of the city, perfect for jogging, paddle boating, and spotting monitor lizards." },
  { position: [13.7440, 100.4935], title: "Chinatown (Yaowarat)", description: "A vibrant neighborhood famous for incredible street food, gold shops, and Chinese temples." },
  { position: [13.7468, 100.5605], title: "Chatuchak Weekend Market", description: "One of the world's largest outdoor markets with over 15,000 stalls selling everything imaginable." },
  { position: [13.7262, 100.5141], title: "MBK Center", description: "Popular shopping mall known for electronics, fashion, and affordable goods across 8 floors." },
  { position: [13.7200, 100.5147], title: "Jim Thompson House", description: "Museum showcasing traditional Thai architecture and the art collection of the legendary American silk entrepreneur." },
];

function LocateUser() {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
  }, [map]);
  return null;
}

interface Props {
  onSelectLocation: (loc: Location | null) => void;
  selectedLocation: Location | null;
}

function MapContent({ onSelectLocation, selectedLocation }: Props) {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <LocateUser />
      {bangkokLocations.map((loc) => (
        <Marker
          key={loc.title}
          position={loc.position}
          eventHandlers={{ click: () => onSelectLocation(loc) }}
        >
          <Popup>
            <span className="text-sm font-semibold">{loc.title}</span>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function MapInner() {
  const [selected, setSelected] = useState<Location | null>(null);

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={[13.7563, 100.5018]}
        zoom={13}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapContent onSelectLocation={setSelected} selectedLocation={selected} />
      </MapContainer>

      {/* Bottom detail panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[1000] transform transition-transform duration-300 ease-in-out ${selected ? "translate-y-0" : "translate-y-full"}`}
      >
        {selected && (
          <div className="mx-auto max-w-2xl rounded-t-2xl bg-card p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
            <div className="mb-3 flex items-start justify-between">
              <h2 className="text-lg font-bold text-card-foreground">{selected.title}</h2>
              <button
                onClick={() => setSelected(null)}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-4">
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-24 w-32 rounded-lg object-cover"
                />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
            </div>
            <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">📍 Bangkok, Thailand</span>
              <span className="rounded-full bg-muted px-3 py-1">
                {selected.position[0].toFixed(4)}, {selected.position[1].toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
