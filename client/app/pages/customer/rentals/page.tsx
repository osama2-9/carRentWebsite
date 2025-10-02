"use client";
import axiosInstance from "@/app/axios/axios";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import { MyRentals } from "@/app/types/MyRentals";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight, FileText, Calendar, Clock, Car, MapPin, CreditCard, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Rentals() {
    const [page, setPage] = useState(1);
    const [rentals, setRentals] = useState<MyRentals[]>([]);
    
    const handleGetRentals = async () => {
        try {
            const response = await axiosInstance.get("/user/my-rents", {
                params: { page },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch rentals");
            throw error;
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['my-rentals', page],
        queryFn: handleGetRentals,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setRentals(data?.data || []);
    }, [data]);

    const handleNextPage = () => {
        if (page < data?.totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={14} /> Completed</span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"><XCircle size={14} /> Cancelled</span>;
            case 'upcoming':
                return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"><Calendar size={14} /> Upcoming</span>;
            case 'active':
                return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock size={14} /> Active</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={14} /> {status}</span>;
        }
    };

    if (isLoading) {
        return (
            <CustomerDashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-center" size={25} />
                        <p className="text-gray-600 text-sm text-center mt-2">Loading your rental history...</p>
                    </div>
                </div>
            </CustomerDashboardLayout>
        );
    }

    if (isError) {
        return (
            <CustomerDashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
                        <AlertCircle className="mx-auto text-red-500" size={32} />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Failed to load rentals</h3>
                        <p className="mt-1 text-sm text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </CustomerDashboardLayout>
        );
    }

    return (
        <CustomerDashboardLayout>
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Your Rental History</h1>
                    <p className="text-gray-600 mt-1">Review your past and upcoming vehicle rentals</p>
                </div>

                {rentals.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Car className="mx-auto text-gray-400" size={48} />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No rentals found</h3>
                        <p className="mt-2 text-gray-600">You haven't made any rentals yet. Start your journey with us!</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {rentals.map((rental) => (
                                <div key={rental.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        <div className="w-full md:w-48 flex-shrink-0">
                                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                                                <Image
                                                    src={rental.car.featuredImage || "/placeholder-car.jpg"}
                                                    alt={`${rental.car.make} ${rental.car.modal}`}
                                                    width={192}
                                                    height={108}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {rental.car.make} {rental.car.modal} ({rental.car.year})
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                                        {rental.car.location.city}, {rental.car.location.country}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(rental.status)}
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ${rental.totalCost.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="flex items-start">
                                                    <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Pickup Date</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {new Date(rental.startDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {rental.pickupTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start">
                                                    <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Return Date</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {new Date(rental.endDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {rental.returnTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start">
                                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Payment</p>
                                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                                            {rental?.payment?.method} • {rental?.payment?.status}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(rental?.payment?.paidAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start">
                                                    <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Contract</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {rental.rentalContract.isSigned ? "Signed" : "Pending"}
                                                        </p>
                                                        {rental.rentalContract.contractUrl && (
                                                            <a 
                                                                href={rental.rentalContract.contractUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:underline mt-0.5"
                                                            >
                                                                View Contract
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex flex-wrap gap-3">
                                               
                                                {rental.status.toLowerCase() === 'upcoming' && (
                                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                                        Cancel Rental
                                                    </button>
                                                )}
                                                {rental.status.toLowerCase() === 'active' && (
                                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                                        Extend Rental
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {data?.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{data.totalPages}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={page === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={page >= data.totalPages}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page >= data.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Next
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomerDashboardLayout>
    );
}