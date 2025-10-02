interface Location{
    id: number;
    city: string;
    address: string;
    googleMapsUrl: string;
    cars?: CarsInLocations[];
}

interface CarsInLocations{
    id: number;
    make: string;
    model: string;
    licensePlate: string;
    imagesUrl: string;
    available: boolean;
}

export type {Location}