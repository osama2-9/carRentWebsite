import { Activity, Award, Download, TrendingUp } from 'lucide-react';
import React from 'react'

export const AnalyticsTab = () => {
  return (
    <div>
      {" "}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Analytics & Reports
              </h2>
              <p className="text-gray-600 mt-1">
                Comprehensive business intelligence and insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Revenue Growth
                  </p>
                  <p className="text-3xl font-bold text-green-900">+24.5%</p>
                  <p className="text-sm text-green-600 mt-1">vs last period</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Utilization Rate
                  </p>
                  <p className="text-3xl font-bold text-blue-900">84.2%</p>
                  <p className="text-sm text-blue-600 mt-1">fleet efficiency</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Customer Retention
                  </p>
                  <p className="text-3xl font-bold text-purple-900">92.1%</p>
                  <p className="text-sm text-purple-600 mt-1">
                    repeat customers
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600">
            Advanced analytics dashboard with predictive insights, seasonal
            trends, customer behavior analysis, profitability reports, and
            customizable KPI tracking would be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
