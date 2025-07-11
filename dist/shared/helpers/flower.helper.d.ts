import { Model } from 'mongoose';
export declare class FlowerHelper {
    static checkFlowerExists(flowerModel: Model<any>, id: string): Promise<void>;
    static checkFlowerNameExists(flowerModel: Model<any>, name: string, excludeId?: string): Promise<void>;
    static validatePrice(price: number): void;
}
