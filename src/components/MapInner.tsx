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

type SocketType = "Type A" | "Type B" | "Type C" | "Type G" | "USB-A" | "USB-C" | "Universal";

interface SocketLocation {
  position: [number, number];
  title: string;
  description: string;
  socketType: SocketType;
  isFree: boolean;
  minimumCost?: string;
  floor?: string;
  image?: string;
}

const bangkokSockets: SocketLocation[] = [
  { position: [13.7563, 100.5018], title: "Grand Palace Charging Station", description: "Free public charging station near the Grand Palace entrance.", socketType: "USB-C", isFree: true, floor: "Ground Floor" },
  { position: [13.7468, 100.5331], title: "Wat Arun Visitor Center", description: "Socket available at the visitor rest area. Purchase required from café.", socketType: "Type A", isFree: false, minimumCost: "50 THB", floor: "1st Floor" },
  { position: [13.7516, 100.4915], title: "Wat Pho Rest Area", description: "Free charging sockets near the massage school area.", socketType: "Type C", isFree: true, floor: "Ground Floor" },
  { position: [13.7466, 100.5392], title: "Khao San Road - Coffee Hub", description: "Available for customers. Minimum order required.", socketType: "Universal", isFree: false, minimumCost: "80 THB", floor: "1st Floor" },
  { position: [13.7469, 100.5349], title: "Siam Paragon - Level 2 Lounge", description: "Free USB charging stations on Level 2 near food court.", socketType: "USB-A", isFree: true, floor: "2nd Floor" },
  { position: [13.7274, 100.5234], title: "Lumphini Park Info Booth", description: "Free public socket at the information booth.", socketType: "Type A", isFree: true, floor: "Outdoor" },
  { position: [13.7440, 100.4935], title: "Chinatown Co-working Café", description: "Socket access with minimum drink purchase.", socketType: "Type C", isFree: false, minimumCost: "60 THB", floor: "2nd Floor" },
  { position: [13.7468, 100.5605], title: "Chatuchak Market Office", description: "Paid charging service near Section 8.", socketType: "USB-C", isFree: false, minimumCost: "20 THB", floor: "Ground Floor" },
  { position: [13.7262, 100.5141], title: "MBK Center - 3rd Floor", description: "Free public charging area on the 3rd floor near escalators.", socketType: "USB-C", isFree: true, floor: "3rd Floor" },
  { position: [13.7200, 100.5147], title: "Jim Thompson Café", description: "Socket available for café customers only.", socketType: "Type B", isFree: false, minimumCost: "100 THB", floor: "1st Floor" },
  { position: [13.7450, 100.5340], title: "CentralWorld Free Zone", description: "Free public USB sockets on the ground floor.", socketType: "USB-A", isFree: true, floor: "Ground Floor" },
  { position: [13.7380, 100.5600], title: "Ekkamai BTS Station", description: "Paid charging kiosk at BTS Ekkamai.", socketType: "Universal", isFree: false, minimumCost: "30 THB", floor: "Platform Level" },
];

function createColoredIcon(color: "blue" | "red", large = false) {
  const size: [number, number] = large ? [38, 62] : [25, 41];
  const anchor: [number, number] = large ? [19, 62] : [12, 41];
  const popupAnchor: [number, number] = large ? [1, -52] : [1, -34];
  const shadowSize: [number, number] = large ? [62, 62] : [41, 41];
  return new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor,
    shadowSize,
    className: `marker-${color}`,
  });
}

const blueIcon = createColoredIcon("blue");
const redIcon = createColoredIcon("red");
const blueIconLarge = createColoredIcon("blue", true);
const redIconLarge = createColoredIcon("red", true);

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
  locations: SocketLocation[];
  onSelect: (loc: SocketLocation) => void;
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
          placeholder="Search sockets..."
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
              <span className={`text-base ${loc.isFree ? "text-blue-500" : "text-red-500"}`}>🔌</span>
              <div className="flex-1">
                <div className="font-medium">{loc.title}</div>
                <div className="text-xs text-muted-foreground">{loc.socketType} · {loc.isFree ? "Free" : loc.minimumCost}</div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${loc.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                {loc.isFree ? "Free" : "Paid"}
              </span>
            </button>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="mt-1 rounded-xl bg-card p-4 text-center text-sm text-muted-foreground shadow-lg">
          No sockets found
        </div>
      )}
      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default function MapInner() {
  const [selected, setSelected] = useState<SocketLocation | null>(null);

  const panelColor = selected?.isFree ? "blue" : "red";

  return (
    <div className="relative h-screen w-screen">
      {/* Custom marker styles */}
      <style>{`
        .marker-red {
          filter: hue-rotate(140deg) saturate(2) brightness(0.8);
        }
      `}</style>

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
          maxNativeZoom={18}
          maxZoom={20}
        />
        <ZoomControl position="topright" />
        <LocateUser />
        {selected && <FlyToLocation position={selected.position} />}
        {bangkokSockets.map((loc) => (
          <Marker
            key={loc.title}
            position={loc.position}
            icon={loc.isFree ? blueIcon : redIcon}
            eventHandlers={{ click: () => setSelected(loc) }}
          >
            <Popup>
              <span className="text-sm font-semibold">{loc.title}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <SearchBar locations={bangkokSockets} onSelect={setSelected} />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-xl bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="mb-1 text-xs font-semibold text-card-foreground">Legend</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Free
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Paid
        </div>
      </div>

      {/* Bottom detail panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[1000] transform transition-transform duration-300 ease-in-out ${selected ? "translate-y-0" : "translate-y-full"}`}
      >
        {selected && (
          <div className={`mx-auto max-w-3xl rounded-t-2xl p-7 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] ${
            selected.isFree
              ? "bg-blue-50 border-t-4 border-blue-500"
              : "bg-red-50 border-t-4 border-red-500"
          }`}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${selected.isFree ? "text-blue-900" : "text-red-900"}`}>
                  {selected.title}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    selected.isFree ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"
                  }`}>
                    {selected.isFree ? "Free" : "Paid"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                  }`}>
                    🔌 {selected.socketType}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 text-lg text-gray-500 transition-colors hover:bg-white"
              >
                ✕
              </button>
            </div>

            <p className={`text-base leading-relaxed ${selected.isFree ? "text-blue-800" : "text-red-800"}`}>
              {selected.description}
            </p>

            {!selected.isFree && selected.minimumCost && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-3">
                <span className="text-lg">💰</span>
                <div>
                  <div className="text-sm font-semibold text-red-900">Minimum Cost Required</div>
                  <div className="text-lg font-bold text-red-700">{selected.minimumCost}</div>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2 text-sm">
              <span className={`rounded-full px-4 py-1.5 ${selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                📍 Bangkok, Thailand
              </span>
              <span className={`rounded-full px-4 py-1.5 ${selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                {selected.position[0].toFixed(4)}, {selected.position[1].toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
