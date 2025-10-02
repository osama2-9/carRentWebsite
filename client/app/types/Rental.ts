interface User {
    name: string,
    email: string,
    documentsVerified: boolean,
    passportUrl: string,
    driverLicenseUrl: string,
    phone: number,
}

interface Car {
    featuredImage: string,
    id: number,
    make: string,
    model: string,
    year: number,
    licensePlate: string,
    location: {
        googleMapsUrl: string,
        address: string

    }



}

interface Payment {
    method: string,
    status: string,
    paidAt: Date,
}

interface Contract {
    contractUrl: string
}

interface Rentals {
    id: number,
    car: Car,
    user: User,
    startDate: Date,
    pickupTime: string,
    endDate: Date,
    returnTime: string,
    status: string,
    totalCost: number
    payment: Payment,
    rentalContract: Contract



}
export type { Rentals }