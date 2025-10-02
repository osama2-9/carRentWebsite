"use client";
import {
  Calendar,
  Car,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  Settings,
  Star,
  User,
} from "lucide-react";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}) {
  const sidebarItems = [
    { href: "/pages/customer/dashboard", label: "Overview", icon: Car },
    { href: "/pages/customer/rentals", label: "My Rentals", icon: Calendar },
    { href: "/pages/customer/payments", label: "Payments", icon: CreditCard },
    { href: "/pages/customer/reviews", label: "My Reviews", icon: Star },
    { href: "/pages/customer/documents", label: "Documents", icon: FileText },
    { href: "/pages/profile", label: "Profile", icon: User },
    { href: "/pages/customer/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {isSidebarOpen && (
          <h1 className="text-xl font-semibold text-blue-600">easyDrive</h1>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-2 py-4 border-t border-gray-200">
        <a
          href="/logout"
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </a>
      </div>
    </div>
  );
}

