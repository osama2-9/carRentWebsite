
import useSWR from "swr";
import axiosInstance from "../axios/axios";
interface Category {
  id: number;
  name: string;
  dailyRate: number;
}
export const useGetCategories = () => {
  const fetcher = (url: string) =>
    axiosInstance
      .get(url, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data.categories);
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/category/categories",
    fetcher
  );
  return {
    categories: data,
    isLoading,
    isError: error,
    mutate,
  };
};
