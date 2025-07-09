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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const category_schema_1 = require("./schemas/category.schema");
const swagger_1 = require("@nestjs/swagger");
let CategoriesController = class CategoriesController {
    getAllCategories() {
        return {
            categories: (0, category_schema_1.getAllCategories)()
        };
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy danh sách tất cả danh mục hoa cố định',
        description: 'Trả về danh sách các danh mục hoa được định nghĩa sẵn trong enum'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách các danh mục hoa',
        schema: {
            type: 'object',
            properties: {
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Hoa bó', 'Hoa sáp', 'Hoa khai trương', 'Hoa Vip Pro', 'Hoa sinh nhật', 'Hoa chúc mừng', 'Chậu Hoa Lan Hồ Điệp', 'Hoa chia buồn', 'Hoa hộp gỗ', 'Giỏ Trái Cây', 'Hoa Sen Đá', 'Hoa Cưới']
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getAllCategories", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories')
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map