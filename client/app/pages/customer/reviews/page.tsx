"use client";
import axiosInstance from "@/app/axios/axios";
import CustomerDashboardLayout from "@/app/Layout/CustomerDashboardLayout";
import { CompletedRentals } from "@/app/types/CompletedRentals";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader2, Star, Send, Car, Calendar, CheckCircle, X } from "lucide-react";

interface GetCompletedRentalsResponse {
    data: CompletedRentals[];
    page: number;
    totalPages: number;
    totalRents: number;
}

export default function Reviews() {
    const [page] = useState<number>(1);
    const [rentals, setRentals] = useState<CompletedRentals[]>([]);
    const [reviewData, setReviewData] = useState<
        Record<number, { rating: number; comment: string; submitted: boolean; isSubmitting: boolean }>
    >({});

    const handleGetCompletedRentals = async () => {
        try {
            const response = await axiosInstance.get<GetCompletedRentalsResponse>(
                "/user/get-completed-rentals",
                { params: { page } }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch rentals");
            throw error;
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["completed-rentals", page],
        queryFn: handleGetCompletedRentals,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setRentals(data?.data || []);
    }, [data]);

    const handleRatingChange = (rentalId: number, rating: number) => {
        if (reviewData[rentalId]?.submitted) return;

        setReviewData((prev) => ({
            ...prev,
            [rentalId]: { ...prev[rentalId], rating },
        }));
    };

    const handleCommentChange = (rentalId: number, comment: string) => {
        if (reviewData[rentalId]?.submitted) return;

        setReviewData((prev) => ({
            ...prev,
            [rentalId]: { ...prev[rentalId], comment },
        }));
    };

    const handleSubmit = async (rentalId: number) => {
        const review = reviewData[rentalId];
        if (!review?.rating || review.rating < 1) {
            toast.error("Please select a rating");
            return;
        }

        setReviewData((prev) => ({
            ...prev,
            [rentalId]: { ...prev[rentalId], isSubmitting: true },
        }));

        try {
            const response = await axiosInstance.post("/user/submit-review", {
                rentalId,
                rating: review.rating,
                comment: review.comment,
            });

            setReviewData((prev) => ({
                ...prev,
                [rentalId]: { ...prev[rentalId], submitted: true, isSubmitting: false },
            }));
            toast.success("Review submitted successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to submit review");
        }
    };

    const getRatingText = (rating: number) => {
        const texts = {
            1: "Poor",
            2: "Fair",
            3: "Good",
            4: "Very Good",
            5: "Excellent"
        };
        return texts[rating as keyof typeof texts] || "";
    };

    if (isLoading) {
        return (
            <CustomerDashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-gray-600">Loading your completed rentals...</p>
                </div>
            </CustomerDashboardLayout>
        );
    }

    if (isError) {
        return (
            <CustomerDashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                        <X className="mx-auto text-red-500 mb-3" size={32} />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Rentals</h3>
                        <p className="text-red-600">Please try refreshing the page or contact support if the issue persists.</p>
                    </div>
                </div>
            </CustomerDashboardLayout>
        );
    }

    return (
        <CustomerDashboardLayout>
            <div className="px-4 py-8 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Experience</h1>
                    <p className="text-gray-600">Share your feedback to help other customers and improve our service</p>
                </div>

                {rentals.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Car size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Rentals</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            You haven't completed any rentals yet. Once you return a vehicle, you'll be able to leave reviews here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {rentals.map((rental) => {
                            const review = reviewData[rental.id];
                            const isSubmitted = review?.submitted;
                            const isSubmitting = review?.isSubmitting;

                            return (
                                <div
                                    key={rental.id}
                                    className={`bg-white shadow-sm rounded-2xl overflow-hidden border transition-all duration-300 ${isSubmitted
                                            ? 'border-green-200 bg-green-50/30'
                                            : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                        }`}
                                >
                                    {/* Status Badge */}
                                    {isSubmitted && (
                                        <div className="bg-green-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            Review Submitted
                                        </div>
                                    )}

                                    <div className="flex flex-col lg:flex-row">
                                        {/* Car Image */}
                                        <div className="relative lg:w-80 h-64 lg:h-auto">
                                            <Image
                                                src={rental.car.featuredImage || "/placeholder-car.jpg"}
                                                alt={`${rental.car.make} ${rental.car.model}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-8">
                                            {/* Car Details */}
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {rental.car.make} {rental.car.model}
                                                </h2>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                                                        {rental.car.year}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        <span>
                                                            {new Date(rental.startDate).toLocaleDateString("en-US", {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })} - {new Date(rental.endDate).toLocaleDateString("en-US", {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!isSubmitted ? (
                                                <>
                                                    {/* Rating Section */}
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                            How was your experience? *
                                                        </label>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={32}
                                                                    onClick={() => handleRatingChange(rental.id, star)}
                                                                    className={`cursor-pointer transition-all duration-200 hover:scale-110 ${review?.rating >= star
                                                                            ? "text-yellow-500"
                                                                            : "text-gray-300 hover:text-yellow-400"
                                                                        }`}
                                                                    fill={review?.rating >= star ? "#FCD34D" : "none"}
                                                                />
                                                            ))}
                                                        </div>
                                                        {review?.rating && (
                                                            <p className="text-sm text-gray-600 font-medium">
                                                                {getRatingText(review.rating)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Comment Section */}
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                            Tell us about your experience (optional)
                                                        </label>
                                                        <textarea
                                                            placeholder="Share details about the car condition, service quality, or anything that stood out during your rental..."
                                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                            rows={4}
                                                            value={review?.comment || ""}
                                                            onChange={(e) =>
                                                                handleCommentChange(rental.id, e.target.value)
                                                            }
                                                            maxLength={500}
                                                        />
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {(review?.comment || "").length}/500 characters
                                                        </p>
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button
                                                        onClick={() => handleSubmit(rental.id)}
                                                        disabled={!review?.rating || isSubmitting}
                                                        className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${!review?.rating
                                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                : isSubmitting
                                                                    ? "bg-blue-500 text-white cursor-not-allowed"
                                                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md"
                                                            }`}
                                                    >
                                                        {isSubmitting ? (
                                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                                        ) : (
                                                            <Send size={18} className="mr-2" />
                                                        )}
                                                        {isSubmitting ? "Submitting..." : "Submit Review"}
                                                    </button>
                                                </>
                                            ) : (
                                                /* Submitted State */
                                                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle className="text-green-600 mt-0.5" size={20} />
                                                        <div>
                                                            <h4 className="font-semibold text-green-800 mb-1">
                                                                Thank you for your feedback!
                                                            </h4>
                                                            <p className="text-green-700 text-sm mb-3">
                                                                Your review helps us improve and assists other customers in making informed decisions.
                                                            </p>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-medium text-green-800">Your Rating:</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            size={16}
                                                                            className="text-yellow-500"
                                                                            fill={review?.rating >= star ? "#FCD34D" : "none"}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-green-700">
                                                                    {getRatingText(review?.rating)}
                                                                </span>
                                                            </div>
                                                            {review?.comment && (
                                                                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                                                                    <p className="text-sm text-gray-700">"{review.comment}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </CustomerDashboardLayout>
    );
}