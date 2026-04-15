import { lazy, Suspense } from "react";

const MapInner = lazy(() => import("./MapInner"));

export default function MapView() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">Loading map…</div>}>
      <MapInner />
    </Suspense>
  );
}
