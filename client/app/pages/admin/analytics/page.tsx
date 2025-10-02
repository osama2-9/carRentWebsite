"use client";
import { ChartContainer } from "@/app/Components/admin/analyticsComponents/ChartContainer";
import { CustomTooltip } from "@/app/Components/admin/analyticsComponents/CustomTooltip";
import { useGetAdminAnalytics } from "@/app/hooks/useGetAdminAnalytics";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const COLORS = [
  "#3182CE",
  "#38A169",
  "#D69E2E",
  "#E53E3E",
  "#805AD5",
  "#DD6B20",
  "#319795",
  "#718096",
];
const GRADIENT_COLORS = ["#3182CE", "#4299E1", "#63B3ED", "#90CDF4"];

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export default function Analytics() {
  const {
    monthlyRentalCount,
    monthlyRentalRevenue,
    rentalStatus,
    fuelTypes,
    contractCompletion,
    rentalByCity,
    isMonthlyRentalCountLoading,
    isMonthlyRentalRevenueLoading,
    isRentalStatusLoading,
    isFuelTypesLoading,
    isContractCompletionLoading,
    isRentalByCityLoading,
  } = useGetAdminAnalytics();

  return (
    <AdminDashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            overview of rental performance and metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer
            title="Monthly Rental Count"
            isLoading={isMonthlyRentalCountLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRentalCount}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="rentals"
                  fill="#3182CE"
                  radius={[4, 4, 0, 0]}
                  name="Rentals"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Monthly Rental Revenue"
            isLoading={isMonthlyRentalRevenueLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRentalRevenue}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#38A169" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38A169" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#38A169"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <ChartContainer
            title="Rental Status Distribution"
            isLoading={isRentalStatusLoading}
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={rentalStatus}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {rentalStatus?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Vehicle Fuel Types"
            isLoading={isFuelTypesLoading}
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={fuelTypes}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {fuelTypes?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Contract Completion Status"
            isLoading={isContractCompletionLoading}
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={contractCompletion}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {contractCompletion?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[(index + 2) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ChartContainer
            title="Rentals by City"
            isLoading={isRentalByCityLoading}
          >
            {!isRentalByCityLoading &&
            (!rentalByCity || rentalByCity.length === 0) ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm">
                    Rental by city data will appear here when available
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={rentalByCity}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 12, textAnchor: "end" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#805AD5"
                    radius={[4, 4, 0, 0]}
                    name="Rentals"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
