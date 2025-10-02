import { CarLocation } from "@/app/types/CarLocation";
import { Car } from "lucide-react";
import { RentalCard } from "./RentalCard";

export const Sidebar = ({ 
  carLocations, 
  selectedCar, 
  onSelectCar 
}: {
  carLocations: CarLocation[];
  selectedCar: CarLocation | null;
  onSelectCar: (carLocation: CarLocation) => void;
}) => (
  <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Tracked Cars ({carLocations.length})
      </h2>
      <div className="space-y-3">
        {carLocations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No cars being tracked</p>
          </div>
        ) : (
          carLocations.map((carLocation) => (
            <RentalCard
              key={carLocation.id}
              carLocation={carLocation}
              isSelected={selectedCar?.id === carLocation.id}
              onSelect={onSelectCar}
            />
          ))
        )}
      </div>
    </div>
  </div>
);