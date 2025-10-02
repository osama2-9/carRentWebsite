"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Car,
  Calendar,
  CreditCard,
  ChevronRight,
  MapPin,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import { useAuth } from "@/app/store/auth";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NextRental } from "@/app/types/NextRent";
import { SignContract } from "@/app/Components/customer/SignContract";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { RenderActionSection } from "@/app/Components/customer/RenderAction";
const CustomerDashboard = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [showSignModal, setShowSignModal] = useState(false);
  const [nextRental, setNextRental] = useState<NextRental | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const urlSessionId = useSearchParams();
  const hasHandledPayment = useRef(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenSignModal = () => {
    setShowSignModal(true);
  };
  const getLastRental = async () => {
    try {
      const response = await axiosInstance.get("/user/get-next-rental", {
        params: {
          userId: user?.id,
        },
      });
      const data = await response.data;
      return data?.lastRental;
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status !== 404) {
        toast.error(error?.response?.data?.error || "Failed to fetch rental");
      }
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["lastRental", user?.id],
    queryFn: getLastRental,
    staleTime: 1000 * 60 * 5,
    enabled: !!user?.id && isClient,
  });

  useEffect(() => {
    if (data) {
      setNextRental(data);
    }
  }, [data]);
  const handleSignSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["lastRental", user?.id] });
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Failed to load Stripe");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          rentalId: nextRental?.id,
          customerId: user?.id,
          amount: nextRental?.totalCost,
        }
      );
      const data = await response.data;
      if (data?.url) {
        const { url } = data;
        router.push(url);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed to fetch rental");
    }
  };

  const handlePaymentSuccess = async (sessionId: string, rentalId: string) => {
    try {
      const response = await axiosInstance.post(
        "/payment/verify-payment-session",
        {
          sessionId: sessionId,
          rentalId: rentalId,
        }
      );
      const data = await response.data;
      if (data.success) {
        toast.success("Payment successful");
        router.push("/pages/customer/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed to verify payment");
    }
  };

  useEffect(() => {
    if (!isClient || hasHandledPayment.current) return;

    const sessionIdFromUrl = urlSessionId.get("session_id");
    if (sessionIdFromUrl && nextRental?.id) {
      hasHandledPayment.current = true;
      handlePaymentSuccess(sessionIdFromUrl, String(nextRental.id));
    }
  }, [urlSessionId, isClient, nextRental?.id]);

  const handleStartTrack = async () => {
    if (!nextRental?.id) {
      toast.error("No rental found to track");
      return;
    }
    router.push(`/pages/customer/track?rentalId=${nextRental.id}`);
  };

  const isContractSigned = nextRental?.rentalContract?.isSigned;
  const contractUrl = nextRental?.rentalContract?.contractUrl;
  const paymentStatus = nextRental?.payment?.status || null;

  const isRentalCompleted =
    nextRental?.status === "COMPLETED" ||
    (nextRental?.endDate
      ? new Date(nextRental.endDate).toLocaleDateString() <
        new Date().toLocaleDateString()
      : false);

  if (!isClient || (isClient && isLoading && !data)) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your rentals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Rentals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {nextRental ? 1 : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${nextRental?.totalCost?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Contract Status
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {isContractSigned ? "Signed" : "Pending"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                {isContractSigned ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <FileText className="w-6 h-6 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {nextRental ? (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {nextRental.status === "COMPLETED"
                  ? "Last Rental"
                  : "Current Rental"}
              </h2>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    nextRental.status === "COMPLETED"
                      ? "bg-green-400"
                      : nextRental.status === "CONFIRMED"
                      ? "bg-blue-400"
                      : nextRental.status === "PENDING"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                ></div>
                <span className="text-sm font-medium capitalize">
                  {nextRental.status.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {nextRental.car.make} {nextRental.car.model}
                    </h3>
                    <p className="text-blue-100">{nextRental.car.year}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-blue-100 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p>{nextRental.car.location.address}</p>
                    <p>
                      {nextRental.car.location.city},{" "}
                      {nextRental.car.location.country}
                    </p>
                    {nextRental.car.location.googleMapsUrl && (
                      <a
                        href={nextRental.car.location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-blue-200 transition-colors"
                      >
                        View on Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-blue-100 text-sm block">Pick-up</span>
                    <span className="font-semibold">
                      {new Date(nextRental.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-blue-100 text-sm block">
                      {nextRental.pickupTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-100 text-sm block">
                      Drop-off
                    </span>
                    <span className="font-semibold">
                      {new Date(nextRental.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-blue-100 text-sm block">
                      {nextRental.returnTime}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Cost</span>
                    <span className="text-2xl font-bold">
                      ${nextRental.totalCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">
                      Contract:{" "}
                      {isContractSigned ? "Signed" : "Pending Signature"}
                    </span>
                    {isContractSigned && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  {paymentStatus && (
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">
                        Payment:{" "}
                        <span className="capitalize">
                          {paymentStatus === "success"
                            ? "Completed"
                            : paymentStatus}
                        </span>
                      </span>
                      {paymentStatus === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {paymentStatus === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                      {paymentStatus === "failed" && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isRentalCompleted && (
              <RenderActionSection
                contractUrl={contractUrl}
                handleOpenSignModal={handleOpenSignModal}
                handlePayment={handlePayment}
                handleStartTrack={handleStartTrack}
                isContractSigned={isContractSigned}
                nextRental={nextRental}
                paymentStatus={paymentStatus}
              />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Rentals Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't made any car rentals yet. Start exploring our
              available cars!
            </p>
            <button
              onClick={() => {
                window.location.href = "/cars";
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {nextRental ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {nextRental.car.make} {nextRental.car.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    {nextRental.status === "COMPLETED" ? "Completed" : "Active"}{" "}
                    • {new Date(nextRental.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${nextRental.totalCost.toFixed(2)}
                </p>
                <div
                  className={`flex items-center space-x-1 ${
                    nextRental.status === "COMPLETED"
                      ? "text-green-600"
                      : nextRental.status === "CONFIRMED"
                      ? "text-blue-600"
                      : nextRental.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                >
                  <span className="text-xs font-medium capitalize">
                    {nextRental.status.toLowerCase()}
                  </span>
                  {nextRental.status === "COMPLETED" && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No recent activity yet.
            </div>
          )}
        </div>
      </div>

      {showSignModal && nextRental && (
        <SignContract
          onSuccess={handleSignSuccess}
          rentalId={nextRental.id}
          onClose={() => setShowSignModal(false)}
          user={user}
        />
      )}
    </CustomerDashboardLayout>
  );
};
export default CustomerDashboard;
