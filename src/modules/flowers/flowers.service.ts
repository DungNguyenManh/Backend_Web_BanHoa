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

  // Tạo hoa mới với upload ảnh (BẮT BUỘC phải có ảnh) (ADMIN only)
  async createWithGallery(createFlowerDto: CreateFlowerDto, images: Express.Multer.File[] = []) {
    const { name, category, originalPrice, stock } = createFlowerDto;

    // Kiểm tra tên hoa đã tồn tại chưa
    await FlowerHelper.checkFlowerNameExists(this.flowerModel, name);

    // Validate
    if (!isValidCategory(category)) {
      throw new BadRequestException(`Danh mục "${category}" không hợp lệ`);
    }
    FlowerHelper.validatePrice(originalPrice);
    FlowerHelper.validateStock(stock);

    // BẮT BUỘC phải có ít nhất 1 ảnh (upload hoặc URL)
    const hasUploadedImages = images && images.length > 0;
    const hasImageUrl = createFlowerDto.imageUrl && createFlowerDto.imageUrl.trim().length > 0;
    const hasGallery = createFlowerDto.gallery && createFlowerDto.gallery.length > 0;

    if (!hasUploadedImages && !hasImageUrl && !hasGallery) {
      throw new BadRequestException('Vui lòng upload ít nhất 1 ảnh hoặc cung cấp URL ảnh');
    }

    // Upload ảnh lên Cloudinary với folder theo category (nếu có)
    const uploadedUrls: string[] = [];
    let mainImageUrl = '';

    if (hasUploadedImages) {
      try {
        const folderName = `flowers/${category.toLowerCase()}`;
        for (const image of images) {
          const uploadResult: CloudinaryUploadResult = await this.cloudinaryService.uploadImage(image, folderName, name);
          uploadedUrls.push(uploadResult.url);
        }

        // Ảnh đầu tiên làm ảnh chính
        mainImageUrl = uploadedUrls[0];
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new BadRequestException(`Lỗi upload ảnh: ${errorMessage}`);
      }
    }

    // Tạo hoa mới
    const flowerData = {
      ...createFlowerDto,
      category: category, // Đã validate ở trên, không cần normalize
      imageUrl: mainImageUrl || createFlowerDto.imageUrl, // Ảnh chính (upload hoặc URL có sẵn)
      gallery: uploadedUrls.length > 0 ? uploadedUrls : (createFlowerDto.gallery || []), // Gallery (upload hoặc URLs có sẵn)
    };

    const flower = await this.flowerModel.create(flowerData);

    return {
      message: uploadedUrls.length > 0 ? 'Tạo hoa với ảnh thành công' : 'Tạo hoa thành công',
      data: flower,
      uploadedImages: uploadedUrls.length
    };
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
    const filter: Record<string, unknown> = { isActive: true }; // Chỉ hiển thị hoa active

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
        // Nếu có salePrice thì so sánh với salePrice
        {
          salePrice: { $exists: true },
          ...(minPrice && { salePrice: { $gte: minPrice } }),
          ...(maxPrice && { salePrice: { $lte: maxPrice } })
        },
        // Nếu không có salePrice thì so sánh với originalPrice
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

    const { name, category, originalPrice, stock } = updateFlowerDto;

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
    if (stock !== undefined) {
      FlowerHelper.validateStock(stock);
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

  // Cập nhật số lượng tồn kho (internal use)
  async updateStock(id: string, quantity: number) {
    const flower = await this.flowerModel.findById(id);
    if (!flower) {
      throw new NotFoundException('Hoa không tồn tại');
    }

    if (flower.stock < quantity) {
      throw new BadRequestException('Không đủ hàng trong kho');
    }

    flower.stock -= quantity;
    if (flower.stock === 0) {
      flower.isAvailable = false;
    }

    await flower.save();
    return flower;
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
