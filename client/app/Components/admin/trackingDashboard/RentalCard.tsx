import { CarLocation } from "@/app/types/CarLocation";
import { isCarActive } from "@/app/utils/getStatus";
import { Clock, MapPin, Signal, Users } from "lucide-react";

export const RentalCard = ({ 
  carLocation, 
  isSelected, 
  onSelect 
}: {
  carLocation: CarLocation;
  isSelected: boolean;
  onSelect: (carLocation: CarLocation) => void;
}) => {
  const isActive = isCarActive(carLocation);
  const { rental } = carLocation;

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(carLocation)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          ></div>
          <span className="font-medium text-gray-900">
            {rental.car.make} {rental.car.model}
          </span>
        </div>
        <span className="text-xs text-gray-500">{rental.car.licensePlate}</span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-1 mb-1">
          <Users className="w-3 h-3" />
          <span>{rental.user.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Duration: {new Date(rental.startDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
        <div>Year: {rental.car.year}</div>
        <div>Fuel: {rental.car.fuelType}</div>
        <div>Status: {rental.status}</div>
        <div className="flex items-center space-x-1">
          <Signal className="w-3 h-3" />
          <span>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(carLocation);
          }}
          className="flex-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
        >
          <MapPin className="w-3 h-3" />
          <span>View on Map</span>
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Last update: {new Date(carLocation.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};