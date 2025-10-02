"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapPin, Loader2, Car, CheckCircle } from "lucide-react";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserLocation } from "@/app/utils/getInitialLocation";

const TrackUserPage = () => {
  const router = useRouter();
  const isMounted = useRef(false);
  const hasStartedTracking = useRef(false);
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalId");
  const [isTracking, setIsTracking] = useState(false);
  const locationIdRef = useRef<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;

    if (!rentalId) {
      toast.error("No rental ID provided - redirecting to dashboard");
      router.push("/pages/customer/dashboard");
      return;
    }

    if (!hasStartedTracking.current) {
      hasStartedTracking.current = true;

      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }

      startTracking();
    }

    return () => {
      isMounted.current = false;
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      if (locationIdRef.current && isTracking) {
        axiosInstance
          .post("/user/stop-track", {
            locationId: locationIdRef.current,
            rentalId,
          })
          .catch(console.error);
      }
    };
  }, [rentalId]);

  const startTracking = async () => {
    try {
      const { lat, lng } = await getUserLocation();
      if (!isMounted.current) return;

      setCurrentLocation({ lat, lng });

      const response = await axiosInstance.post("/user/start-track", {
        rentalId,
        lat,
        lng,
      });

      const { locationId } = response.data;
      locationIdRef.current = locationId;

      if (!isMounted.current) return;
      setIsTracking(true);
      toast.success("Tracking started");

      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }

      trackingIntervalRef.current = setInterval(async () => {
        try {
          const { lat, lng } = await getUserLocation();
          if (!isMounted.current) return;

          setCurrentLocation({ lat, lng });

          await axiosInstance.post("/user/update-location", {
            locationId: locationIdRef.current,
            rentalId,
            lat,
            lng,
          });
        } catch (error) {
          console.error("Error updating location:", error);
          toast.error("Failed to update location");
        }
      }, 30000);
    } catch (error: any) {
      console.error("Tracking error:", error);
      toast.error(error.message || "Failed to start tracking");
      router.push("/pages/customer/dashboard");
    }
  };

  const stopTracking = async () => {
    try {
      if (locationIdRef.current) {
        await axiosInstance.post("/user/stop-track", {
          locationId: locationIdRef.current,
          rentalId,
        });
      }
    } catch (error) {
      console.error("Error stopping tracking:", error);
      toast.error("Failed to properly stop tracking");
    } finally {
      setIsTracking(false);
      hasStartedTracking.current = false;
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
      toast.success("Tracking stopped");
      router.push("/pages/customer/dashboard");
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isTracking ? "Active Tracking" : "Starting Tracking..."}
            </h1>

            <p className="text-gray-600 mb-6 max-w-md">
              {isTracking
                ? "We're currently tracking your location. You can use your phone normally, but please don't close this page."
                : "Setting up location tracking..."}
            </p>

            {isTracking && currentLocation && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6 w-full max-w-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Current Location
                    </p>
                    <p className="text-xs text-gray-500">
                      Lat: {currentLocation.lat.toFixed(6)}, Lng:{" "}
                      {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isTracking && (
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-gray-600">Initializing tracking...</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-green-600 mb-6">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {isTracking
                  ? "Tracking is active"
                  : "Waiting for location permission"}
              </span>
            </div>

            <button
              onClick={stopTracking}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Stop Tracking
            </button>

            <div className="mt-6 text-xs text-gray-500">
              <p>
                Note: Closing this page will stop tracking. Make sure to
                properly stop tracking when you're done.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default TrackUserPage;
