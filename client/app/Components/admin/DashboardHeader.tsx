"use client";
import { useAuth } from "@/app/store/auth";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
interface AdminDashboardHeaderProps {
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}
export const AdminDashboardHeader = ({
  activeTab,
  setSidebarOpen,
  sidebarOpen,
}: AdminDashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const {user} = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="bg-white shadow-sm    border-b   border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "cars"
                ? "Fleet Management"
                : activeTab === "rentals"
                ? "Booking Management"
                : activeTab === "users"
                ? "Customer Management"
                : activeTab === "locations"
                ? "Location Management"
                : activeTab === "analytics"
                ? "Analytics & Reports"
                : "Dashboard"}
            </h1>
            <p className="text-gray-600 text-sm">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          
            <div className="hidden md:block">
              <p className="font-semibold text-gray-900">{user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
