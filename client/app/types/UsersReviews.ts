interface UsersReviews {
    id: number,
    make: string,
    model: string,
    year: number,
    licensePlate: string,
    featuredImage: string,
    avgRate: number,
    totalReviews: number,
    page: number,
    limit: number,
    totalPages: number,
}
export type { UsersReviews }