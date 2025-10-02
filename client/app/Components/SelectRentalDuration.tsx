import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, CheckCircle, Loader } from "lucide-react";
import { CarType } from "../types/Car";
import toast from "react-hot-toast";
import axiosInstance from "../axios/axios";
import { useAuth } from "../store/auth";

interface RentalProps {
  car: CarType;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function SelectRentalDuration({ car, isOpen, setIsOpen }: RentalProps) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const timeDiff = returnD.getTime() - pickup.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const days = calculateDays();
  const subtotal = days * car.category.dailyRate;
  const taxes = Math.round(subtotal * 0.12 * 100) / 100;
  const total = subtotal + taxes;

  const handleConfirm = async () => {
    try {
      if (!pickupDate || !returnDate || days <= 0) {
        toast.error("Please select valid pickup and return dates");
        return;
      }

      const today = new Date();
      const pickup = new Date(pickupDate);
      today.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);

      if (pickup < today) {
        toast.error("Pickup date cannot be in the past");
        return;
      }

      setIsLoading(true);

      const res = await axiosInstance.post("/user/rent-car-request", {
        carId: car?.id,
        userId: user?.id,
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
        total,
      });

      if (res.data) {
        toast.success(`Reservation confirmed! Total: $${total.toFixed(2)}`);
        setIsOpen(false);

        setPickupDate("");
        setReturnDate("");
        setPickupTime("10:00");
        setReturnTime("10:00");

        console.log("Rental created:", res.data);
      }
    } catch (error: any) {
      console.error("Reservation error:", error);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        toast.error("Please check your input and try again");
      } else if (error.response?.status === 404) {
        toast.error("Car or user not found");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error("Something went wrong. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMinReturnDate = () => {
    if (!pickupDate) return getTodayDate();
    const pickup = new Date(pickupDate);
    pickup.setDate(pickup.getDate() + 1);
    return pickup.toISOString().split("T")[0];
  };

  const handleClose = () => {
    if (isLoading) return; 
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Reserve Your Car
              </h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={car.featuredImage}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {car.location.address}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ${car.category.dailyRate}
                    </div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Pickup */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Pickup
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={getTodayDate()}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Return */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Return
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={getMinReturnDate()}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Duration Display */}
              {days > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Rental Duration: {days} {days === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {days > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Price Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ${car.category.dailyRate} × {days}{" "}
                        {days === 1 ? "day" : "days"}
                      </span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span className="font-medium">${taxes.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Included Benefits */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-900 mb-2">
                  Included Benefits
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                  {[
                    "Free cancellation up to 24h",
                    "Full insurance included",
                    "24/7 roadside assistance",
                    "Clean & sanitized vehicle",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={
                    !pickupDate || !returnDate || days <= 0 || isLoading
                  }
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Reservation
                      {days > 0 && (
                        <span className="ml-2 font-bold">
                          ${total.toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
