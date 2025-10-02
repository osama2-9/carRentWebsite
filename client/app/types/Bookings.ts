interface BookingDetails {

    id: number,
    cancellationReason?: string | null,
    startDate: string,
    endDate: string,
    pickupTime: string,
    returnTime: string,
    status: string,
    payment?: {
        amount: number,
        status: string,
        paidAt: string,
        method: string,
    },
    car: {
        make: string,
        model: string,
        year: number,
        licensePlate: string,
        featuredImage: string,
        category: {
            name: string,
            dailyRate: number,
        },
        location: {
            address: string,
            city: string,
            country: string,
        },
    },
    user: {
        name: string,
        email: string,
        phone: string,
        passportUrl: string,
        driverLicenseUrl: string,
        documentsVerified: boolean,

    },
    rentalContract: {
        id: number,
        contractUrl: string,
        isSigned: boolean,
        signedAt: string,
        verified: boolean,
    },
    createdAt: string,
}