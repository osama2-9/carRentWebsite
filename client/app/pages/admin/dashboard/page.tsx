"use client";
import React, { useState, useEffect } from "react";
import { Car, Star, ExternalLink } from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { StatsCard } from "@/app/Components/admin/StatusCard";
import { RevenueChart } from "@/app/Components/admin/RevenuChart";
import { RecentBooking } from "@/app/Components/admin/RecentBooking";
import { useGetDashboardData } from "@/app/hooks/useGetDashboardData";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";

const categoryData = [
  { name: "Economy", value: 35, color: "#0088FE" },
  { name: "Compact", value: 28, color: "#00C49F" },
  { name: "Mid-size", value: 20, color: "#FFBB28" },
  { name: "Luxury", value: 12, color: "#FF8042" },
  { name: "SUV", value: 5, color: "#8884d8" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isClient, setIsClient] = useState(false);

  const {
    metrics,
    isMetricsLoading,
    revenueChartData,
    fleetDistribution,
    topPerformingVehicles,
    recentBookings,
    page,
    handlePageChange,
    handlePageReset,
    handlePageDecrement,
  } = useGetDashboardData();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <AdminDashboardLayout>
        <div className=" min-h-screen bg-gray-50">
          <div className=" bg-white shadow-sm"></div>
          <div className="flex-1">
            <div className="h-16 bg-white shadow-sm"></div>
            <div className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div>
          <main className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatsCard
                    title="Total Revenue"
                    value={metrics?.revenue || 0}
                    isLoading={isMetricsLoading}
                  />
                  <StatsCard
                    title="Active Rentals"
                    value={metrics?.totalCars || 0}
                    isLoading={isMetricsLoading}
                  />
                  <StatsCard
                    title="Total Users"
                    value={metrics?.totalUsers || 0}
                    isLoading={isMetricsLoading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <RevenueChart data={revenueChartData || []} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Fleet Distribution
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={fleetDistribution || categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {(fleetDistribution || categoryData)?.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {(fleetDistribution || categoryData)?.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-gray-700">{item.name}</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.value}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Top Performing Vehicles
                      </h3>
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2">
                        <span>View All</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(topPerformingVehicles?.length ?? 0) > 0 ? (
                        topPerformingVehicles?.map((car, index) => (
                          <div
                            key={car.carId}
                            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg text-sm">
                              {index + 1}
                            </div>
                            <img
                              src={
                                car.featuredImage || "/api/placeholder/64/48"
                              }
                              alt={`${car.make} ${car.model}`}
                              className="w-16 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/api/placeholder/64/48";
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {car.make} {car.model}
                                  </h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{car.rentals} rentals</span>
                                    {car.avgRating && (
                                      <span className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{car.avgRating}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">
                                    ${car.totalRevenue.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    revenue
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Car className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No vehicles
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            No top performing vehicles data available.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <RecentBooking
                  recentRentals={
                    Array.isArray(recentBookings) ? recentBookings : []
                  }
                  page={page}
                  onPageChange={handlePageChange}
                  onPageReset={handlePageReset}
                  onPageDecrement={handlePageDecrement}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
