import { Model } from 'mongoose';
export declare class FlowerHelper {
    static checkFlowerExists(flowerModel: Model<any>, id: string): Promise<void>;
    static checkFlowerNameExists(flowerModel: Model<any>, name: string, excludeId?: string): Promise<void>;
    static sanitizeFlower(flower: any): {
        _id: any;
        name: any;
        description: any;
        price: any;
        category: any;
        image: any;
        isAvailable: any;
    };
    static validatePrice(price: number): void;
}
