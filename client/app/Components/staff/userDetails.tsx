import axiosInstance from "@/app/axios/axios";
import {
  CheckCircle,
  Eye,
  FileCheck,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export const UserDetails = ({ user, setSelectedItem }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleVerifyCustomerDocuments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/staff/verify-customer-document",
        {},
        {
          params: {
            customerId: user?.id,
          },
        }
      );
      const data = await res.data;
      if (data.success) {
        setSelectedItem((prevSelcetedUser: any) => ({
          ...prevSelcetedUser,
          documentsVerified: true,
        }));
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.documentsVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {user.documentsVerified ? "Verified" : "Pending"}
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-900">{user.phone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Role:</span>
                <span className="ml-2 text-gray-900">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <FileCheck className="w-5 h-5 mr-2" />
              Documents
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col justify-center items-center space-y-3">
                {user.passportUrl ? (
                  <>
                    <div className="hover:scale-105">
                      <Image
                        onClick={() => window.open(user.passportUrl)}
                        src={user.passportUrl}
                        alt="user passport url"
                        width={300}
                        height={300}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 h-32 bg-red-50 rounded-md flex flex-col items-center justify-center border-2 border-red-200">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-center text-red-600 font-medium">
                        Passport image not provided
                      </p>
                      <p className="text-center text-red-400 text-sm">
                        User needs to upload a valid passport image
                      </p>
                    </div>
                  </div>
                )}
                {user.driverLicenseUrl ? (
                  <>
                    <div className="hover:scale-105">
                      <Image
                        onClick={() => window.open(user.driverLicenseUrl)}
                        src={user.driverLicenseUrl}
                        alt="driver License"
                        width={300}
                        height={300}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 h-32 bg-red-50 rounded-md flex flex-col items-center justify-center border-2 border-red-200">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-center text-red-600 font-medium">
                        Driver LicenseUrl image not provided
                      </p>
                      <p className="text-center text-red-400 text-sm">
                        User needs to upload a valid Driver License image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {!user.documentsVerified && (
                <button
                  disabled={loading}
                  onClick={handleVerifyCustomerDocuments}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Documents
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
