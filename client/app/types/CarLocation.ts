interface CarLocation {
    id: string;
    lat: number;
    lng: number;
    timestamp: string;
    rental: {
      startDate: string;
      endDate: string;
      status: string;
      user: {
        name: string;
        phone: string;
        email: string;
      };
      car: {
        make: string;
        model: string;
        licensePlate: string;
        fuelType: string;
        year: number;
      };
    };
  }

  export type {CarLocation};