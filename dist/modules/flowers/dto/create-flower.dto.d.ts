export declare class CreateFlowerDto {
    name: string;
    description: string;
    originalPrice: number;
    salePrice?: number;
    category: string;
    imageUrl?: string;
    gallery?: string[];
    stock: number;
    isActive?: boolean;
    isAvailable?: boolean;
    occasion?: string;
    careInstructions?: string;
}
