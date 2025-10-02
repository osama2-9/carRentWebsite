import { Filter, Plus } from "lucide-react";
import React from "react";

export const BookingTab = () => {
  return (
    <div>
      {" "}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Booking Management
              </h2>
              <p className="text-gray-600 mt-1">
                Track and manage all rental bookings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select className="bg-transparent text-sm font-medium text-gray-700 border-none focus:outline-none">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* Booking Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-900">847</p>
              <p className="text-sm text-blue-600">Total Bookings</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-900">45</p>
              <p className="text-sm text-green-600">Active</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-900">732</p>
              <p className="text-sm text-indigo-600">Completed</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-900">28</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-900">42</p>
              <p className="text-sm text-red-600">Cancelled</p>
            </div>
          </div>

          <p className="text-gray-600">
            Advanced booking management system with real-time updates, customer
            communication tools, payment processing, and automated workflow
            management would be available here.
          </p>
        </div>
      </div>
    </div>
  );
};
