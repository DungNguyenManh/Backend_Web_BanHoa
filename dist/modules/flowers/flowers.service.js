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
exports.FlowersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const flower_schema_1 = require("./schemas/flower.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const util_1 = require("./helpers/util");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
let FlowersService = class FlowersService {
    flowerModel;
    cloudinaryService;
    constructor(flowerModel, cloudinaryService) {
        this.flowerModel = flowerModel;
        this.cloudinaryService = cloudinaryService;
    }
    async createWithGallery(createFlowerDto, images = []) {
        const { name, category, originalPrice, stock } = createFlowerDto;
        await util_1.FlowerHelper.checkFlowerNameExists(this.flowerModel, name);
        if (!(0, category_schema_1.isValidCategory)(category)) {
            throw new common_1.BadRequestException(`Danh mục "${category}" không hợp lệ`);
        }
        util_1.FlowerHelper.validatePrice(originalPrice);
        util_1.FlowerHelper.validateStock(stock);
        const hasUploadedImages = images && images.length > 0;
        const hasImageUrl = createFlowerDto.imageUrl && createFlowerDto.imageUrl.trim().length > 0;
        const hasGallery = createFlowerDto.gallery && createFlowerDto.gallery.length > 0;
        if (!hasUploadedImages && !hasImageUrl && !hasGallery) {
            throw new common_1.BadRequestException('Vui lòng upload ít nhất 1 ảnh hoặc cung cấp URL ảnh');
        }
        const uploadedUrls = [];
        let mainImageUrl = '';
        if (hasUploadedImages) {
            try {
                const folderName = `flowers/${category.toLowerCase()}`;
                for (const image of images) {
                    const uploadResult = await this.cloudinaryService.uploadImage(image, folderName, name);
                    uploadedUrls.push(uploadResult.url);
                }
                mainImageUrl = uploadedUrls[0];
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Lỗi upload ảnh: ${errorMessage}`);
            }
        }
        const flowerData = {
            ...createFlowerDto,
            category: category,
            imageUrl: mainImageUrl || createFlowerDto.imageUrl,
            gallery: uploadedUrls.length > 0 ? uploadedUrls : (createFlowerDto.gallery || []),
        };
        const flower = await this.flowerModel.create(flowerData);
        return {
            message: uploadedUrls.length > 0 ? 'Tạo hoa với ảnh thành công' : 'Tạo hoa thành công',
            data: flower,
            uploadedImages: uploadedUrls.length
        };
    }
    async findAll(query) {
        const { search, category, minPrice, maxPrice, isAvailable, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query || {};
        const filter = { isActive: true };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.$or = [
                {
                    salePrice: { $exists: true },
                    ...(minPrice && { salePrice: { $gte: minPrice } }),
                    ...(maxPrice && { salePrice: { $lte: maxPrice } })
                },
                {
                    salePrice: { $exists: false },
                    ...(minPrice && { originalPrice: { $gte: minPrice } }),
                    ...(maxPrice && { originalPrice: { $lte: maxPrice } })
                }
            ];
        }
        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable;
            if (isAvailable) {
                filter.stock = { $gt: 0 };
            }
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;
        const [flowers, total] = await Promise.all([
            this.flowerModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.flowerModel.countDocuments(filter)
        ]);
        return {
            data: flowers,
            pagination: {
                current: page,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findOne(id) {
        await util_1.FlowerHelper.checkFlowerExists(this.flowerModel, id);
        const flower = await this.flowerModel.findById(id).exec();
        if (!flower) {
            throw new common_1.NotFoundException('Hoa không tồn tại');
        }
        if (!flower.isActive) {
            throw new common_1.NotFoundException('Hoa này hiện không có sẵn');
        }
        return {
            data: flower
        };
    }
    async update(id, updateFlowerDto) {
        await util_1.FlowerHelper.checkFlowerExists(this.flowerModel, id);
        const { name, category, originalPrice, stock } = updateFlowerDto;
        if (name) {
            await util_1.FlowerHelper.checkFlowerNameExists(this.flowerModel, name, id);
        }
        if (category && !(0, category_schema_1.isValidCategory)(category)) {
            throw new common_1.BadRequestException(`Danh mục "${category}" không hợp lệ`);
        }
        if (originalPrice !== undefined) {
            util_1.FlowerHelper.validatePrice(originalPrice);
        }
        if (stock !== undefined) {
            util_1.FlowerHelper.validateStock(stock);
        }
        const updateData = { ...updateFlowerDto };
        if (category) {
            updateData.category = category;
        }
        const updatedFlower = await this.flowerModel
            .findByIdAndUpdate(id, updateData, { new: true });
        return {
            message: 'Cập nhật hoa thành công',
            data: updatedFlower
        };
    }
    async remove(id) {
        await util_1.FlowerHelper.checkFlowerExists(this.flowerModel, id);
        await this.flowerModel.findByIdAndUpdate(id, { isActive: false });
        return {
            message: 'Xóa hoa thành công'
        };
    }
    async updateStock(id, quantity) {
        const flower = await this.flowerModel.findById(id);
        if (!flower) {
            throw new common_1.NotFoundException('Hoa không tồn tại');
        }
        if (flower.stock < quantity) {
            throw new common_1.BadRequestException('Không đủ hàng trong kho');
        }
        flower.stock -= quantity;
        if (flower.stock === 0) {
            flower.isAvailable = false;
        }
        await flower.save();
        return flower;
    }
    async getBestSellers(limit = 10) {
        return this.flowerModel
            .find({ isActive: true, isAvailable: true })
            .sort({ soldCount: -1 })
            .limit(limit);
    }
    async getLatestFlowers(limit = 10) {
        return this.flowerModel
            .find({ isActive: true, isAvailable: true })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async getSaleFlowers(limit = 10) {
        return this.flowerModel
            .find({
            isActive: true,
            isAvailable: true,
            salePrice: { $exists: true, $gt: 0 }
        })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
};
exports.FlowersService = FlowersService;
exports.FlowersService = FlowersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(flower_schema_1.Flower.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cloudinary_service_1.CloudinaryService])
], FlowersService);
//# sourceMappingURL=flowers.service.js.map