import { FlowerCategory } from '../../categories/schemas/category.schema';
export declare class CreateFlowerDto {
    name: string;
    description: string;
    originalPrice: number;
    salePrice?: number;
    category: FlowerCategory;
    imageUrl?: string;
    gallery?: string[];
    stock: number;
    isActive?: boolean;
    isAvailable?: boolean;
    weight?: number;
    height?: number;
    diameter?: number;
    colors?: string[];
    occasion?: string;
    careInstructions?: string;
}
