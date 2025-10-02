import { MapContainer, TileLayer } from "react-leaflet";
import { CarMarker } from "./CarMarker";
import { MapUpdater } from "./MapUpdater";
import { MapLegend } from "./MapLegend";
import { CarLocation } from "@/app/types/CarLocation";
import { SelectedCarDetails } from "./SelectedRentDetails";

export const TrackingMap = ({ 
  carLocations, 
  selectedCar, 
  mapCenter, 
  mapZoom 
}: {
  carLocations: CarLocation[];
  selectedCar: CarLocation | null;
  mapCenter: [number, number];
  mapZoom: number;
}) => (
  <div className="flex-1 relative">
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full"
      zoomControl={true}
    >
      <MapUpdater center={mapCenter} zoom={mapZoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render all cars */}
      {carLocations.map((carLocation) => (
        <CarMarker key={carLocation.id} carLocation={carLocation} />
      ))}
    </MapContainer>

    <MapLegend />
    
    {selectedCar && (
      <SelectedCarDetails carLocation={selectedCar} />
    )}
  </div>
);
