import { getsStatus } from "@/app/utils/getStatus";
import { CheckCircle, Eye, FileText, Upload, XCircle, Download } from "lucide-react";
import Image from "next/image";
import { RentalContract } from "@/app/types/RentalContract";
import toast from "react-hot-toast";
import axiosInstance from "@/app/axios/axios";
interface ContractDetailsProps {
  contract: RentalContract;
}
export const ContractDetails = ({ contract }: ContractDetailsProps) => {
  const { getContractStatus } = getsStatus();

  const handleVerify = async () => {

    try {
      const response = await axiosInstance.post("/staff/verify-contract", {}, {
        params: {
          contractId: contract.id
        }
      })
      const data = await response.data;
      if (data.success) {
        toast.success("Contract verified successfully")
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to verify contract");

    }
  }



  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Contract #{contract.id}
          </h2>
          <p className="text-sm text-gray-500">
            Linked Rental: <span className="font-medium">{contract.rentalId}</span>
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getContractStatus(
            contract.verified
          )}`}
        >
          {contract.verified}
        </span>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        <section className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Contract Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Uploaded</dt>
              <dd className="text-gray-900">{new Date(contract.uploadedAt).toLocaleDateString()}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-600">Agreement Accepted</dt>
              <dd className="text-gray-900">
                {contract.agreementAccepted ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Signed At</dt>
              <dd className="text-gray-900">{new Date(contract.signedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </section>

        {contract.rental?.car && (
          <section className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Car Details</h3>
            <div className="flex gap-4">
              <div className="w-32 h-20 relative rounded-lg overflow-hidden border">
                <Image
                  src={contract.rental.car.featuredImage}
                  alt={`${contract.rental.car.make} ${contract.rental.car.model}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {contract.rental.car.make} {contract.rental.car.model}{" "}
                  ({contract.rental.car.year})
                </p>
                <p className="text-sm text-gray-600">
                  Plate: {contract.rental.car.licensePlate}
                </p>
                <p className="text-sm text-gray-600">
                  Daily Rate: ${contract.rental.car.category.dailyRate}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Signer Information</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Name</dt>
              <dd className="text-gray-900">{contract.signerName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Email</dt>
              <dd className="text-gray-900">{contract.signerEmail}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Signed</dt>
              <dd className="text-gray-900">
                {contract.isSigned ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Documents</h3>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white border rounded-lg shadow-sm p-3 w-40 flex flex-col items-center">
              <FileText className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-xs text-center text-gray-700">Rental Contract</p>
              <div className="mt-3 flex gap-2">
                <button className="text-blue-600 hover:underline flex items-center text-xs">
                  <Eye className="w-3 h-3 mr-1" /> View
                </button>
                <button className="text-green-600 hover:underline flex items-center text-xs">
                  <Download className="w-3 h-3 mr-1" /> Download
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-3 bg-white sticky bottom-0">
        {contract.verified === false && (
          <>
            <button onClick={handleVerify} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </button>
          </>
        )}

      </div>
    </div>
  );
};
