"use client";
import React, { useState } from "react";
import { Sidebar } from "../Components/admin/Sidebar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({
  children,
}: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={"overview"}
          setActiveTab={() => ""}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <div className="p-6 ">{children}</div>
        </div>
      </div>
  );
};
