import axiosInstance from "@/app/axios/axios";
import { ContractCompletion, FuelTypes, MonthlyRentalCount, MonthlyRentalRevenue, RentalByCity, RentalStatus } from "@/app/types/analytics";


export const fetchMonthlyRental = async () => {
    try {
        const response = await axiosInstance.get<MonthlyRentalCount>('/analytics/monthly-rental-count')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}

export const fetchMonthlyRentalRevenue = async () => {
    try {
        const response = await axiosInstance.get<MonthlyRentalRevenue>('/analytics/monthly-rental-revenue')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}

export const fetchRentalStatus = async () => {
    try {
        const response = await axiosInstance.get<RentalStatus>('/analytics/rental-status')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}


export const fetchFuelTypes = async () => {
    try {
        const response = await axiosInstance.get<FuelTypes>('/analytics/fuel-types')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}


export const fetchContractCompletion = async () => {
    try {
        const response = await axiosInstance.get<ContractCompletion>('/analytics/contract-completion')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}


export const fetchRentalByCity = async () => {
    try {
        const response = await axiosInstance.get<RentalByCity>('/analytics/rentals-by-city')
        if (response.data) {
            return response.data.data

        }

    } catch (error) {
        console.log(error);
        throw error


    }
}

