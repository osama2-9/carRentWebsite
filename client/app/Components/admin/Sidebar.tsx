"use client";
import {
  Activity,
  BarChart3,
  Calendar,
  Car,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Users,
  LocateIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

interface AdminSideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: AdminSideBarProps) => {
  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: BarChart3,
      href: "/pages/admin/dashboard",
    },
    {
      id: "cars",
      label: "Fleet Management",
      icon: Car,
      href: "/pages/admin/fleetManagment",
    },
    {
      id: "rentals",
      label: "Bookings",
      icon: Calendar,
      href: "/pages/admin/bookings",
    },
    {
      id: "users",
      label: "Customers",
      icon: Users,
      href: "/pages/admin/users",
    },
    {
      id: "locations",
      label: "Locations",
      icon: MapPin,
      href: "/pages/admin/locations",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Activity,
      href: "/pages/admin/analytics",
    },
    {
      id: "tracking",
      label: "Tracking",
      icon: LocateIcon,
      href: "/pages/admin/tracking",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: StarIcon,
      href: "/pages/admin/reviews",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-950 to-blue-900 z-50 shadow-2xl transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"} 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div
            className={`flex items-center gap-2 ${
              !isOpen && "lg:justify-center w-full"
            }`}
          >
            {isOpen && (
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-800" />
              </div>
            )}
            {isOpen && (
              <Link href="/" title="homepage" className="text-white text-lg font-bold">easyDrive</Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center transition-all cursor-pointer  text-white"
          >
            <Menu />
          </button>
        </div>

        <nav className="p-4 h-full flex flex-col">
          <ul className="space-y-2 flex-grow">
            {menuItems.map(({ id, label, icon: Icon, href }) => (
              <li key={id}>
                <Link href={href}>
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-blue-100 hover:bg-blue-800 hover:text-white transition-all duration-200 ${
                      !isOpen ? "justify-center" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="ml-3 truncate">{label}</span>}
                  </button>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-blue-700 pt-4 space-y-2">
            <button
              className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {isOpen && <span className="ml-3">Settings</span>}
            </button>

            <button
              className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-blue-100 hover:bg-red-500 hover:text-white transition-all duration-200 ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
