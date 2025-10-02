"use client";
import axiosInstance from "@/app/axios/axios";
import DocumentUploadView from "@/app/Components/customer/DocumentDataUpload";
import DocumentDataView from "@/app/Components/customer/DocumentDataView";
import { useGetCustomerDocs } from "@/app/hooks/useGetCustomerDocs";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import { useAuth } from "@/app/store/auth";
import { AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function CustomerDocuments() {
  const { user } = useAuth();
  const { docs, isLoading } = useGetCustomerDocs();

  const passportDoc = docs?.data?.passportUrl ?? null;
  const licenseDoc = docs?.data?.driverLicenseUrl ?? null;

  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >({
    passport: null,
    drivingLicense: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary upload preset is not defined.");
    }

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${file.name}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  const uploadAndVerifyDocuments = async () => {
    try {
      setIsUploading(true);

      if (!uploadedFiles.passport && !uploadedFiles.drivingLicense) {
        toast.error("Please upload at least one document");
        return;
      }

      let passportImageUrl = "";
      let licenseImageUrl = "";

      if (uploadedFiles.passport) {
        toast.loading("Uploading passport...");
        passportImageUrl = await uploadSingleFile(uploadedFiles.passport);
        toast.dismiss();
        toast.success("Passport uploaded successfully");
      }

      if (uploadedFiles.drivingLicense) {
        toast.loading("Uploading driving license...");
        licenseImageUrl = await uploadSingleFile(uploadedFiles.drivingLicense);
        toast.dismiss();
        toast.success("Driving license uploaded successfully");
      }

      toast.loading("Verifying documents...");
      await axiosInstance.post("/user/verify-documents", {
        passportImage: passportImageUrl,
        licenseImage: licenseImageUrl,
        userId: user?.id,
      });

      toast.dismiss();
      toast.success("Documents submitted for verification successfully!");
    } catch (error: any) {
      console.error(error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to upload documents"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Document Verification
            </h1>
            <p className="text-gray-600">
              Upload your identification documents for account verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {passportDoc ? (
              <DocumentDataView
                data={passportDoc}
                title="Passport"
                icon={FileText}
              />
            ) : (
              <DocumentUploadView
                type="passport"
                title="Passport"
                icon={FileText}
                uploadedFile={uploadedFiles.passport}
                setUploadedFiles={setUploadedFiles}
              />
            )}

            {licenseDoc ? (
              <DocumentDataView
                data={licenseDoc}
                title="Driving License"
                icon={FileText}
              />
            ) : (
              <DocumentUploadView
                type="drivingLicense"
                title="Driving License"
                icon={FileText}
                uploadedFile={uploadedFiles.drivingLicense}
                setUploadedFiles={setUploadedFiles}
              />
            )}
          </div>

          {(uploadedFiles.passport || uploadedFiles.drivingLicense) && (
            <div className="mb-8 text-center">
              <button
                onClick={uploadAndVerifyDocuments}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                {isUploading
                  ? "Uploading..."
                  : "Submit Documents for Verification"}
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Document Requirements
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Documents must be clear and all text must be legible</p>
                  <p>• Accepted formats: PNG, JPG, JPEG, PDF</p>
                  <p>• Maximum file size: 10MB per document</p>
                  <p>• Documents should be valid and not expired</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    📋 We will check your documents and notify you once
                    verification is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(!passportDoc || !licenseDoc) && (
            <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Verification Progress
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Documents Uploaded</span>
                    <span>
                      {
                        Object.values(uploadedFiles).filter(
                          (doc) => doc !== null
                        ).length
                      }{" "}
                      / {!passportDoc && !licenseDoc ? 2 : 1}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (Object.values(uploadedFiles).filter(
                            (doc) => doc !== null
                          ).length /
                            (!passportDoc && !licenseDoc ? 2 : 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
