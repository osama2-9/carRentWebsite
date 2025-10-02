
import useSWR from "swr";
import axiosInstance from "../axios/axios";

interface Location {
  id: number;
  address: string;
  city: string;
  googleMapsUrl: string;
}

const fetcher = (url: string) =>
  axiosInstance
    .get(url, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => res.data.locations);

export const useGetLocations = () => {
  const { data, error, isLoading, mutate } = useSWR<Location[]>(
    "/location/locations",
    fetcher
  );

  return {
    locations: data,
    isLoading,
    isError: error,
    mutate,
  };
};
