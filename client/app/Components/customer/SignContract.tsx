"use client";
import React, { useState } from "react";
import { X, FileText, CheckCircle, Download, Eye, Loader2 } from "lucide-react";
import axiosInstance from "@/app/axios/axios";
import toast from "react-hot-toast";
import { UserSliceState } from "@/app/store/userSlice";

interface SignContractProps {
  rentalId: number;
  contractUrl?: string;
  onClose: () => void;
  onSuccess?: () => void; // Add callback for successful signing
  user: UserSliceState["user"];
}

export const SignContract: React.FC<SignContractProps> = ({
  rentalId,
  contractUrl,
  onClose,
  onSuccess,
  user,
}) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");
  const [contractAccepted, setContractAccepted] = useState(false);

  const downloadContract = () => {
    if (contractUrl) {
      const link = document.createElement("a");
      link.href = contractUrl;
      link.download = `rental-contract-${rentalId}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewContract = () => {
    if (contractUrl) {
      window.open(contractUrl, "_blank");
    }
  };

  const requestSignEmail = async () => {
    try {
      if (!agreed || !contractAccepted) {
        toast.error("Please agree to the terms and conditions");
        return;
      }

      setIsLoading(true);
      setServerErrorMessage("");

      const response = await axiosInstance.post(
        `/user/request-sign-on-contract`,
        {
          rentalId,
          userId: user?.id,
        }
      );

      const data = await response.data;

      if (data.success) {
        setIsSigned(true);
        toast.success("We have sent you an email to sign the contract");

        if (onSuccess) {
          onSuccess();
        }

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to send contract signing email";
      setServerErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-900">
            Sign Rental Contract
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!isSigned ? (
            <div className="space-y-6">
              {contractUrl && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">
                        Rental Contract
                      </h4>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={viewContract}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={downloadContract}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Please review the contract before signing. Click "View" to
                    open in a new tab or "Download" to save a copy.
                  </p>
                </div>
              )}

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="contractAcceptance"
                    className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    checked={contractAccepted}
                    onChange={(e) => setContractAccepted(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="contractAcceptance"
                    className="text-amber-800 text-sm"
                  >
                    <strong>
                      I have read and understood the rental contract terms and
                      conditions.
                    </strong>
                    <br />
                    This includes but is not limited to: rental duration,
                    payment terms, insurance coverage, damage policies, and
                    return conditions.
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    readOnly={true}
                    placeholder="Your full legal name"
                    className="w-full cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={user?.name}
                    disabled={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    readOnly={true}
                    placeholder="Your email address"
                    className="w-full cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={user?.email}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-700">
                    I understand that this digital signature has the same legal
                    effect as a handwritten signature. I am legally bound by the
                    terms of this contract and acknowledge that I have the
                    authority to sign this agreement.
                  </label>
                </div>
              </div>

              {serverErrorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold text-center">
                    {serverErrorMessage}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={requestSignEmail}
                  className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={isLoading || !agreed || !contractAccepted}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Sign Contract</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Contract Signed Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                Your digital signature has been recorded and the contract is now
                legally binding.
              </p>
              <p className="text-sm text-gray-500">
                You will receive a copy of the signed contract via email
                shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
