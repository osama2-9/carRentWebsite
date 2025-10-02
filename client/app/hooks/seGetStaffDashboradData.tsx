import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserData } from "../types/User";
import axiosInstance from "../axios/axios";

interface FetchUsersResponse {
  data: UserData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasMore: boolean;
  };
}

export const getStaffDashboardData = () => {
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasMore: false,
  });

  const fetchUsersData = async (page: number) => {
    try {
      const res = await axiosInstance.get<FetchUsersResponse>("/staff/users", {
        params: {
          page,
          limit: 10,
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.data;
      if (data) {
        return data;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const { data, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["staff_user_data"],
    queryFn: () => fetchUsersData(1),
    retry: 2,
    staleTime: 15 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
      setPagination(data.pagination);
    }
  }, [data]);


  const fetchMoreUsers = useCallback(async () => {
    if(!pagination.hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const nextData: FetchUsersResponse | undefined = await fetchUsersData(nextPage);
    setPage(nextPage);
    if (nextData) {
      setUsers(prev => [...prev, ...nextData.data])
      setPagination(nextData.pagination);
    }
    setIsLoadingMore(false);
  }, [pagination.hasMore, isLoadingMore, page])

  return {
    users,
    isUserDataLoading,
    fetchMoreUsers,
    isLoadingMore,
    pagination,
  };
};
