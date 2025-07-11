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
    static validatePrice(price) {
        if (price <= 0) {
            throw new common_1.BadRequestException('Giá hoa phải lớn hơn 0');
        }
    }
}
exports.FlowerHelper = FlowerHelper;
//# sourceMappingURL=flower.helper.js.map