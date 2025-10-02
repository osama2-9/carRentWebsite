'use client'
import toast from "react-hot-toast";
import axiosInstance from "../axios/axios";
import { useQuery } from "@tanstack/react-query";
import { RentalContract } from "../types/RentalContract";
import { useCallback, useEffect, useState } from "react";
import { useScreenSize } from "./useScreenSize";

interface GetRentalContractsResponse {
    data: RentalContract[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasMore: boolean;
    };
}

export const useGetRentalContracts = () => {
    const [contracts, setContracts] = useState<RentalContract[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasMore: false,
    });
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { isDesktop } = useScreenSize();

    const handleGetRentalContracts = async (page: number) => {
        try {
            const response = await axiosInstance.get<GetRentalContractsResponse>("/staff/get-rental-contracts", {
                params: {
                    page,
                    limit: 10
                }
            });
            return response.data;
        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data?.error || "Failed to fetch contracts");
            throw error;
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["staff_rental_contracts", pagination.currentPage],
        queryFn: () => handleGetRentalContracts(pagination.currentPage),
        staleTime: 15 * 60 * 1000,

    });

    useEffect(() => {
        if (data) {
            if (pagination.currentPage === 1) {
                setContracts(data.data);
            }
            setPagination(data.pagination);
        }
    }, [data]);

    const fetchMoreContracts = useCallback(async () => {
        if (!pagination.hasMore || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = pagination.currentPage + 1;
            const nextData = await handleGetRentalContracts(nextPage);

            setContracts(prev => [...prev, ...nextData.data]);
            setPagination(nextData.pagination);
        } catch (error) {
            console.error("Failed to fetch more contracts:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [pagination.hasMore, isLoadingMore]);

    return {
        isLoading,
        error,
        contracts,
        pagination,
        fetchMoreContracts,
        isLoadingMore,
        isDesktop
    };
};