import { CarType } from "./Car";

interface CarCategory {
    id: number;
    name: string;
    dailyRate: number;
}

interface CarLocation {
    id: number;
    city: string;
    address: string;
    googleMapsUrl: string;
}


export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export interface FilterCarsResponse {
    data:{

        cars: CarType[];
        pagination: Pagination;
    }
}
