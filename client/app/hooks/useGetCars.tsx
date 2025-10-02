"use client";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axios/axios";
import { useQuery } from "@tanstack/react-query";
import { CarType } from "../types/Car";
import { useScreenSize } from "./useScreenSize";

interface GetCarsResponse {
  cars: CarType[];
  totalCars: number;
  totalPages: number;
  currentPage: number;
  limitPerPage: number;
  hasMoreCars: boolean;
}

export const useGetCars = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { isDesktop, getLimit } = useScreenSize();

  const fetchCars = async (page: number, limit?: number) => {
    const itemsPerPage = limit || getLimit();
    const res = await axiosInstance.get<GetCarsResponse>("/car/get-all-cars", {
      params: { page, limit: itemsPerPage },
    });
    return res.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cars_list", 1],
    queryFn: () => fetchCars(1),
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (data) {
      setCars(data.cars || []);
      setHasMore(data.hasMoreCars || false);
    }
  }, [data]);

  const fetchMoreCars = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const nextData = await fetchCars(nextPage);

      setCars((prev) => [...prev, ...(nextData.cars || [])]);
      setCurrentPage(nextPage);
      setHasMore(nextData.hasMoreCars || false);
    } catch (e) {
      console.error("Failed to fetch more cars:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore]);

  return {
    cars,
    isLoading,
    error,
    fetchMoreCars,
    hasMore,
    isLoadingMore,
    isDesktop,
  };
};
