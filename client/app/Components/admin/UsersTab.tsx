import { Activity, Download, Plus, Star, TrendingUp, Users } from 'lucide-react';
import React from 'react'

export const UsersTab = () => {
  return (
    <div>
      {" "}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage customer accounts and relationships
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-purple-900">2,847</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-green-900">1,923</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    New This Month
                  </p>
                  <p className="text-2xl font-bold text-blue-900">143</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    Avg. Rating
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">4.7</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <p className="text-gray-600">
            Complete customer relationship management with profile management,
            booking history, communication logs, loyalty programs, and customer
            support integration.
          </p>
        </div>
      </div>
    </div>
  );
}
