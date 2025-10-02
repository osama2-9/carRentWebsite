"use client";
import { FaCar } from "react-icons/fa";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface ShowRentModalProps {
  rental: BookingDetails;
  showRentModal: boolean;
  setShowRentModal: () => void;
}

export const ShowRentDetails = ({
  rental,
  showRentModal,
  setShowRentModal,
}: ShowRentModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {showRentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={setShowRentModal}
            aria-hidden="true"
          />

          <div className="relative bg-white w-full max-w-4xl mx-4 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh] border border-gray-200 transform transition-all">
            <button
              onClick={setShowRentModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h2>
                <div
                  className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    rental.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-800"
                      : rental.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : rental.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {rental.status}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {rental.status == "CANCELLED" && rental.cancellationReason}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiUser className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      User Information
                    </h3>
                    <span
                      className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                        rental.user.documentsVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rental.user.documentsVerified ? (
                        <>
                          <FiCheckCircle className="mr-1" /> Verified
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="mr-1" /> Not Verified
                        </>
                      )}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex">
                      <span className="font-medium w-24">Name:</span>
                      <span>{rental.user.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Email:</span>
                      <span className="truncate">{rental.user.email}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Phone:</span>
                      <span>{rental.user.phone}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FaCar className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Car Information
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex">
                      <span className="font-medium w-24">Make/Model:</span>
                      <span>
                        {rental.car.make} {rental.car.model}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Year:</span>
                      <span>{rental.car.year}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">License:</span>
                      <span className="font-mono">
                        {rental.car.licensePlate}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Category:</span>
                      <span>{rental.car.category.name}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiCalendar className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Booking Dates
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex">
                      <span className="font-medium w-24">Start:</span>
                      <span>{formatDate(rental.startDate)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">End:</span>
                      <span>{formatDate(rental.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1 text-gray-500" />
                      <span className="font-medium w-20">Pickup:</span>
                      <span>{formatTime(rental.pickupTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1 text-gray-500" />
                      <span className="font-medium w-20">Return:</span>
                      <span>{formatTime(rental.returnTime)}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiDollarSign className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Payment Details
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex">
                      <span className="font-medium w-24">Amount:</span>
                      <span className="font-semibold">
                        {rental.payment
                          ? `$${rental.payment.amount.toFixed(2)}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Method:</span>
                      <span className="capitalize">
                        {rental.payment
                          ? rental.payment.method.toLowerCase()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-24">Status:</span>
                      {rental.payment ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                            rental.payment.status === "SUCCESS"
                              ? "bg-green-100 text-green-800"
                              : rental.payment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rental.payment.status === "SUCCESS" ? (
                            <FiCheckCircle className="mr-1" />
                          ) : (
                            <FiAlertCircle className="mr-1" />
                          )}
                          {rental.payment.status}
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Paid At:</span>
                      <span>
                        {rental.payment?.paidAt
                          ? new Date(rental.payment.paidAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiFileText className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Rental Contract
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center">
                      <span className="font-medium w-24">Signed:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          rental.rentalContract.isSigned
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rental.rentalContract.isSigned ? (
                          <>
                            <FiCheckCircle className="mr-1" /> Yes
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="mr-1" /> No
                          </>
                        )}
                      </span>
                    </div>
                    {rental.rentalContract.isSigned && (
                      <div className="flex">
                        <span className="font-medium w-24">Signed At:</span>
                        <span>
                          {formatDate(rental.rentalContract.signedAt)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-medium w-24">Verified:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          rental.rentalContract.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rental.rentalContract.verified ? (
                          <>
                            <FiCheckCircle className="mr-1" /> Yes
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="mr-1" /> No
                          </>
                        )}
                      </span>
                    </div>
                    {rental.rentalContract.contractUrl && (
                      <div className="pt-2">
                        <a
                          href={rental.rentalContract.contractUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FiFileText className="mr-1" /> View Contract Document
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="text-sm text-gray-500 text-right pt-4 border-t border-gray-200">
                Booking created on {formatDate(rental.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
