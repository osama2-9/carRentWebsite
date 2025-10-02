interface MonthlyRentalCount {
    data: {

        name: string,
        rentals: number
    }[]
}

interface MonthlyRentalRevenue {
    data: {
        month: string;
        revenue: number;
    }[]
}

interface RentalStatus {
    data: {
        status: string;
        count: number
    }[]
}

interface FuelTypes {
    data: {
        status: string;
        count: number
    }[]
}

interface ContractCompletion {
    data: {
        status: string;
        count: number
    }[]
}

interface RentalByCity {
    data: {
        city: string;
        count: number
    }[]
}
export type { MonthlyRentalCount, MonthlyRentalRevenue, ContractCompletion, FuelTypes, RentalByCity, RentalStatus }