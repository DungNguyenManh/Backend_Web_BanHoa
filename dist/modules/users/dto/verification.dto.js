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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileWithCodeDto = exports.ChangePasswordWithCodeDto = exports.VerifyCodeDto = exports.RequestVerificationDto = void 0;
const class_validator_1 = require("class-validator");
class RequestVerificationDto {
    email;
    action;
}
exports.RequestVerificationDto = RequestVerificationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], RequestVerificationDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Loại hành động không được để trống' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestVerificationDto.prototype, "action", void 0);
class VerifyCodeDto {
    email;
    code;
}
exports.VerifyCodeDto = VerifyCodeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], VerifyCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã xác thực không được để trống' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Mã xác thực phải có 6 ký tự' }),
    __metadata("design:type", String)
], VerifyCodeDto.prototype, "code", void 0);
class ChangePasswordWithCodeDto {
    email;
    code;
    newPassword;
}
exports.ChangePasswordWithCodeDto = ChangePasswordWithCodeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], ChangePasswordWithCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã xác thực không được để trống' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Mã xác thực phải có 6 ký tự' }),
    __metadata("design:type", String)
], ChangePasswordWithCodeDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu mới không được để trống' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordWithCodeDto.prototype, "newPassword", void 0);
class UpdateProfileWithCodeDto {
    email;
    code;
    name;
    phone;
    address;
}
exports.UpdateProfileWithCodeDto = UpdateProfileWithCodeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], UpdateProfileWithCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã xác thực không được để trống' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Mã xác thực phải có 6 ký tự' }),
    __metadata("design:type", String)
], UpdateProfileWithCodeDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên không được để trống' }),
    __metadata("design:type", String)
], UpdateProfileWithCodeDto.prototype, "name", void 0);
//# sourceMappingURL=verification.dto.js.map