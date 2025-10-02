interface Category {
    id: number;
    name: string;
    dailyRate: number;
}

interface Location {
    id: number;
    address: string;
    city: string;
    googleMapsUrl: string;
}
interface CarType {
    id: number,
    make: string,
    model: string,
    year: number,
    category: Category,
    licensePlate: string,
    location: Location,
    transmission: string,
    fuelType: string,
    imagesUrl: any[]
    seats: number,
    available: boolean,
    createdAt: Date,
    featuredImage?: string
}

export type { CarType }