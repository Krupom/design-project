import { createFileRoute } from "@tanstack/react-router";
import MapView from "../components/MapView";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MapView />;
}
