interface Metrics {
    revenue: number;
    totalCars: number;
    totalUsers: number;
    totalRentals: number;

}

interface RevenurChartData {
    chartData: {
        month: string;
        amount: number;

    }[]
}

interface FleetDistribution {
    fleetDistributionMap: {
        name: string,
        value: number,
        color: string
    }[]
}

interface TopPerformingVehicles {
    data: {

        carId: number;
        make: string;
        model: string;
        featuredImage?: string | null
        rentals: number;
        totalRevenue: number;
        avgRating: number | null
    }[]
}

interface RecentBookings {
    bookings: {
        id: number;
        startDate: string;
        endDate: string;
        status: string;
        payment: {
            amount: number;
            status: string;
        }
        car: {
            make: string;
            model: string;
            location: {
                address: string;
                city: string;
            }
        },
        user: {
            name: string;
            email: string;
            phone: string;
        }

    }
    totalPages: null,
    currentPage: number;

}

export type { Metrics, RevenurChartData, FleetDistribution, TopPerformingVehicles, RecentBookings };