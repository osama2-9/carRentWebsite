import { RefreshCw } from "lucide-react";

export const DashboardHeader = ({ activeCount, inactiveCount, onRefresh, isLoading }: {
  activeCount: number;
  inactiveCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}) => (
  <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Car Tracking Dashboard</h1>
        <p className="text-gray-600">Monitor all active rentals in real-time</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Active: {activeCount}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600">Inactive: {inactiveCount}</span>
        </div>
      </div>
    </div>
  </div>
);
