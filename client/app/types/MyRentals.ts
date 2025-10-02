interface MyRentals {
    id: number;
    startDate: Date;
    endDate: Date;
    pickupTime: string;
    returnTime: string;
    status: string;
    totalCost: number;
    car: Car;
    payment: Payment;
    rentalContract: RentalContract;



}

interface Car {
    make: string;
    modal: string;
    year: number;
    licensePlate: string;
    featuredImage: string;
    fuleType: string;
    transmission: string;
    seats: number;
    category: {
        name: string;
    },
    location: {
        city: string;
        country: string;
        address: string;
        googleMapsUrl: string
    },

}

interface Payment {
    amount: number;
    method: string;
    status: string;
    paidAt: Date;
}

interface RentalContract {
    contractUrl: string;
    signedAt: Date;
    isSigned: boolean;
    agreementAccepted: boolean
}

export type { MyRentals }