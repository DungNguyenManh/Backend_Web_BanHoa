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
exports.CreateFlowerDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const category_schema_1 = require("../../categories/schemas/category.schema");
function IsFlowerCategory(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFlowerCategory',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'string' && (0, category_schema_1.isValidCategory)(value);
                },
                defaultMessage() {
                    return `Danh mục phải là một trong các giá trị: ${(0, category_schema_1.getAllCategories)().join(', ')}`;
                }
            }
        });
    };
}
class CreateFlowerDto {
    name;
    description;
    originalPrice;
    salePrice;
    category;
    imageUrl;
    gallery;
    stock;
    isActive;
    isAvailable;
    occasion;
    careInstructions;
}
exports.CreateFlowerDto = CreateFlowerDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên hoa không được để trống' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : String(value)),
    (0, class_validator_1.IsString)({ message: 'name must be a string' }),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mô tả không được để trống' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : String(value)),
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá gốc không được để trống' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá gốc phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá gốc phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateFlowerDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá khuyến mãi phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá khuyến mãi phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateFlowerDto.prototype, "salePrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Danh mục không được để trống' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : String(value)),
    (0, class_validator_1.IsString)({ message: 'category must be a string' }),
    IsFlowerCategory(),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.split(',') : value),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFlowerDto.prototype, "gallery", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số lượng tồn kho không được để trống' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Số lượng tồn kho phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateFlowerDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFlowerDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFlowerDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "occasion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlowerDto.prototype, "careInstructions", void 0);
//# sourceMappingURL=create-flower.dto.js.map