import toast from "react-hot-toast";
import axiosInstance from "../axios/axios";
import { useAuth } from "../store/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface DocumentsResponse {
  data: {
    passportUrl: string | null;
    driverLicenseUrl: string | null;
  };
}
export const useGetCustomerDocs = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocumentsResponse | null>({
    data: {
      driverLicenseUrl: null,
      passportUrl: null,
    },
  });
  const handleGetUserDocuments = async () => {
    try {
      const response = await axiosInstance.get<DocumentsResponse>(
        "/user/get-documents",
        {
          params: {
            customerId: user?.id,
          },
        }
      );
      if (response.data) {
        return response.data.data;
      }
    } catch (error) {
      toast.error("Can't fetch documents,please try again later");
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["user_docs", user?.id],
    enabled: !!user?.id,
    queryFn: handleGetUserDocuments,
    staleTime: 5 * 60 * 60 * 24,
  });

  useEffect(() => {
    setDocs({
      data: {
        driverLicenseUrl: data?.driverLicenseUrl ?? null,
        passportUrl: data?.passportUrl ?? null,
      },
    });
  }, [data]);
  return { docs, isLoading };
};
