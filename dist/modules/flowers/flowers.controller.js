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
exports.FlowersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const flowers_service_1 = require("./flowers.service");
const create_flower_dto_1 = require("./dto/create-flower.dto");
const update_flower_dto_1 = require("./dto/update-flower.dto");
const flower_query_dto_1 = require("./dto/flower-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const multer_config_1 = require("./config/multer.config");
const form_data_interceptor_1 = require("./interceptors/form-data.interceptor");
let FlowersController = class FlowersController {
    flowersService;
    constructor(flowersService) {
        this.flowersService = flowersService;
    }
    async create(createFlowerDto, images) {
        return await this.flowersService.createWithGallery(createFlowerDto, images || []);
    }
    findAll(query) {
        return this.flowersService.findAll(query);
    }
    findOne(id) {
        return this.flowersService.findOne(id);
    }
    update(id, updateFlowerDto) {
        return this.flowersService.update(id, updateFlowerDto);
    }
    remove(id) {
        return this.flowersService.remove(id);
    }
    getBestSellers() {
        return this.flowersService.getBestSellers();
    }
    getLatest() {
        return this.flowersService.getLatestFlowers();
    }
    getOnSale() {
        return this.flowersService.getSaleFlowers();
    }
    async getSeoMetadata(id) {
        const result = await this.flowersService.findOne(id);
        const flower = result.data;
        return {
            title: `${flower.name} - Shop Hoa Tươi`,
            description: flower.description?.substring(0, 160) || `Mua ${flower.name} với giá tốt nhất. Giao hàng tận nơi, hoa tươi chất lượng cao.`,
            keywords: `${flower.name}, hoa tươi, ${flower.category?.toLowerCase()}, shop hoa, ${flower.colors?.join(', ')}`,
            ogImage: flower.imageUrl,
            price: flower.salePrice || flower.originalPrice,
            availability: flower.isAvailable ? 'InStock' : 'OutOfStock',
            category: flower.category
        };
    }
    async getSitemapData() {
        const flowers = await this.flowersService.findAll({ limit: 1000 });
        return {
            flowers: flowers.data.map(flower => ({
                id: flower._id,
                slug: this.createSlug(flower.name),
                lastmod: new Date().toISOString(),
                priority: flower.isAvailable ? '0.8' : '0.3'
            }))
        };
    }
    createSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .replace(/^-|-$/g, '');
    }
};
exports.FlowersController = FlowersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5, multer_config_1.multerConfig), form_data_interceptor_1.FormDataInterceptor),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: '[ADMIN] Tạo hoa mới với upload ảnh',
        description: 'Chỉ ADMIN mới có thể tạo hoa mới. Cần đăng nhập và có quyền ADMIN. BẮT BUỘC phải có ít nhất 1 ảnh (upload file hoặc cung cấp URL). Có thể upload 1 hoặc nhiều ảnh (tối đa 5 ảnh). Ảnh đầu tiên sẽ làm ảnh chính.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo hoa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền ADMIN' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dữ liệu không hợp lệ hoặc file không đúng định dạng' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_flower_dto_1.CreateFlowerDto, Array]),
    __metadata("design:returntype", Promise)
], FlowersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy danh sách hoa',
        description: 'Lấy danh sách hoa với các bộ lọc. Không cần đăng nhập.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Tìm kiếm theo tên hoặc mô tả' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Lọc theo danh mục (key enum: HOA_BO, HOA_SAP, etc.)' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, description: 'Giá tối thiểu' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, description: 'Giá tối đa' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Trang hiện tại (mặc định: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang (mặc định: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách hoa' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flower_query_dto_1.FlowerQueryDto]),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy chi tiết hoa',
        description: 'Lấy thông tin chi tiết của một hoa. Không cần đăng nhập.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thông tin chi tiết hoa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hoa không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '[ADMIN] Cập nhật hoa',
        description: 'Chỉ ADMIN mới có thể cập nhật thông tin hoa. Cần đăng nhập và có quyền ADMIN.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cập nhật hoa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền ADMIN' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hoa không tồn tại' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dữ liệu không hợp lệ' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_flower_dto_1.UpdateFlowerDto]),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '[ADMIN] Xóa hoa',
        description: 'Chỉ ADMIN mới có thể xóa hoa (soft delete). Cần đăng nhập và có quyền ADMIN.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa hoa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền ADMIN' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hoa không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('special/best-sellers'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy hoa bán chạy',
        description: 'Lấy danh sách hoa bán chạy nhất. Không cần đăng nhập.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách hoa bán chạy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "getBestSellers", null);
__decorate([
    (0, common_1.Get)('special/latest'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy hoa mới nhất',
        description: 'Lấy danh sách hoa mới nhất. Không cần đăng nhập.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách hoa mới nhất' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('special/on-sale'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy hoa khuyến mãi',
        description: 'Lấy danh sách hoa đang có khuyến mãi. Không cần đăng nhập.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách hoa khuyến mãi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FlowersController.prototype, "getOnSale", null);
__decorate([
    (0, common_1.Get)(':id/seo'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy SEO metadata cho hoa',
        description: 'Lấy thông tin SEO metadata để hiển thị trong meta tags'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SEO metadata' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hoa không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlowersController.prototype, "getSeoMetadata", null);
__decorate([
    (0, common_1.Get)('sitemap'),
    (0, swagger_1.ApiOperation)({
        summary: '[PUBLIC] Lấy sitemap data',
        description: 'Lấy danh sách tất cả hoa để tạo sitemap.xml'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlowersController.prototype, "getSitemapData", null);
exports.FlowersController = FlowersController = __decorate([
    (0, swagger_1.ApiTags)('Flowers'),
    (0, common_1.Controller)('flowers'),
    __metadata("design:paramtypes", [flowers_service_1.FlowersService])
], FlowersController);
//# sourceMappingURL=flowers.controller.js.map