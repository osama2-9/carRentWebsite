"use client";
import { useState, useEffect } from "react";
import {
  Save,
  Lock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  Shield,
  FileText,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/app/axios/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";

type Gender = "MALE" | "FEMALE" | null;

interface UserType {
  id: number;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: Gender;
  documentsVerified: boolean;
  passportUrl?: string;
  driverLicenseUrl?: string;
  proofOfAddressUrl?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [editData, setEditData] = useState<Partial<UserType>>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleGetUserProfile = async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: handleGetUserProfile,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setEditData(data);
    }
  }, [data]);

  const handleSaveProfileChanges = async () => {
    if (!user) return;
    try {
      const updatedProfile = { ...user, ...editData };
      const response = await axiosInstance.put("/auth/profile", updatedProfile);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(response.data.message);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  const renderDocStatus = (url?: string) => {
    return url ? (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-blue-600 font-medium text-sm">
          {user?.documentsVerified ? "Verfied" : "Under review"}
        </span>
        <CheckCircle className="w-4 h-4 text-blue-500" />
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
        <span className="text-blue-400 font-medium text-sm">Not Uploaded</span>
        <XCircle className="w-4 h-4 text-blue-300" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin" size={25} />
          <p className="text-black font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <CustomerDashboardLayout>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="shadow-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="p-8 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-blue-100">
                  <User className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-black">
                    Personal Information
                  </h3>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <Mail className="w-4 h-4 text-black" /> Email Address
                    </label>
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="font-medium text-blue-800">{user.email}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <User className="w-4 h-4 text-black" /> Full Name
                    </label>
                    <input
                      className="w-full p-4 border border-gray-200 rounded-lg"
                      value={editData.name ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <Phone className="w-4 h-4 text-black" /> Phone Number
                    </label>
                    <input
                      className="w-full p-4 border border-gray-200 rounded-lg"
                      value={editData.phone ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <Globe className="w-4 h-4 text-black" /> Nationality
                    </label>
                    <select
                      className="w-full p-4 border border-gray-200 rounded-lg"
                      value={editData.nationality ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          nationality: e.target.value,
                        })
                      }
                    >
                      <option value="">Select nationality</option>
                      <option value="palestine">Palestine</option>
                      <option value="egypt">Egypt</option>
                      <option value="lebanon">Lebanon</option>
                      <option value="syria">Syria</option>
                      <option value="jordan">Jordan</option>
                      <option value="iraq">Iraq</option>
                      <option value="yemen">Yemen</option>
                      <option value="kuwait">Kuwait</option>
                      <option value="oman">Oman</option>
                      <option value="qatar">Qatar</option>
                      <option value="bahrain">Bahrain</option>
                      <option value="uae">United Arab Emirates</option>
                      <option value="saudi arabia">Saudi Arabia</option>
                      <option value="united kingdom">United Kingdom</option>
                      <option value="united states">United States</option>
                      <option value="canada">Canada</option>
                      <option value="australia">Australia</option>
                      <option value="new zealand">New Zealand</option>
                      <option value="germany">Germany</option>
                      <option value="france">France</option>
                      <option value="spain">Spain</option>
                      <option value="italy">Italy</option>
                      <option value="japan">Japan</option>
                      <option value="china">China</option>
                      <option value="brazil">Brazil</option>
                      <option value="argentina">Argentina</option>
                      <option value="mexico">Mexico</option>
                      <option value="south africa">South Africa</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <Calendar className="w-4 h-4 text-black" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full p-4 border border-gray-200 rounded-lg"
                      value={editData.dateOfBirth?.split("T")[0] ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-black">
                      <Users className="w-4 h-4 text-black" /> Gender
                    </label>
                    <select
                      className="w-full p-4 border border-gray-200 rounded-lg"
                      value={editData.gender ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          gender: e.target.value as Gender,
                        })
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfileChanges}
                    className="flex items-center gap-2 text-white px-8 py-4 rounded-lg bg-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-black">
                    Document Verification
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-blue-800 text-lg">
                          Passport
                        </h4>
                        <p className="text-blue-600 text-sm">
                          Government issued passport
                        </p>
                      </div>
                      {renderDocStatus(user.passportUrl)}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-blue-800 text-lg">
                          Driver's License
                        </h4>
                        <p className="text-blue-600 text-sm">
                          Valid license or ID card
                        </p>
                      </div>
                      {renderDocStatus(user.driverLicenseUrl)}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-blue-800 text-lg">
                          Proof of Address
                        </h4>
                        <p className="text-blue-600 text-sm">
                          Utility bill or bank statement
                        </p>
                      </div>
                      {renderDocStatus(user.proofOfAddressUrl)}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-blue-100">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-black">
                    Security Settings
                  </h3>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="text-sm font-semibold text-black">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-4 border border-gray-200 rounded-lg mt-2"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-black">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-4 border border-gray-200 rounded-lg mt-2"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-black">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-4 border border-gray-200 rounded-lg mt-2"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 text-white px-8 py-4 rounded-lg bg-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Lock className="w-5 h-5" /> Update Password
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
