"use client";
import axiosInstance from "@/app/axios/axios";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CarType } from "@/app/types/Car";
import { useQuery } from "@tanstack/react-query";

export default function DeletedCars() {
    const [cars, setCars] = useState<CarType[]>([]);
    const [page, setPage] = useState(1);
    const [restoringCarId, setRestoringCarId] = useState<number | null>(null);

    const handleGetSoftDeletedCars = async () => {
        try {
            const response = await axiosInstance.get("/car/get-soft-deleted-cars", {
                params: {
                    page: page,
                }
            });
            const data = await response.data;
            return data;
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch soft deleted cars");
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["soft-deleted-cars", page],
        queryFn: handleGetSoftDeletedCars,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });

    useEffect(() => {
        setCars(data?.data || []);
    }, [data]);

    const handleNextPage = () => {
        if (page < data?.totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const restoreCar = async (carId: number) => {
        setRestoringCarId(carId);
        try {
            const response = await axiosInstance.post("/car/restore-car", {
                carId: carId
            });
            const data = await response.data;
            if (data) {
                toast.success(data.message);
                setCars(cars.filter((car) => car.id !== carId));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to restore car");
        } finally {
            setRestoringCarId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Deleted Cars</h1>
                    <p className="text-gray-600">Manage and restore soft-deleted vehicles</p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <span className="ml-3 text-gray-600">Loading deleted cars...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading cars</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>There was an issue fetching the deleted cars. Please try again.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !error && cars?.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No deleted cars</h3>
                        <p className="mt-1 text-sm text-gray-500">There are no soft-deleted cars to display.</p>
                    </div>
                )}

                {!isLoading && !error && cars?.length > 0 && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vehicle
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deleted Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cars.map((car) => (
                                        <tr key={car.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-20">
                                                        <img
                                                            className="h-16 w-20 rounded-lg object-cover border border-gray-200"
                                                            src={car.featuredImage || car.imagesUrl?.[0] || '/placeholder-car.jpg'}
                                                            alt={`${car.make} ${car.model}`}
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder-car.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {car.make} {car.model}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {car.year} • {car.licensePlate}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{car.category?.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    ${car.category?.dailyRate}/day
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{car.location?.city}</div>
                                                <div className="text-sm text-gray-500">
                                                    {car.location?.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {car.seats} seats
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {car.transmission}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        {car.fuelType}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(car.createdAt.toString())}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => restoreCar(car.id)}
                                                    disabled={restoringCarId === car.id}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    {restoringCarId === car.id ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Restoring...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v-5h-.582m0 0a8.003 8.003 0 01-15.356-2m15.356 2V15a8 8 0 01-15.356 2" />
                                                            </svg>
                                                            Restore
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data?.totalPages > 1 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{data?.page}</span> of{' '}
                                            <span className="font-medium">{data?.totalPages}</span>
                                            {' '}({data?.totalCars} total cars)
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={page <= 1}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous
                                            </button>
                                            <button
                                                onClick={handleNextPage}
                                                disabled={page >= data?.totalPages}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Next
                                                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}