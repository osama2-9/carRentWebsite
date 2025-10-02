"use client";
import { useEffect, useState } from "react";
import Sidebar from "../Components/customer/Sidebar";
import { isMobile } from "../utils/screenSizeChecker";
import { useAuth } from "../store/auth";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {isLoading, user} = useAuth()

  useEffect(() => {
    isMobile({
      isOpen: isSidebarOpen,
      setIsOpen: setIsSidebarOpen,
    });
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto p-6 bg-gray-50">{children}</div>
    </div>
  );
}
