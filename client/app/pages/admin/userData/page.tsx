"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  ZoomIn,
  Download,
} from "lucide-react";
import axiosInstance from "@/app/axios/axios";
import { useQuery } from "@tanstack/react-query";

interface UserData {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  stripeCustomerId: string | null;
  role: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiry: string | null;
  passwordResetToken: string | null;
  passwordResetTokenExpiry: string | null;
  passportUrl: string | null;
  driverLicenseUrl: string | null;
  proofOfAddressUrl: string | null;
  licenseExpiryDate: string | null;
  ValidationReport: string;
  documentsVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showValidationReport, setShowValidationReport] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  const fetchUserData = async () => {
    if (!userId) {
      throw new Error("No user ID provided");
    }

    try {
      const res = await axiosInstance.get("/admin/user", {
        params: {
          userId: userId,
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.data || !res.data.user) {
        throw new Error("No user data received from server");
      }

      return res.data.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userdata", userId],
    queryFn: fetchUserData,
    retry: 1,
  });

 
  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const handleImageError = (documentType: string) => {
    setImageLoadErrors((prev) => ({ ...prev, [documentType]: true }));
  };

  const ImageModal = ({
    imageUrl,
    onClose,
  }: {
    imageUrl: string;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Document"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <div className="absolute bottom-4 right-4">
          <a
            href={imageUrl}
            download
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );

  const DocumentCard = ({
    title,
    imageUrl,
    expiryDate,
    documentType,
  }: {
    title: string;
    imageUrl: string | null;
    expiryDate?: string | null;
    documentType: string;
  }) => (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-800 mb-3 text-center">{title}</h3>
      {imageUrl && !imageLoadErrors[documentType] ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => setSelectedImage(imageUrl)}
            onError={() => handleImageError(documentType)}
          />
          
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No document uploaded</p>
          </div>
        </div>
      )}

      <div className="mt-3 text-center">
        {imageUrl && !imageLoadErrors[documentType] ? (
          <div className="space-y-1">
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Verified</span>
            </div>
            {expiryDate && (
              <p className="text-xs text-gray-600">
                Expires: {formatDate(expiryDate)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Not Available</span>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading user data...</span>
        </div>
      </div>
    );
  }

  // Show error state with more details
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">
              Error loading user data
            </span>
          </div>
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          {!userId && (
            <p className="text-red-600 text-sm mt-2">
              No user ID found in URL parameters. Please ensure the URL includes
              ?userId=...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show no data state
  if (!userData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 font-medium">
              No user data found
            </span>
          </div>
          <p className="text-yellow-600 text-sm">
            {userId
              ? `No user found with ID: ${userId}`
              : "No user ID provided in URL parameters"}
          </p>
        </div>
      </div>
    );
  }

  const parseValidationReport = (reportString: string) => {
    try {
      return JSON.parse(reportString);
    } catch (error) {
      return null;
    }
  };

  const validationReport = parseValidationReport(userData.ValidationReport);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusBadge = ({
    status,
    label,
  }: {
    status: boolean;
    label: string;
  }) => (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status ? (
        <CheckCircle className="w-4 h-4 mr-1" />
      ) : (
        <XCircle className="w-4 h-4 mr-1" />
      )}
      {label}
    </div>
  );

  const getGenderColor = (gender: string) => {
    return gender === "MALE" ? "text-blue-600" : "text-pink-600";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-blue-100">Documents Control System</p>
              <p className="text-blue-200 text-sm">ID: {userData.id}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <StatusBadge
              status={userData.emailVerified}
              label="Email Verified"
            />
            <StatusBadge
              status={userData.documentsVerified}
              label="Documents Verified"
            />
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <User className="w-6 h-6 mr-2" />
          Personal Information
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {formatDate(userData.dateOfBirth)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium uppercase">{userData.nationality}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className={`w-5 h-5 ${getGenderColor(userData.gender)}`} />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className={`font-medium ${getGenderColor(userData.gender)}`}>
                  {userData.gender}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    userData.role
                  )}`}
                >
                  {userData.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Identity Documents
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <DocumentCard
            title="Passport"
            imageUrl={userData.passportUrl}
            documentType="passport"
          />

          <DocumentCard
            title="Driver License"
            imageUrl={userData.driverLicenseUrl}
            expiryDate={userData.licenseExpiryDate}
            documentType="license"
          />

          <DocumentCard
            title="Proof of Address"
            imageUrl={userData.proofOfAddressUrl}
            documentType="address"
          />
        </div>
      </div>

      {/* Validation Report */}
      {validationReport && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Document Validation Report
            </h2>
            <button
              onClick={() => setShowValidationReport(!showValidationReport)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              {showValidationReport ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>
                {showValidationReport ? "Hide Details" : "Show Details"}
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Passport Status</p>
                <p className="text-green-600 font-medium">
                  {validationReport.summary?.passportStatus}
                </p>
                <p className="text-sm text-gray-600">
                  Confidence:{" "}
                  {validationReport.passport?.validation?.confidence}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">License Status</p>
                <p className="text-green-600 font-medium">
                  {validationReport.summary?.licenseStatus}
                </p>
                <p className="text-sm text-gray-600">
                  Confidence: {validationReport.license?.validation?.confidence}
                  %
                </p>
              </div>
            </div>
          </div>

          {showValidationReport && (
            <div className="border-t pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Passport Validation Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Validation Score:</span>
                      <span className="font-medium">
                        {validationReport.passport?.validation?.score}/
                        {validationReport.passport?.validation?.maxScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <span className="font-medium">
                        {validationReport.passport?.validation?.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Text Extracted:</span>
                      <span className="font-medium">
                        {validationReport.passport?.textLength} chars
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    License Validation Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Validation Score:</span>
                      <span className="font-medium">
                        {validationReport.license?.validation?.score}/
                        {validationReport.license?.validation?.maxScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <span className="font-medium">
                        {validationReport.license?.validation?.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Text Extracted:</span>
                      <span className="font-medium">
                        {validationReport.license?.textLength} chars
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Processing Summary
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Processing Time:</span>
                    <p className="font-medium">
                      {validationReport.summary?.processingTime}ms
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Overall Success:</span>
                    <p className="font-medium">
                      {validationReport.summary?.overallSuccess ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Validated On:</span>
                    <p className="font-medium">
                      {formatDate(validationReport.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Account Information
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Account Created</p>
            <p className="font-medium">{formatDate(userData.createdAt)}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="font-medium">{formatDate(userData.updatedAt)}</p>
          </div>

          {userData.stripeCustomerId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Stripe Customer ID</p>
              <p className="font-mono text-sm">{userData.stripeCustomerId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
