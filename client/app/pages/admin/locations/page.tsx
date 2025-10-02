"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Car,
  
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { Location } from "@/app/types/Location";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { DeleteModal } from "@/app/Components/DeleteModal";
import Link from "next/link";

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active")
      return matchesSearch && location.cars && location.cars.length > 0;
    if (filterStatus === "empty")
      return matchesSearch && location.cars && location.cars.length === 0;

    return matchesSearch;
  });

  const handleDeleteLocationModal = (location: Location) => {
    setSelectedLocation(location);
    setShowDeleteModal(true);
  };

  const stats = {
    total: locations.length,
    active: locations.filter((loc) => loc.cars && loc.cars.length > 0).length,
    highDemand: locations.filter((loc) => loc.cars && loc.cars.length > 2)
      .length,
    maintenance: locations.filter(
      (loc) => loc.cars && loc.cars.some((car) => !car.available)
    ).length,
  };

  const getLocations = async () => {
    try {
      const res = await axiosInstance.get("/location/locations", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        return data.locations;
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setLocations(data);
    }
  }, [data]);

  const handleDeleteLocation = async (locationId: number) => {
    try {
      setIsDeleting(true);
      const res = await axiosInstance.delete(`/location/delete-location`, {
        params: {
          locationId: locationId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        toast.success(data.message);
        setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Location Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage pickup and drop-off locations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>View Map</span>
              </button>
              <Link
                href={window.location.href + "/add"}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Location</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Locations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
               
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    High Demand
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.highDemand}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Maintenance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.maintenance}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="active">Active</option>
                <option value="empty">Empty</option>
              </select>
              {selectedLocation && (
                <button
                  onClick={() => handleDeleteLocationModal(selectedLocation)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedLocation?.id === location.id}
                    onChange={() => setSelectedLocation(location)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {location.city}
                        </h3>
                        <p className="text-gray-600 mb-2">{location.address}</p>
                        <a
                          href={location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View on Google Maps
                        </a>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            location.cars && location.cars.length > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {location.cars && location.cars.length > 0
                            ? "Active"
                            : "Empty"}
                        </span>

                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit location"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLocationModal(location)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Car className="w-4 h-4 mr-2" />
                          Available Cars ({location.cars?.length})
                        </h4>
                      </div>

                      {location.cars && location.cars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {location.cars?.map((car, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {car.make} {car.model}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {car.licensePlate}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    car.available
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {car.available ? "Available" : "Rented"}
                                </span>
                              </div>

                              {car.imagesUrl && car.imagesUrl.length > 0 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                  {Array.isArray(car.imagesUrl) &&
                                    car.imagesUrl.map(
                                      (imageUrl: string, imgIndex: number) => (
                                        <img
                                          key={imgIndex}
                                          src={imageUrl}
                                          alt={`${car.make} ${car.model}`}
                                          className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                      )
                                    )}
                                  {Array.isArray(car.imagesUrl) &&
                                    car.imagesUrl.length > 3 && (
                                      <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                                        +{car.imagesUrl.length - 3}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No cars assigned to this location</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No locations found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {showUpdateModal && selectedLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedLocation.city}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    defaultValue={selectedLocation.address}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    defaultValue={selectedLocation.googleMapsUrl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedLocation && showDeleteModal && (
        <>
          <DeleteModal
            modalTitle="Delete Location"
            modalMessage="Are you sure you want to delete this location?"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDeleteLocation(selectedLocation.id)}
            isLoading={isDeleting}
          />
        </>
      )}
    </AdminDashboardLayout>
  );
}
