export const TRANSMISSION_OPTIONS = [
    { value: "AUTOMATIC", label: "Automatic" },
    { value: "MANUAL", label: "Manual" },
];

export const FUEL_TYPE_OPTIONS = [
    { value: "PETROL", label: "Petrol" },
    { value: "DIESEL", label: "Diesel" },
    { value: "ELECTRIC", label: "Electric" },
    { value: "HYBRID", label: "Hybrid" },
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
});