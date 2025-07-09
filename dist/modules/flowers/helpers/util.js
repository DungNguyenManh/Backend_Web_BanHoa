"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowerHelper = void 0;
const common_1 = require("@nestjs/common");
class FlowerHelper {
    static async checkFlowerExists(flowerModel, id) {
        const flower = await flowerModel.findById(id).lean();
        if (!flower) {
            throw new common_1.NotFoundException(`Hoa với ID ${id} không tồn tại`);
        }
    }
    static async checkFlowerNameExists(flowerModel, name, excludeId) {
        const query = excludeId ? { name, _id: { $ne: excludeId } } : { name };
        const flower = await flowerModel.findOne(query).lean();
        if (flower) {
            throw new common_1.BadRequestException(`Tên hoa "${name}" đã tồn tại`);
        }
    }
    static sanitizeFlower(flower) {
        return {
            _id: flower._id,
            name: flower.name,
            description: flower.description,
            price: flower.price,
            category: flower.category,
            image: flower.image,
            stock: flower.stock,
            isAvailable: flower.isAvailable,
        };
    }
    static validatePrice(price) {
        if (price <= 0) {
            throw new common_1.BadRequestException('Giá hoa phải lớn hơn 0');
        }
    }
    static validateStock(stock) {
        if (stock < 0) {
            throw new common_1.BadRequestException('Số lượng hoa không thể âm');
        }
    }
}
exports.FlowerHelper = FlowerHelper;
//# sourceMappingURL=util.js.map