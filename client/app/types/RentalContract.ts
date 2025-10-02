interface RentalContract {
    id: number;
    agreementAccepted: boolean;
    signedAt: Date;
    rentalId: number;
    contractUrl: string;
    isSigned: boolean;
    verified: boolean;
    uploadedAt: Date;
    signerName: string;
    signerEmail: string;
    rental: {
        car: {
            id: number;
            make: string;
            model: string;
            year: number;
            licensePlate: string;
            featuredImage: string;
            category: {
                name: string;
                dailyRate: number;
            };
        };
    };
}
export type {RentalContract}