import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logoImage from "../../logo.png";
import UserLocationMarker from "./UserLocationMarker";
import { Button } from "./ui/button";
import { Plus, Check, X, MapPin, ShieldCheck, Star, Users, MessageSquare, ChevronDown, ChevronUp, Camera, Upload } from "lucide-react";
import { SocketLocation, SocketType, initialSockets, Review } from "../lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Socket Location interfaces moved to src/lib/mockData.ts

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

function MapCenterTracker({ isAdding, onCenterChange }: { isAdding: boolean; onCenterChange: (latlng: L.LatLng) => void }) {
  const map = useMapEvents({
    move() {
      if (isAdding) {
        onCenterChange(map.getCenter());
      }
    },
    moveend() {
      if (isAdding) {
        onCenterChange(map.getCenter());
      }
    }
  });
  
  // Set initial center if starting add mode
  useEffect(() => {
    if (isAdding) {
      onCenterChange(map.getCenter());
    }
  }, [isAdding, map]);

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
    <div className="absolute left-24 right-4 top-4 z-[1000]">
      <div className="relative mx-auto max-w-md">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search sockets..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-xl border-none bg-card px-4 py-3 pl-10 text-sm text-card-foreground shadow-lg outline-none placeholder:text-muted-foreground transition-all focus:ring-2 focus:ring-blue-500"
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
        {open && filtered.length > 0 && (
          <div className="mt-1 max-h-60 overflow-y-auto rounded-xl bg-card shadow-lg border border-border">
            {filtered.map((loc) => (
              <button
                key={loc.title}
                onClick={() => { onSelect(loc); setQuery(loc.title); setOpen(false); inputRef.current?.blur(); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-card-foreground transition-colors hover:bg-accent border-b border-border last:border-0"
              >
                <span className={`text-base ${loc.isFree ? "text-blue-500" : "text-red-500"}`}>🔌</span>
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{loc.title}</div>
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
          <div className="mt-1 rounded-xl bg-card p-4 text-center text-sm text-muted-foreground shadow-lg border border-border">
            No sockets found
          </div>
        )}
      </div>
      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  );
}

function ReviewForm({ stationTitle, onSubmit }: { stationTitle: string, onSubmit: (title: string, r: Review) => void }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(stationTitle, {
      username: "You",
      comment: comment.trim(),
      stars
    });
    setComment("");
    setStars(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStars(s)}
            className={`transition-all ${s <= stars ? "text-amber-500 scale-110" : "text-gray-300"}`}
          >
            <Star className={`h-6 w-6 ${s <= stars ? "fill-current" : ""}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        rows={2}
      />
      <Button type="submit" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-9">
        Post Review
      </Button>
    </form>
  );
}

export default function MapInner() {
  const [sockets, setSockets] = useState<SocketLocation[]>(initialSockets);
  const [selected, setSelected] = useState<SocketLocation | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Reset reviews toggle when selection changes
  useEffect(() => {
    if (selected) setShowReviews(false);
  }, [selected?.title]);

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddingMode(false);
        setTempMarker(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    floor: "",
    socketType: "Type C" as SocketType,
    isFree: true,
    minimumCost: "",
    description: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      floor: "",
      socketType: "Type C" as SocketType,
      isFree: true,
      minimumCost: "",
      description: "",
      image: "",
    });
  };

  const handleAddSubmit = () => {
    if (!tempMarker) return;
    const newSocket: SocketLocation = {
      ...formData,
      position: tempMarker,
      verifiedCount: 0,
      isVerifiedByUser: false,
      reviews: [],
    };
    setSockets([newSocket, ...sockets]);
    setIsDialogOpen(false);
    setIsAddingMode(false);
    setTempMarker(null);
    setSelected(newSocket);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVerify = (stationTitle: string) => {
    setSockets(prev => prev.map(s => {
      if (s.title === stationTitle) {
        const isVerified = !s.isVerifiedByUser;
        return {
          ...s,
          isVerifiedByUser: isVerified,
          verifiedCount: s.verifiedCount + (isVerified ? 1 : -1)
        };
      }
      return s;
    }));
    
    // Also update selected if it's the same station
    if (selected && selected.title === stationTitle) {
      setSelected(prev => {
        if (!prev) return null;
        const isVerified = !prev.isVerifiedByUser;
        return {
          ...prev,
          isVerifiedByUser: isVerified,
          verifiedCount: prev.verifiedCount + (isVerified ? 1 : -1)
        };
      });
    }
  };

  const handleAddReview = (stationTitle: string, review: Review) => {
    setSockets(prev => prev.map(s => {
      if (s.title === stationTitle) {
        return {
          ...s,
          reviews: [review, ...s.reviews]
        };
      }
      return s;
    }));

    if (selected && selected.title === stationTitle) {
      setSelected(prev => {
        if (!prev) return null;
        return {
          ...prev,
          reviews: [review, ...prev.reviews]
        };
      });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
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
        <UserLocationMarker />
        <MapCenterTracker 
          isAdding={isAddingMode} 
          onCenterChange={(latlng) => {
            setTempMarker([latlng.lat, latlng.lng]);
          }} 
        />
        {selected && <FlyToLocation position={selected.position} />}
        {sockets.map((loc) => {
          const isSelected = selected?.title === loc.title;
          const icon = loc.isFree
            ? (isSelected ? blueIconLarge : blueIcon)
            : (isSelected ? redIconLarge : redIcon);
          return (
            <Marker
              key={loc.title + loc.position.join(",")}
              position={loc.position}
              icon={icon}
              eventHandlers={{ click: () => setSelected(loc) }}
            >
              <Popup>
                <div className="flex flex-col gap-1 p-1">
                  <span className="text-sm font-bold">{loc.title}</span>
                  <span className="text-xs text-muted-foreground">{loc.isFree ? "Free" : `Paid (${loc.minimumCost})`}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Fixed Center Pin Overlay */}
      {isAddingMode && (
        <div className="pointer-events-none absolute inset-0 z-[1001] flex items-center justify-center">
          <div className="mb-12 flex flex-col items-center animate-bounce-slow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-2xl ring-4 ring-white">
              <MapPin className="h-7 w-7 text-white fill-current" />
            </div>
            <div className="h-6 w-1 bg-blue-600 shadow-sm" />
            <div className="h-2 w-2 rounded-full bg-black/30 blur-[2px]" />
          </div>
        </div>
      )}

      <SearchBar locations={sockets} onSelect={setSelected} />

      {/* Legend - Exactly top-left corner */}
      <div className="absolute left-4 top-4 z-[1010] rounded-2xl bg-card p-5 shadow-2xl border border-border/50 transition-all hover:scale-105">
        <div className="mb-4 flex items-center gap-3">
          <img src={logoImage} alt="Plug Nai Logo" className="h-10 w-10 rounded-lg shadow-sm" />
          <div className="text-xl font-black text-blue-600 tracking-tight">Plug Nai</div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="inline-block h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Free
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="inline-block h-4 w-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> Paid
          </div>
        </div>
      </div>

      {/* Add Button FAB */}
      <div className="absolute bottom-8 right-8 z-[2000] flex flex-col gap-3 items-end">
        <Button
          size="icon"
          className={`h-24 w-24 rounded-full shadow-2xl transition-all active:scale-90 ${
            isAddingMode ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => {
            setIsAddingMode(!isAddingMode);
            setTempMarker(null);
          }}
        >
        <Plus className="h-16 w-16 text-white transition-transform" strokeWidth={4} />
      </Button>
    </div>

      {/* Bottom Confirmation Button */}
      {isAddingMode && (
        <div className="absolute bottom-10 left-1/2 z-[2000] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-8">
          <Button 
            size="lg"
            className="h-16 rounded-full bg-blue-600 px-10 text-xl font-black shadow-2xl transition-all hover:bg-blue-700 active:scale-95 text-white ring-4 ring-white/20"
            onClick={() => {
              console.log("Confirm button clicked");
              setIsDialogOpen(true);
            }}
          >
            Confirm Location
          </Button>
          <div className="mt-3 rounded-full bg-white/95 px-6 py-2 text-center text-xs font-bold text-gray-600 shadow-md backdrop-blur-md">
            Slide the map to position the pin
          </div>
        </div>
      )}

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
              <div className="flex flex-1 gap-4">
                {selected.image ? (
                  <div className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:block">
                    <img 
                      src={selected.image} 
                      alt={selected.title} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                  </div>
                ) : (
                  <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-muted sm:flex">
                    <span className="text-2xl">🔌</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-2xl font-bold ${selected.isFree ? "text-blue-900" : "text-red-900"}`}>
                      {selected.title}
                    </h2>
                    <button
                      onClick={() => handleToggleVerify(selected.title)}
                      className={`transition-all hover:scale-110 active:scale-95 ${
                        selected.isVerifiedByUser ? "opacity-100 text-green-600" : "opacity-20 text-gray-400"
                      }`}
                      title="Verify station"
                    >
                      <ShieldCheck className="h-7 w-7 fill-current" />
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
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
                    {selected.floor && (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>
                        🏢 {selected.floor}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-green-700 shadow-sm">
                      <Users className="h-3 w-3" /> {selected.verifiedCount} Verified
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-amber-600 shadow-sm">
                      <Star className="h-3 w-3 fill-current" /> {
                        selected.reviews.length > 0 
                          ? (selected.reviews.reduce((acc, r) => acc + r.stars, 0) / selected.reviews.length).toFixed(1)
                          : "-"
                      }
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 text-lg text-gray-500 transition-colors hover:bg-white"
              >
                ✕
              </button>
            </div>

            {selected.image && (
              <div className="mb-4 block aspect-video w-full overflow-hidden rounded-xl sm:hidden">
                <img 
                  src={selected.image} 
                  alt={selected.title} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400";
                  }}
                />
              </div>
            )}

            <p className={`text-base leading-relaxed ${selected.isFree ? "text-blue-800" : "text-red-800"}`}>
              {selected.description}
            </p>

            {!selected.isFree && selected.minimumCost && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-red-100/50 p-4 border border-red-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">💰</div>
                <div>
                  <div className="text-sm font-semibold text-red-900/60 uppercase tracking-wider">Minimum Cost Required</div>
                  <div className="text-xl font-black text-red-700">{selected.minimumCost}</div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2 text-sm italic">
              <span className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 ${selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                <MapPin className="h-3 w-3" /> Bangkok, Thailand
              </span>
              <span className={`rounded-full px-4 py-1.5 ${selected.isFree ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                {selected.position[0].toFixed(4)}, {selected.position[1].toFixed(4)}
              </span>
            </div>

            {/* Review System Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <button 
                onClick={() => setShowReviews(!showReviews)}
                className="flex w-full items-center justify-between mb-4 group transition-all"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <h3 className="text-lg font-bold">Reviews</h3>
                  <span className="text-sm text-gray-500 font-normal">({selected.reviews.length} total)</span>
                </div>
                {showReviews ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                )}
              </button>

              {showReviews && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Add Review Component (simplified for demo) */}
                  <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                    <p className="text-sm font-bold mb-3">Add your review</p>
                    <ReviewForm stationTitle={selected.title} onSubmit={handleAddReview} />
                  </div>

                  {/* Scrollable Reviews List */}
                  <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {selected.reviews.length > 0 ? (
                      selected.reviews.map((r, i) => (
                        <div key={i} className="rounded-xl bg-white/50 p-4 border border-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-gray-800">{r.username}</span>
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={`h-3 w-3 ${idx < r.stars ? "fill-current" : ""}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-snug">{r.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-muted-foreground italic text-sm">No reviews yet. Be the first to verify!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Charging Station</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Station name..." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input 
                  id="floor" 
                  placeholder="e.g. 2nd Floor" 
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select 
                  value={formData.socketType} 
                  onValueChange={(v: SocketType) => setFormData({...formData, socketType: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Type A">Type A</SelectItem>
                    <SelectItem value="Type B">Type B</SelectItem>
                    <SelectItem value="Type C">Type C</SelectItem>
                    <SelectItem value="USB-A">USB-A</SelectItem>
                    <SelectItem value="USB-C">USB-C</SelectItem>
                    <SelectItem value="Universal">Universal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Picture</Label>
              {formData.image ? (
                <div className="relative group aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-blue-200">
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="rounded-full"
                    >
                      <X className="mr-2 h-4 w-4" /> Remove
                    </Button>
                    <Label htmlFor="image-reupload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-gray-100 transition-colors">
                        <Upload className="h-4 w-4" /> Change
                      </div>
                      <Input id="image-reupload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </Label>
                  </div>
                </div>
              ) : (
                <Label 
                  htmlFor="image-upload" 
                  className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:bg-muted/80 hover:border-blue-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-white p-4 shadow-sm">
                      <Camera className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Upload Photo</p>
                      <p className="text-[10px] text-muted-foreground">Tap to select from device</p>
                    </div>
                  </div>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </Label>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Free to use?</Label>
                <div className="text-[10px] text-muted-foreground italic">Toggle if this is a paid station</div>
              </div>
              <Switch 
                checked={formData.isFree}
                onCheckedChange={(v) => setFormData({...formData, isFree: v})}
              />
            </div>
            {!formData.isFree && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="cost">Minimum Cost Required</Label>
                <Input 
                  id="cost" 
                  placeholder="e.g. 50 THB" 
                  value={formData.minimumCost}
                  onChange={(e) => setFormData({...formData, minimumCost: e.target.value})}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Input 
                id="desc" 
                placeholder="Short description..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-blue-600 hover:bg-blue-700">Confirm Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
