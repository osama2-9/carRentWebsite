interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    documentsVerified: boolean;
    dateOfBirth: Date | string;
    gender: string;
    phone: string;
    emailVerified: boolean;
    driverLicenseUrl: string | null;
    passportUrl: string | null;
    proofOfAddressUrl: string | null;
    nationality: string;
    licenseExpiryDate: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}


export type { UserData }
