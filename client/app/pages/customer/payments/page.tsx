"use client";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import { useEffect, useState } from "react";
import { Payment } from "@/app/types/Payments";
import axiosInstance from "@/app/axios/axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  DollarSign,
  Car,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function Payments() {
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<Payment[]>([]);

  const filtredPaymnet = payments.filter((payment)=>payment.payment != null)

  const handleGetPayments = async () => {
    try {
      const response = await axiosInstance.get("/user/get-my-payment", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch payments");
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", page],
    queryFn: handleGetPayments,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setPayments(data.data);
    }
  }, [data]);

  const handleNextPage = () => {
    if (page < data?.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 size={14} /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock size={14} /> Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle size={14} /> {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-600 text-sm text-center mt-3">
              Loading your payment history...
            </p>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (isError) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
            <AlertCircle className="mx-auto text-red-500" size={32} />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Failed to load payments
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Payment History
          </h1>
          <p className="text-gray-600 mt-1">
            Review your past payments and transaction details
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CreditCard className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No payments found
            </h3>
            <p className="mt-2 text-gray-600">
              You haven't made any payments yet.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filtredPaymnet.map((payment) => (
                <div
                  key={payment.payment?.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {payment.car.make} {payment.car.model} (
                            {payment.car.year})
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(payment?.payment?.status)}
                          <span className="text-lg font-semibold text-gray-900">
                            {formatAmount(payment?.payment?.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-start">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Method
                            </p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {payment?.payment?.method}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Payment ID: {payment?.payment?.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Date
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(payment?.payment?.paidAt)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(
                                payment?.payment?.paidAt
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Transaction</p>
                            <p className="text-sm font-medium text-gray-900">
                              {payment?.payment?.status === "paid"
                                ? "Completed"
                                : "Processing"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Reference: #{payment?.payment?.id}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {payment?.payment?.status?.toLowerCase() ===
                          "success" && (
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Download Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data?.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{data.totalPages}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= data.totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page >= data.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
}
