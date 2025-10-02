'use client'
import axiosInstance from "@/app/axios/axios";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignContractPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const rentalId = searchParams.get("rentalId");
    const uid = searchParams.get("uid");
    const contractId = searchParams.get("contractId");
    const [loading, setLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const router = useRouter()
    const signAttempt = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.post('/user/sign', {
                userId: uid,
                rentalId: rentalId,
                token: token,
                contractId: contractId
            })
            const data = await response.data
            if (data.success) {
                setIsSuccess(true)
                toast.success(data.message)
                router.push('/pages/customer/dashboard')
            }

        } catch (error: any) {
            setIsSuccess(false)
            console.log(error);
            toast.error(error.response.data.error)
            setLoading(false)


        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        signAttempt()
    }, [])


    return (
        loading ? (

            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-center" size={25} />
                    <p className="text-lg font-semibold">Signing contract...</p>

                </div>

            </div>
        ) : (<>
            {isSuccess ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-green-500">Contract signed successfully</p>

                    </div>

                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-red-500">Failed to sign contract</p>

                    </div>

                </div>
            )}



        </>)
    );
};