import { useEffect, useState, useRef } from "react";
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
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);
  return null;
}

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 19, { duration: 1.2 });
  }, [map, position[0], position[1]]);
  return null;
}

interface SearchBarProps {
  locations: Location[];
  onSelect: (loc: Location) => void;
}

function SearchBar({ locations, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? locations.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()))
    : locations;

  return (
    <div className="absolute left-4 right-4 top-4 z-[1000] mx-auto max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-xl border-none bg-card px-4 py-3 pl-10 text-sm text-card-foreground shadow-lg outline-none placeholder:text-muted-foreground"
        />
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="mt-1 max-h-60 overflow-y-auto rounded-xl bg-card shadow-lg">
          {filtered.map((loc) => (
            <button
              key={loc.title}
              onClick={() => { onSelect(loc); setQuery(loc.title); setOpen(false); inputRef.current?.blur(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-card-foreground transition-colors hover:bg-accent"
            >
              <span className="text-base">📍</span>
              <div>
                <div className="font-medium">{loc.title}</div>
                <div className="text-xs text-muted-foreground">{loc.description.slice(0, 60)}…</div>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="mt-1 rounded-xl bg-card p-4 text-center text-sm text-muted-foreground shadow-lg">
          No locations found
        </div>
      )}
      {/* Backdrop to close dropdown */}
      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default function MapInner() {
  const [selected, setSelected] = useState<Location | null>(null);

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={[13.7563, 100.5018]}
        zoom={15}
        maxZoom={20}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <LocateUser />
        {selected && <FlyToLocation position={selected.position} />}
        {bangkokLocations.map((loc) => (
          <Marker
            key={loc.title}
            position={loc.position}
            eventHandlers={{ click: () => setSelected(loc) }}
          >
            <Popup>
              <span className="text-sm font-semibold">{loc.title}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <SearchBar locations={bangkokLocations} onSelect={setSelected} />

      {/* Bottom detail panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[1000] transform transition-transform duration-300 ease-in-out ${selected ? "translate-y-0" : "translate-y-full"}`}
      >
        {selected && (
          <div className="mx-auto max-w-3xl rounded-t-2xl bg-card p-7 shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-card-foreground">{selected.title}</h2>
              <button
                onClick={() => setSelected(null)}
                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg text-muted-foreground transition-colors hover:bg-accent"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-5">
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-36 w-48 rounded-xl object-cover"
                />
              )}
              <p className="text-base leading-relaxed text-muted-foreground">{selected.description}</p>
            </div>
            <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-4 py-1.5">📍 Bangkok, Thailand</span>
              <span className="rounded-full bg-muted px-4 py-1.5">
                {selected.position[0].toFixed(4)}, {selected.position[1].toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
