export declare class FlowerQueryDto {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    populate?: boolean;
}
