import axiosInstance from "@/app/axios/axios";
import { FleetDistribution, Metrics, RecentBookings, RevenurChartData, TopPerformingVehicles } from "@/app/types/AdminDashboardData";

export const getMetrics = async () => {
    try {
        const response = await axiosInstance.get<Metrics>('/admin/metrics');
        return response.data
    } catch (error) {
        console.error("Error fetching metrics:", error);
        throw error;

    }
}

export const getRevenueChartData = async () => {
    try {
        const response = await axiosInstance.get<RevenurChartData>('/admin/revenue-chart-data');
        return response.data.chartData;
    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        throw error;
    }
}

export const getFleetDistribution = async () => {
    try {
        const response = await axiosInstance.get<FleetDistribution>('/admin/fleet-distribution');
        return response.data.fleetDistributionMap;

    } catch (error) {
        console.log(error);
        throw error;

    }
}

export const getTopPerformingVehicles = async () => {
    try {
        const response = await axiosInstance.get<TopPerformingVehicles>('/admin/top-performing-vechicles');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching top performing vehicles:", error);
        throw error;
    }
}
export const getRecentBookings = async (page: number) => {
    try {
        const response = await axiosInstance.get<RecentBookings>(`/admin/recent-bookings`, {
            params: {
                page: page
            }
        });
        return response.data.bookings;
    } catch (error) {
        console.error("Error fetching recent bookings:", error);
        throw error;
    }
}