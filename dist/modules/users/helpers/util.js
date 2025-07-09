"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtil = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
class UserUtil {
    static async checkEmailExists(userModel, email) {
        const user = await userModel.findOne({ email }).lean();
        if (user) {
            throw new common_1.BadRequestException(`Email đã được sử dụng: ${email}`);
        }
    }
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    static sanitizeUser(user) {
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
        };
    }
    static async findAllWithPagination(userModel, query, current, pageSize) {
        const page = current || 1;
        const size = pageSize || 10;
        const filter = { ...query };
        delete filter.current;
        delete filter.pageSize;
        const totalItems = await userModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / size);
        const skip = (page - 1) * size;
        const results = await userModel
            .find(filter)
            .limit(size)
            .skip(skip)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        return {
            results,
            pagination: {
                current: page,
                pageSize: size,
                totalItems,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }
    static validatePaginationParams(current, pageSize) {
        if (current && current < 1) {
            throw new common_1.BadRequestException('Trang hiện tại phải lớn hơn 0');
        }
        if (pageSize && (pageSize < 1 || pageSize > 100)) {
            throw new common_1.BadRequestException('Kích thước trang phải từ 1 đến 100');
        }
    }
}
exports.UserUtil = UserUtil;
//# sourceMappingURL=util.js.map