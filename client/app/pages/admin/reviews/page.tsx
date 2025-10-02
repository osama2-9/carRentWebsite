"use client";
import axiosInstance from "@/app/axios/axios";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { UsersReviews } from "@/app/types/UsersReviews";
import Image from "next/image";
import { 
    Star, 
    Calendar, 
    TrendingUp, 
    MessageSquare, 
    Car,
    Filter,
    Search,
    Loader2,
    AlertCircle,
    BarChart3,
    Users,
    ChevronDown,
    Eye
} from "lucide-react";

export default function Reviews() {
    const [reviews, setReviews] = useState<UsersReviews[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<UsersReviews[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating-high" | "rating-low">("newest");

    const handleGetReviews = async () => {
        try {
            const response = await axiosInstance.get("/admin/get-reviews");
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch reviews");
            throw error;
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["reviews"],
        queryFn: handleGetReviews,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (data?.data) {
            setReviews(data.data);
            setFilteredReviews(data.data);
        }
    }, [data]);

    // Filter and sort reviews
    useEffect(() => {
        let filtered = [...reviews];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(review => 
                review.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Rating filter
        if (ratingFilter) {
            filtered = filtered.filter(review => review.avgRate === ratingFilter);
        }

    

        setFilteredReviews(filtered);
    }, [reviews, searchTerm, ratingFilter, sortBy]);

    // Calculate statistics
    const stats = {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.avgRate, 0) / reviews.length).toFixed(1) : 0,
        ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
            rating,
            count: reviews.filter(review => review.avgRate === rating).length,
            percentage: reviews.length > 0 ? ((reviews.filter(review => review.avgRate === rating).length / reviews.length) * 100).toFixed(1) : 0
        }))
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "text-green-600";
        if (rating >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    const getRatingBgColor = (rating: number) => {
        if (rating >= 4) return "bg-green-100";
        if (rating >= 3) return "bg-yellow-100";
        return "bg-red-100";
    };

    if (isLoading) {
        return (
            <AdminDashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-gray-600">Loading reviews...</p>
                </div>
            </AdminDashboardLayout>
        );
    }

    if (isError) {
        return (
            <AdminDashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
                        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Reviews</h3>
                        <p className="text-red-600">Please try refreshing the page or contact support if the issue persists.</p>
                    </div>
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
                    <p className="text-gray-600">Monitor and manage customer reviews across all vehicles</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <MessageSquare className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                                    <Star className="text-yellow-500" size={20} fill="#FCD34D" />
                                </div>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <TrendingUp className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Calendar className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.ratingDistribution.find(r => r.rating === 5)?.percentage || 0}%
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BarChart3 className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {stats.ratingDistribution.reverse().map(({ rating, count, percentage }) => (
                            <div key={rating} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                    <Star className="text-yellow-500" size={14} fill="#FCD34D" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-20">
                                    <span className="text-sm text-gray-600">{count}</span>
                                    <span className="text-xs text-gray-500">({percentage}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by car make, model, license plate, or comment..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Rating Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={ratingFilter || ""}
                                onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="rating-high">Highest Rating</option>
                                <option value="rating-low">Lowest Rating</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                        <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm || ratingFilter ? "No reviews found" : "No reviews yet"}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm || ratingFilter 
                                ? "Try adjusting your search criteria or filters"
                                : "Reviews will appear here once customers start submitting them"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Car Image */}
                                        <div className="lg:w-48 h-32 relative rounded-lg overflow-hidden">
                                            <Image
                                                src={review.featuredImage || "/placeholder-car.jpg"}
                                                alt={`${review.make} ${review.model}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {review.make} {review.model} ({review.year})
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        License Plate: {review.licensePlate}
                                                    </p>
                                                </div>
                                                
                                                {/* Rating Badge */}
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getRatingBgColor(review.avgRate)}`}>
                                                    <Star className={getRatingColor(review.avgRate)} size={16} fill="currentColor" />
                                                    <span className={`font-semibold ${getRatingColor(review.avgRate)}`}>
                                                        {review.avgRate}.0
                                                    </span>
                                                </div>
                                            </div>

                                     

                                            {/* Footer */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                               
                                                
                                                {review.avgRate && (
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp size={16} />
                                                        <span>Car Avg: {review.avgRate.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Summary */}
                {filteredReviews.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing {filteredReviews.length} of {reviews.length} reviews
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}