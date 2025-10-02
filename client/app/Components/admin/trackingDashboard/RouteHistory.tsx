import { Polyline } from "react-leaflet";

export const RouteHistory = ({ rental }:any) => {
  if (!rental.routeHistory || rental.routeHistory.length <= 1) return null;

    function getStatusColor(rental: any): string {
        // Example: return color based on rental status
        if (rental.status === "active") return "blue";
        if (rental.status === "completed") return "green";
        return "gray";
    }

  return (
    <Polyline
      positions={rental.routeHistory.map((point: { lat: any; lng: any; }) => [point.lat, point.lng])}
      color={getStatusColor(rental)}
      weight={4}
      opacity={0.7}
    />
  );
};
