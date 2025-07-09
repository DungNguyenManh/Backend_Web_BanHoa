"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHelper = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
class UserHelper {
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
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=user.helper.js.map