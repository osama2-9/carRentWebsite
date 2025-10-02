import axiosInstance from "@/app/axios/axios";
import { useGetStaffDashboardRental } from "@/app/hooks/useGetStaffDashboardRental";
import { Rentals } from "@/app/types/Rental";
import { getsStatus } from "@/app/utils/getStatus";
import {
  Calendar,
  Car,
  CheckCircle,
  Mail,
  MessageSquare,
  Phone,
  User,
  XCircle,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

interface RentalDetailsProps {
  rental: Rentals;
}

export const RentalDetails = ({ rental }: RentalDetailsProps) => {
  const { getContractStatus } = getsStatus();

  const handleStatusUpdate = (itemId: number, newStatus: string) => {
    console.log(`Updating ${itemId} to ${newStatus}`);
  };

  const handleMarkRentalAsCompleted = async () => {
    try {
      const response = await axiosInstance.post("/staff/mark-rental-as-completed", {
        rentalId: rental.id
      })
      const data = await response.data;
      if (data.success) {
        toast.success("Rental marked as completed")

      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error)

    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Rental #{rental.id}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getContractStatus(
              rental.status
            )}`}
          >
            {rental.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Name:</span>
                <span className="text-gray-900">{rental.user.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-900">{rental.user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-900">{rental.user.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Documents:
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${rental.user.documentsVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {rental.user.documentsVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Vehicle Information
            </h3>
            <div className="flex items-start space-x-4">
              <img
                src={rental.car.featuredImage}
                alt={`${rental.car.make} ${rental.car.model}`}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {rental.car.year} {rental.car.make} {rental.car.model}
                </p>
                <p className="text-gray-600">
                  Plate: {rental.car.licensePlate}
                </p>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-gray-600">
                    {rental.car.location.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Rental Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Start Date:</span>
                <p className="text-gray-900">{formatDate(rental.startDate)}</p>
                <p className="text-sm text-gray-600">
                  Pickup: {rental.pickupTime}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">End Date:</span>
                <p className="text-gray-900">{formatDate(rental.endDate)}</p>
                <p className="text-sm text-gray-600">
                  Return: {rental.returnTime}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Cost:</span>
                <p className="text-gray-900 font-semibold">
                  {rental.totalCost} USD (with TAX)
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Payment:</span>
                <div className="space-y-1">
                  <span
                    className={`px-2 py-1 rounded text-sm ${getContractStatus(
                      rental?.payment?.status
                    )}`}
                  >
                    {rental?.payment?.status}
                  </span>
                  <p className="text-sm text-gray-600">
                    Method: {rental?.payment?.method}
                  </p>
                  {rental?.payment?.paidAt && (
                    <p className="text-xs text-gray-500">
                      Paid: {formatDate(rental?.payment?.paidAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {rental.rentalContract?.contractUrl && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Contract
              </h3>
              <a
                href={rental.rentalContract.contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View Contract
              </a>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {rental.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(rental.id, "CONFIRMED")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Rental
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(rental.id, "CANCELLED")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              )}
              {rental.status === "CONFIRMED" && (
                <button

                  onClick={handleMarkRentalAsCompleted}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </button>
              )}
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
