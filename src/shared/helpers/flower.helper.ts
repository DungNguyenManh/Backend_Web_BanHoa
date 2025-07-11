import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

export class FlowerHelper {

    // Kiểm tra flower có tồn tại không
    static async checkFlowerExists(flowerModel: Model<any>, id: string): Promise<void> {
        const flower = await flowerModel.findById(id).lean();

        if (!flower) {
            throw new NotFoundException(`Hoa với ID ${id} không tồn tại`);
        }
    }

    // Kiểm tra tên hoa đã tồn tại chưa
    static async checkFlowerNameExists(flowerModel: Model<any>, name: string, excludeId?: string): Promise<void> {
        const query = excludeId ? { name, _id: { $ne: excludeId } } : { name };
        const flower = await flowerModel.findOne(query).lean();

        if (flower) {
            throw new BadRequestException(`Tên hoa "${name}" đã tồn tại`);
        }
    }



    // Validate price
    static validatePrice(price: number): void {
        if (price <= 0) {
            throw new BadRequestException('Giá hoa phải lớn hơn 0');
        }
    }

}
