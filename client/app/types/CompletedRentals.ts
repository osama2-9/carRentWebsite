interface CompletedRentals {
    id: number,
    startDate: Date,
    endDate: Date,
    pickupTime: string,
    returnTime: string,
    totalCost: number,

    car: {
        make: string,
        model: string,
        year: number,
        featuredImage: string,

    },
}

export type {CompletedRentals}
