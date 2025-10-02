"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/app/axios/axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  emailVerified: boolean;
  passportUrl: string | null;
  licenseExpiryDate: string | null;
  nationality: string;
  documentsVerified: boolean;
  driverLicenseUrl: string | null;
  proofOfAddressUrl: string | null;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
 const router = useRouter()

  const navToUserData =(userId:any)=>{
    router.push(`/pages/admin/userData?userId=${userId}`)

  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;

    const matchesVerification =
      filterVerification === "all" ||
      (filterVerification === "verified" && user.documentsVerified) ||
      (filterVerification === "unverified" && !user.documentsVerified);

    return matchesSearch && matchesRole && matchesVerification;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getNationalityFlag = (nationality: string) => {
    const flags: { [key: string]: string } = {
      ps: "🇵🇸",
      eg: "🇪🇬",
      us: "🇺🇸",
      uk: "🇬🇧",
      other: "🌍",
    };
    return flags[nationality] || "🌍";
  };

  const stats = {
    total: users.length,
    verified: users.filter((user) => user.documentsVerified).length,
    emailVerified: users.filter((user) => user.emailVerified).length,
    customers: users.filter((user) => user.role === "CUSTOMER").length,
    staff: users.filter((user) => user.role === "STAFF").length,
  };

  const getusers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users", {
        params: {
          page: 1,
          limit: 10,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        return data;
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getusers,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Users Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and monitor user accounts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Verified</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.verified}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Email Verified
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.emailVerified}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    Customers
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats.customers}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Staff</p>
                  <p className="text-2xl font-bold text-red-900">
                    {stats.staff}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="CUSTOMER">Customers</option>
                <option value="ADMIN">Admins</option>
              </select>
              <select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
              {selectedUsers.length > 0 && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedUsers.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({filteredUsers.length} users)
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedUsers.length} selected
              </span>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                            <span className="text-lg">
                              {getNationalityFlag(user.nationality)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                              {user.emailVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.documentsVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.documentsVerified
                            ? "Documents Verified"
                            : "Pending Verification"}
                        </span>

                        <div className="flex items-center space-x-1">
                          <button 
                          onClick={()=>navToUserData(user.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Personal Info
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            Born: {formatDate(user.dateOfBirth)} (Age:{" "}
                            {calculateAge(user.dateOfBirth)})
                          </p>
                          <p>Gender: {user.gender}</p>
                          <p>Nationality: {user.nationality.toUpperCase()}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Documents
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Passport:</span>
                            {user.passportUrl ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              Driver License:
                            </span>
                            {user.driverLicenseUrl ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              Proof of Address:
                            </span>
                            {user.proofOfAddressUrl ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Status
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.emailVerified
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-600">
                              Email{" "}
                              {user.emailVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.documentsVerified
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-600">
                              Documents{" "}
                              {user.documentsVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          {user.licenseExpiryDate && (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="text-sm text-gray-600">
                                License expires:{" "}
                                {formatDate(user.licenseExpiryDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
