"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Users, Car, FileText, Search, Eye, Loader2, RefreshCw } from "lucide-react";
import { getsStatus } from "@/app/utils/getStatus";
import { RentalDetails } from "@/app/Components/staff/RentalDetails";
import { ContractDetails } from "@/app/Components/staff/ContractDetails";
import { UserDetails } from "@/app/Components/staff/userDetails";
import { getStaffDashboardData } from "@/app/hooks/seGetStaffDashboradData";
import { useGetStaffDashboardRental } from "@/app/hooks/useGetStaffDashboardRental";
import { useGetRentalContracts } from "@/app/hooks/useGetRentalContracts";
import { useInView } from "react-intersection-observer";

type ActiveSection = "rentals" | "contracts" | "users";

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("rentals");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { getContractStatus } = getsStatus();
  const { users, isLoadingMore: isLoadingMoreUsers, isUserDataLoading, fetchMoreUsers, pagination: usersPagination } = getStaffDashboardData();

  const {
    isRentalDataLoading,
    rentalDataError,
    rentals,
    pagination: rentalPagination,
    fetchMoreRentals,
    isLoadingMore: isLoadingMoreRentals,

  } = useGetStaffDashboardRental();

  const {
    isLoading: isContractsLoading,
    contracts,
    pagination: contractPagination,
    fetchMoreContracts,
    isLoadingMore: isLoadingMoreContracts,

  } = useGetRentalContracts();

  const { ref: contractsRef, inView: contractsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { ref: rentalsRef, inView: rentalsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { ref: userRef, inView: userInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  useEffect(() => {
    if (activeSection === "contracts" && contractsInView && contractPagination.hasMore && !isLoadingMoreContracts && !isContractsLoading) {
      fetchMoreContracts();
    }
  }, [activeSection, contractsInView, contractPagination.hasMore, isLoadingMoreContracts, isContractsLoading, fetchMoreContracts]);

  useEffect(() => {
    if (activeSection === "rentals" && rentalsInView && rentalPagination.hasNextPage && !isLoadingMoreRentals && !isRentalDataLoading) {
      fetchMoreRentals();
    }
  }, [activeSection, rentalsInView, rentalPagination.hasNextPage, isLoadingMoreRentals, isRentalDataLoading, fetchMoreRentals]);

  useEffect(() => {
    if (activeSection === "users" && userInView && usersPagination.hasMore && !isLoadingMoreUsers && !isUserDataLoading) {
      fetchMoreUsers();
    }
  }, [activeSection, userInView, usersPagination.hasMore, isLoadingMoreUsers, isUserDataLoading, fetchMoreUsers]);

  const handleSectionChange = (sectionId: ActiveSection) => {
    setActiveSection(sectionId);
    setSelectedItem(null);
    setSearchTerm("");
    setFilterStatus("all");
  };

  const filteredRentals = useMemo(() => {
    if (!rentals) return [];
    return rentals.filter((rental) => {
      const matchesSearch =
        rental.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || rental.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [rentals, searchTerm, filterStatus]);

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    return contracts?.filter((contract) => {
      const matchesSearch =
        contract?.signerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract?.signerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "VERIFIED" && contract?.verified) ||
        (filterStatus === "PENDING" && !contract?.verified);
      return matchesSearch && matchesFilter;
    });
  }, [contracts, searchTerm, filterStatus]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchTerm]);

  if (rentalDataError) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isRentalDataLoading && (!rentals || rentals.length === 0)) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin " size={25} />
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      id: "rentals" as ActiveSection,
      label: "Rentals",
      icon: Car,
      count: rentals?.length || 0,
    },
    {
      id: "contracts" as ActiveSection,
      label: "Contracts",
      icon: FileText,
      count: contracts?.length || 0,
    },
    {
      id: "users" as ActiveSection,
      label: "Users",
      icon: Users,
      count: users?.length || 0,
    },
  ];

  const getCurrentData = () => {
    switch (activeSection) {
      case "rentals":
        return filteredRentals;
      case "contracts":
        return filteredContracts;
      case "users":
        return filteredUsers;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-sm text-gray-600">Car Rental Management</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex-1 flex">
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {(activeSection === "rentals" || activeSection === "contracts") && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {activeSection === "rentals" ? (
                  <>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                  </>
                )}
              </select>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSection === "rentals" &&
              filteredRentals.map((rental) => (
                <div
                  key={rental.id}
                  onClick={() => setSelectedItem(rental)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedItem?.id === rental.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">#{rental.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getContractStatus(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{rental.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {rental.car.year} {rental.car.make} {rental.car.model}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(rental.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{rental.totalCost} USD</span>
                  </div>
                </div>
              ))}
            {rentalPagination.hasNextPage && (
              <div
                ref={rentalsRef}
                className="h-1 mt-10"
              >
                {isLoadingMoreRentals && (
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <p>Loading more...</p>
                  </div>
                )}
              </div>
            )}
            {activeSection === "contracts" &&
              filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => setSelectedItem(contract)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedItem?.id === contract.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{contract.id}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${contract.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {contract.verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {contract.signerName} {contract.signerEmail}
                  </p>
                  <p className="text-sm text-gray-500">Rental: {contract.rentalId}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(contract.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            {contractPagination.hasMore && (
              <div
                ref={contractsRef}
                className="h-1 mt-10"
              >
                {isLoadingMoreContracts && (
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <p>Loading more...</p>
                  </div>
                )}
              </div>
            )}
            {activeSection === "users" &&
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedItem(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedItem?.id === user.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${user.documentsVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {user.documentsVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
              ))}
            {usersPagination.hasMore && (
              <div
                ref={userRef}
                className="h-1 mt-10"
              >
                {isLoadingMoreUsers && (
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <p>Loading more...</p>
                  </div>
                )}
              </div>
            )}


            {currentData.length === 0 && !isRentalDataLoading && !isContractsLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-500">No {activeSection} match your current filters</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          {selectedItem ? (
            activeSection === "rentals" ? (
              <RentalDetails rental={selectedItem} />
            ) : activeSection === "contracts" ? (
              <div className="h-full bg-white">
                <ContractDetails contract={selectedItem} />
              </div>
            ) : activeSection === "users" ? (
              <UserDetails user={selectedItem} setSelectedItem={setSelectedItem} />
            ) : (
              <div className="h-full bg-white flex items-center justify-center">
                <p className="text-gray-500">Details panel for {activeSection}</p>
              </div>
            )
          ) : (
            <div className="h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an item</h3>
                <p className="text-gray-500">Choose an item from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;