'use client'
import { DashboardHeader } from "@/app/Components/admin/trackingDashboard/TrackDashboardHeader";
import { TrackingMap } from "@/app/Components/admin/trackingDashboard/TrackingMap";
import { Sidebar } from "@/app/Components/admin/trackingDashboard/TrackSideBar";
import { CarLocation } from "@/app/types/CarLocation";
import { isCarActive } from "@/app/utils/getStatus";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/axios/axios";
import 'leaflet/dist/leaflet.css';

export default function page() {
  const [carLocations, setCarLocations] = useState<CarLocation[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.0920, 31.6338]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 

  const handleSelectCar = (carLocation: CarLocation) => {
    setSelectedCar(carLocation);
    setMapCenter([carLocation.lat, carLocation.lng]);
    setMapZoom(15);
  };

  const handleGetCarsLocation = async ()=>{
    try {
      setIsLoading(true);
     const response = await axiosInstance.get('admin/cars-to-track')
     const data = await response.data;
     setCarLocations(data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch cars location");
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetCarsLocation();
    const interval = setInterval(() => {
      handleGetCarsLocation();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = carLocations.filter(car => isCarActive(car)).length;
  const inactiveCount = carLocations.length - activeCount;

  if (error && carLocations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          activeCount={0} 
          inactiveCount={0} 
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
       
      </div>
    );
  }

  function handleRefresh(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        activeCount={activeCount} 
        inactiveCount={inactiveCount} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar
          carLocations={carLocations}
          selectedCar={selectedCar}
          onSelectCar={handleSelectCar}
        />

        {isLoading && carLocations.length === 0 ? (
        <Loader2 className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
        ) : (
          <TrackingMap
            carLocations={carLocations}
            selectedCar={selectedCar}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
          />
        )}
      </div>
    </div>
  );
}