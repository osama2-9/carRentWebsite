interface NextRental {
    id: number;
    rentalContract: RentalContract
    car: {
        location: Location
    } & Car,
    location: Location,
    startDate: Date,
    endDate: Date,
    pickupTime: string,
    returnTime: string,
    totalCost: number,
    status: string,

    payment: Payment,
}

interface Car {
    make: string,
    model: string,
    year: number;
    featuredImage: string,

}

interface RentalContract {
    contractUrl: string,
    rentalId: number
    isSigned: boolean
}

interface Location {
    address: string,
    city: string,
    country: string,
    googleMapsUrl: string
}

interface Payment {
    id: number,
    status: string,
    paidAt: Date,
    method: string,
    amount: number,

}
export type { NextRental }