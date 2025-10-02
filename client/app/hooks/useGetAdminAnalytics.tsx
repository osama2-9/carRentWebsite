import { useQuery } from "@tanstack/react-query";
import {
  fetchMonthlyRental,
  fetchMonthlyRentalRevenue,
  fetchRentalStatus,
  fetchFuelTypes,
  fetchContractCompletion,
  fetchRentalByCity,
} from "../api/Admindashboard/analyticsEndpoints";

export const useGetAdminAnalytics = () => {
  const { data: monthlyRentalCount, isLoading: isMonthlyRentalCountLoading } =
    useQuery({
      queryKey: ["monthly-rental-count"],
      queryFn: fetchMonthlyRental,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });

  const {
    data: monthlyRentalRevenue,
    isLoading: isMonthlyRentalRevenueLoading,
  } = useQuery({
    queryKey: ["monthly-rental-revenue"],
    queryFn: fetchMonthlyRentalRevenue,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: rentalStatus, isLoading: isRentalStatusLoading } = useQuery({
    queryKey: ["rental-status"],
    queryFn: fetchRentalStatus,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: fuelTypes, isLoading: isFuelTypesLoading } = useQuery({
    queryKey: ["fuel-types"],
    queryFn: fetchFuelTypes,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: contractCompletion, isLoading: isContractCompletionLoading } =
    useQuery({
      queryKey: ["contract-completion"],
      queryFn: fetchContractCompletion,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });

  const { data: rentalByCity, isLoading: isRentalByCityLoading } = useQuery({
    queryKey: ["rental-by-city"],
    queryFn: fetchRentalByCity,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    monthlyRentalCount,
    isMonthlyRentalCountLoading,

    monthlyRentalRevenue,
    isMonthlyRentalRevenueLoading,

    rentalStatus,
    isRentalStatusLoading,

    fuelTypes,
    isFuelTypesLoading,

    contractCompletion,
    isContractCompletionLoading,

    rentalByCity,
    isRentalByCityLoading,
  };
};
