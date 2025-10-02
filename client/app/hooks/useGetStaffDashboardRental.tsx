import toast from "react-hot-toast";
import axiosInstance from "../axios/axios";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Rentals } from "../types/Rental";
interface GetRentalsResponse {
  data: Rentals[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
export const useGetStaffDashboardRental = () => {
  const [rentals, setRentals] = useState<Rentals[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const getRentals = async (page: number) => {
    try {
      const response = await axiosInstance.get("/staff/get-rentals-requests", {
        params: {
          page,
          limit: 10,
        },
      });
      const data = await response.data;
      if (data) {
        return data
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["staff_rentals_data", pagination.currentPage],
    queryFn: () => getRentals(pagination.currentPage),
    staleTime: 15 * 60 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      if (pagination.currentPage === 1) {
        setRentals(data.data);
      } 
      setPagination(data.pagination);
    }
  }, [data]);

  const fetchMoreRentals = useCallback(async () => {
    if (!pagination.hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true)
    try {
      const nextPage = pagination.currentPage + 1;
      const nextData: GetRentalsResponse = await getRentals(nextPage);
      setRentals(prev => [...prev, ...nextData.data]);
      setPagination(nextData.pagination);
    } catch (error) {
      console.error("Failed to fetch more rentals:", error);
    } finally {
      setIsLoadingMore(false);
    }


  } ,[pagination.hasNextPage, isLoadingMore])
  return {
    rentals,
    isRentalDataLoading: isLoading,
    rentalDataError: error,
    pagination,
    fetchMoreRentals,
    isLoadingMore,
  };
};
