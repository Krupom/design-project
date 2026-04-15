import { lazy, Suspense } from "react";

const MapInner = lazy(() => import("./MapInner"));

export default function MapView() {
  if (typeof window === "undefined") {
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
