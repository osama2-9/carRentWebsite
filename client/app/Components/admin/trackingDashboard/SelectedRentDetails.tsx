import { CarLocation } from "@/app/types/CarLocation";
import { isCarActive } from "@/app/utils/getStatus";

export const SelectedCarDetails = ({ carLocation }: { carLocation: CarLocation }) => {
  const isActive = isCarActive(carLocation);
  const { rental } = carLocation;

  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[1000] max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">
          {rental.car.make} {rental.car.model}
        </h3>
        <div
          className={`w-3 h-3 rounded-full ${
            isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Driver:</span>
          <div className="font-medium">{rental.user.name}</div>
        </div>
        <div>
          <span className="text-gray-500">Phone:</span>
          <div className="font-medium">{rental.user.phone}</div>
        </div>
        <div>
          <span className="text-gray-500">License:</span>
          <div className="font-medium">{rental.car.licensePlate}</div>
        </div>
        <div>
          <span className="text-gray-500">Year:</span>
          <div className="font-medium">{rental.car.year}</div>
        </div>
        <div>
          <span className="text-gray-500">Fuel Type:</span>
          <div className="font-medium">{rental.car.fuelType}</div>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <div className="font-medium">{rental.status}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Last update: {new Date(carLocation.timestamp).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">
          Location: {carLocation.lat.toFixed(6)}, {carLocation.lng.toFixed(6)}
        </div>
        <div className="text-xs text-gray-500">
          Rental Duration: {new Date(rental.startDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
