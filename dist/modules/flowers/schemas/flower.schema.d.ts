import { Document } from 'mongoose';
import { FlowerCategory } from '../../categories/schemas/category.schema';
export type FlowerDocument = Flower & Document;
export declare class Flower {
    name: string;
    description: string;
    originalPrice: number;
    salePrice?: number;
    category: FlowerCategory;
    imageUrl?: string;
    gallery?: string[];
    stock: number;
    isActive: boolean;
    isAvailable: boolean;
    weight?: number;
    height?: number;
    diameter?: number;
    colors?: string[];
    occasion?: string;
    careInstructions?: string;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
}
export declare const FlowerSchema: import("mongoose").Schema<Flower, import("mongoose").Model<Flower, any, any, any, Document<unknown, any, Flower, any> & Flower & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Flower, Document<unknown, {}, import("mongoose").FlatRecord<Flower>, {}> & import("mongoose").FlatRecord<Flower> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
