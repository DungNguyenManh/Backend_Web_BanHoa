import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { FlowerQueryDto } from './dto/flower-query.dto';
import { Flower, FlowerDocument } from './schemas/flower.schema';
import { isValidCategory } from '../categories/schemas/category.schema';
import { FlowerHelper } from './helpers/util';
import { CloudinaryService, CloudinaryUploadResult } from '../../cloudinary/cloudinary.service';

@Injectable()
export class FlowersService {
  constructor(
    @InjectModel(Flower.name) private flowerModel: Model<FlowerDocument>,
    private cloudinaryService: CloudinaryService,
  ) { }

  // Tạo hoa mới (ADMIN only) - chỉ nhận imageUrl/gallery, không upload ảnh nữa
  async createWithGallery(createFlowerDto: CreateFlowerDto, images: Express.Multer.File[] = []) {
    const { name, category, originalPrice, imageUrl } = createFlowerDto;

    // Kiểm tra tên hoa đã tồn tại chưa
    await FlowerHelper.checkFlowerNameExists(this.flowerModel, name);

    // Validate
    if (!isValidCategory(category)) {
      throw new BadRequestException(`Danh mục "${category}" không hợp lệ`);
    }
    FlowerHelper.validatePrice(originalPrice);

    // BẮT BUỘC phải có ít nhất 1 ảnh (imageUrl hoặc images upload)
    const hasImageUrl = imageUrl && imageUrl.trim().length > 0;
    const hasUploadedImages = images && images.length > 0;
    if (!hasImageUrl && !hasUploadedImages) {
      throw new BadRequestException('Vui lòng upload ảnh hoặc cung cấp URL ảnh');
    }

    let finalImageUrl = imageUrl;
    if (hasUploadedImages) {
      // Upload ảnh đầu tiên lên Cloudinary
      const folderName = `flowers/${category.toLowerCase()}`;
      const uploadResult = await this.cloudinaryService.uploadImage(images[0], folderName, name);
      finalImageUrl = uploadResult.url;
    }

    // Tạo hoa mới
    const flowerData = {
      ...createFlowerDto,
      category: category,
      imageUrl: finalImageUrl,
    };

    const flower = await this.flowerModel.create(flowerData);

    return {
      message: 'Tạo hoa thành công',
      data: flower
    };
  }

  // API upload ảnh riêng: nhận file, upload lên Cloudinary, trả về URL
  async uploadImageOnly(image: Express.Multer.File, folder = 'flowers', flowerName?: string) {
    if (!image) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    const uploadResult: CloudinaryUploadResult = await this.cloudinaryService.uploadImage(image, folder, flowerName);
    return uploadResult;
  }

  // Lấy danh sách hoa (PUBLIC/USER)
  async findAll(query?: FlowerQueryDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query || {};

    // Build filter
    const filter: Record<string, unknown> = { isActive: true };

    // Tìm kiếm theo search (từ khóa)
    if (search && search.trim().length > 0) {
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
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
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
  // Lấy chi tiết hoa (PUBLIC/USER)
  async findOne(id: string) {
    // Kiểm tra hoa có tồn tại không
    await FlowerHelper.checkFlowerExists(this.flowerModel, id);

    const flower = await this.flowerModel.findById(id).exec();

    // Kiểm tra null safety
    if (!flower) {
      throw new NotFoundException('Hoa không tồn tại');
    }

    if (!flower.isActive) {
      throw new NotFoundException('Hoa này hiện không có sẵn');
    }

    return {
      data: flower
    };
  }

  // Cập nhật hoa (ADMIN only)
  async update(id: string, updateFlowerDto: UpdateFlowerDto) {
    // Kiểm tra hoa có tồn tại không
    await FlowerHelper.checkFlowerExists(this.flowerModel, id);

    const { name, category, originalPrice } = updateFlowerDto;

    // Kiểm tra tên hoa đã tồn tại chưa (trừ chính nó)
    if (name) {
      await FlowerHelper.checkFlowerNameExists(this.flowerModel, name, id);
    }

    // Kiểm tra category có hợp lệ không (theo enum)
    if (category && !isValidCategory(category)) {
      throw new BadRequestException(`Danh mục "${category}" không hợp lệ`);
    }

    // Validate dữ liệu
    if (originalPrice !== undefined) {
      FlowerHelper.validatePrice(originalPrice);
    }

    // Normalize category nếu có
    const updateData = { ...updateFlowerDto };
    if (category) {
      updateData.category = category; // Đã validate ở trên, không cần normalize
    }

    // Cập nhật hoa
    const updatedFlower = await this.flowerModel
      .findByIdAndUpdate(id, updateData, { new: true });

    return {
      message: 'Cập nhật hoa thành công',
      data: updatedFlower
    };
  }

  // Xóa hoa (ADMIN only)
  async remove(id: string) {
    // Kiểm tra hoa có tồn tại không
    await FlowerHelper.checkFlowerExists(this.flowerModel, id);

    // Soft delete: chỉ set isActive = false
    await this.flowerModel.findByIdAndUpdate(id, { isActive: false });

    return {
      message: 'Xóa hoa thành công'
    };
  }

  // Lấy hoa bán chạy
  async getBestSellers(limit = 10) {
    return this.flowerModel
      .find({ isActive: true, isAvailable: true })
      .sort({ soldCount: -1 })
      .limit(limit);
  }

  // Lấy hoa mới nhất
  async getLatestFlowers(limit = 10) {
    return this.flowerModel
      .find({ isActive: true, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  // Lấy hoa khuyến mãi
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
}
