"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const util_1 = require("./helpers/util");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const { email, password, name, phone, address } = createUserDto;
        await util_1.UserUtil.checkEmailExists(this.userModel, email);
        const hashPassword = await util_1.UserUtil.hashPassword(password);
        const user = await this.userModel.create({
            email,
            password: hashPassword,
            name,
            phone,
            address,
            role: user_schema_1.UserRole.ADMIN,
            isActive: true,
        });
        return {
            message: 'Tạo tài khoản thành công',
            data: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
            }
        };
    }
    async register(createUserDto) {
        const { email, password, name, phone, address } = createUserDto;
        await util_1.UserUtil.checkEmailExists(this.userModel, email);
        const hashPassword = await util_1.UserUtil.hashPassword(password);
        const user = await this.userModel.create({
            email,
            password: hashPassword,
            name,
            phone,
            address,
            role: user_schema_1.UserRole.USER,
            isActive: false,
        });
        return {
            message: 'Đăng ký tài khoản thành công',
            data: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
            }
        };
    }
    async findAll(query, current, pageSize) {
        util_1.UserUtil.validatePaginationParams(current, pageSize);
        let queryObj = {};
        if (typeof query === 'string' && query.trim() !== '') {
            try {
                queryObj = JSON.parse(query);
            }
            catch (e) {
                throw new common_1.BadRequestException('Query không hợp lệ!');
            }
        }
        else if (typeof query === 'object' && query !== null) {
            queryObj = query;
        }
        return await util_1.UserUtil.findAllWithPagination(this.userModel, queryObj, current, pageSize);
    }
    async findOne(id) {
        return await this.userModel.findById(id).select('-password');
    }
    async findOneByEmail(email) {
        return await this.userModel.findOne({ email }).lean();
    }
    async update(id, updateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    }
    async changePassword(userId, dto) {
        const { oldPassword, newPassword, confirmNewPassword } = dto;
        if (newPassword !== confirmNewPassword) {
            throw new common_1.BadRequestException({
                message: 'Xác nhận mật khẩu mới không khớp',
                errors: { confirmNewPassword: 'Xác nhận mật khẩu mới không khớp' }
            });
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException({
                message: 'Không tìm thấy user',
                errors: { oldPassword: 'Không tìm thấy user' }
            });
        }
        const isMatch = await util_1.UserUtil.comparePassword(oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException({
                message: 'Sai mật khẩu',
                errors: { oldPassword: 'Sai mật khẩu' }
            });
        }
        const isSame = await util_1.UserUtil.comparePassword(newPassword, user.password);
        if (isSame) {
            throw new common_1.BadRequestException({
                message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
                errors: { newPassword: 'Mật khẩu mới không được trùng với mật khẩu cũ' }
            });
        }
        user.password = await util_1.UserUtil.hashPassword(newPassword);
        await user.save();
        return { message: 'Đổi mật khẩu thành công' };
    }
    async remove(id) {
        return await this.userModel.findByIdAndDelete(id);
    }
    async toggleUserStatus(id, isActive) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
        if (!user) {
            throw new common_1.BadRequestException('Không tìm thấy user');
        }
        return {
            message: `Tài khoản đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
            data: user
        };
    }
    async activateUser(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).select('-password');
        if (!user) {
            throw new common_1.BadRequestException('Không tìm thấy user');
        }
        return {
            message: 'Tài khoản đã được kích hoạt thành công',
            data: user
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map