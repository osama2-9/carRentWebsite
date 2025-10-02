
import axiosInstance from "../axios/axios";
import { CarType } from "../types/Car";
import { useQuery } from "@tanstack/react-query";

export const useGetCarById = ({ carId }: { carId: number }) => {
  const fetchCar = async (): Promise<CarType> => {
    const res = await axiosInstance.get("/car/get-car", {
      params: { carId },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data.car;
  };

  const { data, isLoading, error } = useQuery<CarType>({
    queryKey: ["car", carId],
    queryFn: fetchCar,
    enabled: !!carId, 
  });

  return {
    car: data || null,
    isLoading,
    error,
  };
};
