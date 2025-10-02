import { getsStatus } from "@/app/utils/getStatus";
import { Car, Mail, Phone, Plus, Star } from "lucide-react";

interface RecentBookingProps {
  recentRentals: any[];
  page: number;
  onPageChange: () => void;
  onPageReset: () => void;
  onPageDecrement: () => void;
}

export const RecentBooking = ({
  recentRentals,
  page,
  onPageChange,
  onPageDecrement,
}: RecentBookingProps) => {
  const { getStatusIcon, getStatusColor } = getsStatus();

  const transformedRentals =
    recentRentals?.map((rental: any) => ({
      id: rental.id,
      location: "N/A",
      make: rental.car?.make || "Unknown",
      model: rental.car?.model || "Model",
      user: {
        name: rental.user?.name || "Unknown User",
        email: rental.user?.email || "No email",
        phone: rental.user?.phone || "No phone",
      },
      startDate: rental.startDate
        ? new Date(rental.startDate).toLocaleDateString()
        : "N/A",
      endDate: rental.endDate
        ? new Date(rental.endDate).toLocaleDateString()
        : "N/A",
      status: rental.status || "PENDING",
      totalCost: rental.payment?.amount || 0,
      rating: null,
    })) || [];

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Latest rental activities and status updates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:shadow-md hover:cursor-pointer transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {transformedRentals.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transformedRentals.map((rental: any) => (
                  <tr
                    key={rental.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          #{rental.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          {rental?.car?.location?.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {rental.make} {rental.model}
                          </p>
                          {rental.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">
                                {rental.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {rental.user.name}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{rental.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{rental.user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span>{rental.startDate}</span>
                        <span className="text-xs text-gray-400">to</span>
                        <span>{rental.endDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          rental.status
                        )}`}
                      >
                        {getStatusIcon(rental.status)}
                        <span className="ml-1">{rental.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          ${rental.totalCost.toLocaleString()}
                        </span>
                        {rental.status !== "CANCELLED" && (
                          <span className="text-xs text-green-600">Paid</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No bookings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No recent bookings available at the moment.
              </p>
            </div>
          )}
        </div>

        {transformedRentals.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing page {page} of recent bookings
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={onPageDecrement}
                disabled={page <= 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg">
                {page}
              </button>
              <button
                disabled={page == 3}
                onClick={onPageChange}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
