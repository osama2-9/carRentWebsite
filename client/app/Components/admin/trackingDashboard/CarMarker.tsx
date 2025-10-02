'use client'
import { Marker, Popup } from "react-leaflet";
import { CarLocation } from "@/app/types/CarLocation";
import { isCarActive } from "@/app/utils/getStatus";
import L from "leaflet";
export function createCarIcon(color = "#3B82F6", isActive = false) {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${isActive ? "animation: pulse 2s infinite;" : ""}
      ">
        <div style="color: white; font-size: 12px;">🚗</div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    className: "custom-car-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}
export const CarMarker = ({ carLocation }: { carLocation: CarLocation }) => {
  const isActive = isCarActive(carLocation);
  const { rental } = carLocation;

  function getStatusColor(carLocation: CarLocation): any {
    const getStatusColor = (status: any) => {
      const colors: any = {
        ACTIVE: "bg-green-100 text-green-800 border-green-200",
        COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
        CONFIRMED: "bg-indigo-100 text-indigo-800 border-indigo-200",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        CANCELLED: "bg-red-100 text-red-800 border-red-200",
      };
      return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };
    return getStatusColor(carLocation);
  }

  return (
    <Marker
      position={[carLocation.lat, carLocation.lng]}
      icon={createCarIcon(getStatusColor(carLocation), isActive)}
    >
      <Popup>
        <div className="p-2">
          <div className="font-semibold text-gray-900 mb-2">
            {rental.car.make} {rental.car.model} ({rental.car.licensePlate})
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Driver: {rental.user.name}</div>
            <div>Phone: {rental.user.phone}</div>
            <div>Status: {isActive ? 'Active' : 'Inactive'}</div>
            <div>Fuel Type: {rental.car.fuelType}</div>
            <div>Year: {rental.car.year}</div>
            <div>Rental Status: {rental.status}</div>
            <div className="text-xs text-gray-500">
              Last update: {new Date(carLocation.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};