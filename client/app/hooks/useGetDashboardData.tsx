'use client'
import { useState } from "react";
import {
  getFleetDistribution,
  getMetrics,
  getRecentBookings,
  getRevenueChartData,
  getTopPerformingVehicles,
} from "../api/Admindashboard/adminDashboardEndpoints";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDashboardData = () => {
  
  const [page, setPage] = useState(1);
  
  const { data: metrics ,isLoading:isMetricsLoading } = useQuery({
    queryKey: ["adminMetrics"],
    queryFn: getMetrics,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  const { data: revenueChartData } = useQuery({
    queryKey: ["revenueChartData"],
    queryFn: getRevenueChartData,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  const { data: fleetDistribution } = useQuery({
    queryKey: ["fleetDistribution"],
    queryFn: getFleetDistribution,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: topPerformingVehicles } = useQuery({
    queryKey: ["topPerformingVehicles"],
    queryFn: getTopPerformingVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: recentBookings } = useQuery({
    queryKey: ["recentBookings", page],
    queryFn: () => getRecentBookings(page),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey:["recentBookings", page+1],
    queryFn:()=>getRecentBookings(page+1),
    staleTime:1000*60*5
  })
  const handlePageChange = () => {
    setPage((newPage) => newPage + 1);
  };
  const handlePageReset = () => {
    setPage(1);
  };
  const handlePageDecrement = () => {
    setPage((newPage) => (newPage > 1 ? newPage - 1 : 1));
  };
  return {
    isMetricsLoading,
    metrics,
    revenueChartData,
    fleetDistribution,
    topPerformingVehicles,
    recentBookings,
    page,
    handlePageChange,
    handlePageReset,
    handlePageDecrement,
  };
};
