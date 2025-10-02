interface Payment {
    payment: {
        amount: number,
        id: number,
        method: string,
        paidAt: string,
        status: string
    },
    car: {
        make: string,
        model: string,
        year: number
    }
}


export type {Payment}
    