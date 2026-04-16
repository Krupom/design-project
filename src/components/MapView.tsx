import { lazy, Suspense, useEffect, useState } from "react";

const MapInner = lazy(() => import("./MapInner"));

export default function MapView() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        Loading map…
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
          Loading map…
        </div>
      }
    >
      <MapInner />
    </Suspense>
  );
}
