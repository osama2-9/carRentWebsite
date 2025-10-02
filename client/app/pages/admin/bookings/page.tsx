"use client";
import React, { useEffect, useState } from "react";
import {
  Car,
  Edit,
  Eye,
  Mail,
  Phone,
  Plus,
  Star,
  Trash2,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Clock,
  User,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { ShowRentDetails } from "@/app/Components/admin/ShowRentDetails";

const AdminBookingsTable = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  );

  const [showRentModal, setShowRentModal] = useState(false);

  const handleFetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/admin/bookings-details", {
        params: {
          page: currentPage,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch bookings");
    }
  };

  const { data } = useQuery({
    queryKey: ["bookings", currentPage],
    queryFn: handleFetchBookings,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const handleViewBooking = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setShowRentModal(true);
  };

  const handleDeleteBooking = (bookingId: number) => {
    try {
      const response = axiosInstance.delete(`/admin/cancel-booking`, {
        params: {
          bookingId: bookingId,
        },
      });
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete booking");
    }
  };

  const handleViewContract = (contract:BookingDetails) => {
   window.open(contract.rentalContract.contractUrl, "_blank");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Clock className="w-3 h-3" />;
      case "PENDING":
        return <Clock className="w-3 h-3" />;
      case "COMPLETED":
        return <Star className="w-3 h-3" />;
      case "CANCELLED":
        return <Trash2 className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bookings Management
          </h1>
          <p className="text-gray-600">
            Manage all rental bookings, payments, and customer information
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rental Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings?.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Booking Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          #{booking.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(booking.createdAt).toLocaleString()}
                        </span>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {booking.car.location.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {booking.user.name}
                          </span>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            <span>{booking.user.email}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{booking.user.phone}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                booking.user.documentsVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.user.documentsVerified
                                ? "✓ Verified"
                                : "✗ Unverified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <Car className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {booking.car.make} {booking.car.model}
                          </span>
                          <span className="text-xs text-gray-500">
                            {booking.car.year} • {booking.car.licensePlate}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {booking.car.category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ${booking.car.category.dailyRate}/day
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Rental Period */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <span>
                            {calculateDays(booking.startDate, booking.endDate)}{" "}
                            days
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div>
                            From: {new Date(booking.startDate).toLocaleString()}{" "}
                            at {booking.pickupTime}
                          </div>
                          <div>
                            To: {new Date(booking.endDate).toLocaleString()} at{" "}
                            {booking.returnTime}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">
                            ${booking?.payment?.amount}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs font-medium ${getPaymentStatusColor(
                              booking?.payment?.status ?? ""
                            )}`}
                          >
                            {booking?.payment?.status}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            via {booking?.payment?.method}
                          </span>
                        </div>
                        {booking?.payment?.paidAt && (
                          <span className="text-xs text-gray-500">
                            Paid:{" "}
                            {new Date(
                              booking?.payment?.paidAt
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </div>
                        {booking.rentalContract && (
                          <div className="flex items-center mt-2">
                            <FileText className="w-3 h-3 mr-1 text-gray-400" />
                            <span
                              className={`text-xs ${
                                booking.rentalContract.isSigned
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {booking.rentalContract.isSigned
                                ? "Contract Signed"
                                : "Pending Signature"}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Booking"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {booking.status === "PENDING" && (
                          <button
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {booking.rentalContract && (
                          <button
                          onClick={()=>handleViewContract(booking)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Contract"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No bookings match your current search criteria.
              </p>
            </div>
          )}

          {filteredBookings.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage == totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedBooking && (
        
        
        <>
          <ShowRentDetails
            rental={selectedBooking}
            showRentModal={showRentModal}
            setShowRentModal={() => setShowRentModal(!showRentModal)}
          />
        </>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminBookingsTable;
