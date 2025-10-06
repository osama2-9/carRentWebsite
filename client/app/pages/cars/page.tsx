"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CarCard } from "@/app/Components/CarCard";
import axiosInstance from "@/app/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { FilterCarsResponse, Pagination } from "@/app/types/FilterCarPage";
import { CarType } from "@/app/types/Car";
import {
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  YEAR_OPTIONS,
} from "@/app/types/constants/CarFilter";
import Select from "react-select";

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [makes, setMakes] = useState<{ value: string; label: string }[]>([]);

  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    seats: "",
    fuelType: "",
    transmission: "",
    available: "",
  });

  const fetchCars = async () => {
    const response = await axiosInstance.get<FilterCarsResponse>(
      "/car/filter",
      {
        params: { ...filters },
      }
    );
    return response.data;
  };

  const fetchCarsMake = async () => {
    const response = await axiosInstance.get("/car/make");
    return response.data.data.map((m: { make: string }) => ({
      value: m.make,
      label: m.make,
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["carsToFilter", filters, pagination.page, pagination.limit],
    queryFn: fetchCars,
  });

  const { data: makesData } = useQuery({
    queryKey: ["makes"],
    queryFn: fetchCarsMake,
  });

  useEffect(() => {
    if (data) {
      setCars(data.data.cars || []);
      setPagination(data.data.pagination);
    }
    if (makesData) {
      setMakes(makesData);
    }
  }, [data, makesData]);

  const handleFilterChange = (name: string, value: string | number | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value ? value.toString() : "",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      make: "",
      model: "",
      year: "",
      seats: "",
      fuelType: "",
      transmission: "",
      available: "",
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Car
          </h1>
          <p className="text-gray-600">
            Browse our selection of {pagination.total} vehicles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside
            className={`${
              showFilters ? "w-80" : "w-0"
            } transition-all duration-300 overflow-hidden`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <Select
                    options={makes}
                    isSearchable
                    value={makes.find((m) => m.value === filters.make) || null}
                    onChange={(option) =>
                      handleFilterChange("make", option?.value || "")
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <Select
                    options={YEAR_OPTIONS}
                    isSearchable
                    value={
                      YEAR_OPTIONS.find((y) => y.value === filters.year) || null
                    }
                    onChange={(option) =>
                      handleFilterChange("year", option?.value || "")
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seats
                  </label>
                  <Select
                    options={Array.from({ length: 8 }, (_, i) => ({
                      value: (i + 2).toString(),
                      label: `${i + 2} seats`,
                    }))}
                    isSearchable
                    value={
                      filters.seats
                        ? {
                            value: filters.seats,
                            label: `${filters.seats} seats`,
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleFilterChange("seats", option?.value || "")
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <Select
                    options={FUEL_TYPE_OPTIONS}
                    isSearchable
                    value={
                      FUEL_TYPE_OPTIONS.find(
                        (f) => f.value === filters.fuelType
                      ) || null
                    }
                    onChange={(option) =>
                      handleFilterChange("fuelType", option?.value || "")
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <Select
                    options={TRANSMISSION_OPTIONS}
                    isSearchable
                    value={
                      TRANSMISSION_OPTIONS.find(
                        (t) => t.value === filters.transmission
                      ) || null
                    }
                    onChange={(option) =>
                      handleFilterChange("transmission", option?.value || "")
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="available"
                        value="true"
                        checked={filters.available === "true"}
                        onChange={(e) =>
                          handleFilterChange("available", e.target.value)
                        }
                      />
                      <span>Available</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="available"
                        value="false"
                        checked={filters.available === "false"}
                        onChange={(e) =>
                          handleFilterChange("available", e.target.value)
                        }
                      />
                      <span>Not Available</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </button>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No cars found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {cars.map((car, index) => (
                    <CarCard key={index} car={car} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= pagination.page - 1 &&
                          page <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg ${
                              pagination.page === page
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
