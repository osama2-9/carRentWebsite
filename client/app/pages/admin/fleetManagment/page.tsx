"use client";
import { useGetCars } from "@/app/hooks/useGetCars";
import {
  AlertTriangle,
  Car,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Edit,
  Trash2,
  Key,
  Search,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { CarType } from "@/app/types/Car";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import Link from "next/link";
import { UpdateCarModal } from "@/app/Components/admin/UpdateCar";
import { useGetCategories } from "@/app/hooks/useGetCategories";
import { useGetLocations } from "@/app/hooks/useGetLocations";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";

export default function page() {
  const { cars, isLoading, error } = useGetCars();
  const [selectedCars, setSelectedCars] = useState<CarType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const { categories, isLoading: categoryLoading } = useGetCategories();
  const { locations, isLoading: locationLoading } = useGetLocations();

  const handleOpenModal = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    setIsModalOpen(false);
  };
  const handleCarSelect = (car: CarType, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCars(car);
    } else {
      setSelectedCars(null);
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete("/admin/delete-car", {
        params: {
          carId: selectedCars?.id,
        },
      });
      const data = await response.data;
      if (data.message) {
        toast.success(data.message);
      }
      setSelectedCars(null);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  const handleMarkAsRented = async () => {
    try {
      const response = await axiosInstance.put("/car/mark-as-rented", {
        carId: selectedCars?.id,
      });
      const data = await response.data;
      if (data.message) {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  const totalVehicles = cars.length;
  const availableVehicles = cars.filter((car) => car.available).length;
  const rentedVehicles = cars.filter((car) => !car.available).length;
  const maintenanceVehicles = 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading cars: {error.message}
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardLayout>
      <div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Fleet Overview
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your vehicle inventory and performance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/pages/admin/addVehicle"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </Link>
                <Link
                  href="/pages/admin/addCategory"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Categorys</span>
                </Link>
                <Link
                  href="/pages/admin/deletedCars"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Deleted Cars</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Vehicles
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalVehicles}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Available
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {availableVehicles}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rented</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rentedVehicles}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Maintenance
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {maintenanceVehicles}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedCars && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedCars.id} selected
                  </span>
                  <button
                    onClick={() => handleOpenModal(selectedCars)}
                    className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Update</span>
                  </button>
                  <button
                    onClick={handleMarkAsRented}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Mark as Rented</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4"></th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      License Plate
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Specs
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Daily Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => {
                    const isSelected = selectedCars?.id === car.id;
                    return (
                      <tr
                        key={car.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleCarSelect(car, e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {car.id}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {car.year}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                          {car.licensePlate}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {car.category.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">
                            {car.location.city}
                          </div>
                          <div className="text-xs text-gray-500">
                            {car.location.address}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">
                            {car.seats} seats
                          </div>
                          <div className="text-xs text-gray-500">
                            {car.transmission} • {car.fuelType}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              car.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {car.available ? "Available" : "Rented"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          ${car.category.dailyRate}/day
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredCars.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No cars found matching your search."
                    : "No cars available."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedCar && (
        <UpdateCarModal
          car={selectedCar}
          onClose={handleCloseModal}
          categories={categories}
          isLoading={categoryLoading}
          locations={locations}
          locationsLoading={locationLoading}
        />
      )}
    </AdminDashboardLayout>
  );
}
