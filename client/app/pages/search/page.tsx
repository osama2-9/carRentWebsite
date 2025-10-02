'use client'
import axiosInstance from "@/app/axios/axios";
import { CarType } from "@/app/types/Car";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Calendar, Filter, Car } from "lucide-react";
import { CarCard } from "@/app/Components/CarCard";

export default function SearchResults() {
    const searchParams = useSearchParams()
    const location = searchParams.get('location')
    const pickupDate = searchParams.get('pickupDate')
    const pickupTime = searchParams.get('pickupTime')
    const returnDate = searchParams.get('returnDate')
    const returnTime = searchParams.get('returnTime')
    
    const [cars, setCars] = useState<CarType[]>([])
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState('price-low')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterTransmission, setFilterTransmission] = useState('')
    const [filterFuelType, setFilterFuelType] = useState('')

    const handleFetchCars = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/user/search', {
                params: {
                    location,
                    pickupDate,
                    pickupTime,
                    returnDate,
                    returnTime,
                },
            });
            const data = response.data.data;
            setCars(data)
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to fetch cars')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleFetchCars()
    }, [location, pickupDate, pickupTime, returnDate, returnTime])

    const filteredAndSortedCars = cars?.filter(car => {
            if (filterCategory && car.category.name !== filterCategory) return false
            if (filterTransmission && car.transmission !== filterTransmission) return false
            if (filterFuelType && car.fuelType !== filterFuelType) return false
            return true
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.category.dailyRate - b.category.dailyRate
                case 'price-high':
                    return b.category.dailyRate - a.category.dailyRate
                case 'name':
                    return a.model.localeCompare(b.model)
                case 'year':
                    return b.year - a.year
                default:
                    return 0
            }
        })

    const categories = [...new Set(cars.map(car => car.category.name))]
    const transmissions = [...new Set(cars.map(car => car.transmission))]
    const fuelTypes = [...new Set(cars.map(car => car.fuelType))]

    const formatDate = (dateString: string | null) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Available Cars in {location || 'Selected Location'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {location && (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{location}</span>
                                    </div>
                                )}
                                {pickupDate && (
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span>Pickup: {formatDate(pickupDate)}</span>
                                        {pickupTime && <span className="ml-1">at {pickupTime}</span>}
                                    </div>
                                )}
                                {returnDate && (
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span>Return: {formatDate(returnDate)}</span>
                                        {returnTime && <span className="ml-1">at {returnTime}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {filteredAndSortedCars.length} car{filteredAndSortedCars.length !== 1 ? 's' : ''} available
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort by
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                    <option value="year">Year: Newest First</option>
                                </select>
                            </div>

                            {categories.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {transmissions.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transmission
                                    </label>
                                    <select
                                        value={filterTransmission}
                                        onChange={(e) => setFilterTransmission(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        {transmissions.map(transmission => (
                                            <option key={transmission} value={transmission}>{transmission}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {fuelTypes.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fuel Type
                                    </label>
                                    <select
                                        value={filterFuelType}
                                        onChange={(e) => setFilterFuelType(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Fuel Types</option>
                                        {fuelTypes.map(fuelType => (
                                            <option key={fuelType} value={fuelType}>{fuelType}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(filterCategory || filterTransmission || filterFuelType) && (
                                <button
                                    onClick={() => {
                                        setFilterCategory('')
                                        setFilterTransmission('')
                                        setFilterFuelType('')
                                    }}
                                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-600">Searching for available cars...</p>
                            </div>
                        ) : filteredAndSortedCars.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No cars found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any cars matching your search criteria. Try adjusting your filters or search parameters.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setFilterCategory('')
                                            setFilterTransmission('')
                                            setFilterFuelType('')
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAndSortedCars.map((car) => (
                                    <CarCard key={car.id} car={car} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}