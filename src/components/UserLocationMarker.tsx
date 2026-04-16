import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

const mockLocation: [number, number] = [13.736797939817832, 100.53314580925473];

export default function UserLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Attempt to get real location
    map.locate({ watch: true, enableHighAccuracy: true });

    const onLocationFound = (e: L.LocationEvent) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    };

    const onLocationError = () => {
      console.warn("Location access denied or unavailable. Using mock location.");
      setPosition(mockLocation);
    };

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    // Initial timeout to force mock if location takes too long
    const timeout = setTimeout(() => {
      if (!position) {
        onLocationError();
      }
    }, 5000);

    return () => {
      map.stopLocate();
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
      clearTimeout(timeout);
    };
  }, [map]);

  if (!position) return null;

  const userIcon = L.divIcon({
    className: "user-location-marker",
    html: `
      <div class="user-location-container">
        <div class="user-location-accuracy"></div>
        <div class="user-location-dot"></div>
      </div>
    `,
    iconSize: [100, 100],
    iconAnchor: [50, 50],
  });

  return <Marker position={position} icon={userIcon} interactive={false} />;
}
