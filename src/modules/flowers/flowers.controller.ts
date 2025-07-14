import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FlowersService } from './flowers.service';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { FlowerQueryDto } from './dto/flower-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator';
import { multerConfig } from './config/multer.config';

@ApiTags('Flowers')
@Controller('flowers')
export class FlowersController {
  constructor(private readonly flowersService: FlowersService) { }

  // ❌ CHỈ ADMIN - Tạo hoa mới với upload ảnh (multipart/form-data)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images', 1, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[ADMIN] Tạo hoa mới với upload ảnh',
    description: 'Chỉ ADMIN mới có thể tạo hoa mới. Gửi form-data gồm các trường text và file ảnh (field images). Ảnh sẽ được upload lên Cloudinary.'
  })
  @ApiResponse({ status: 201, description: 'Tạo hoa thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền ADMIN' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(
    @Body() createFlowerDto: CreateFlowerDto,
    @UploadedFiles() images?: Express.Multer.File[]
  ) {
    // Log dữ liệu nhận được để debug lỗi validate
    console.log('DTO:', createFlowerDto);
    console.log('Images:', images);
    return await this.flowersService.createWithGallery(createFlowerDto, images || []);
  }

  // ✅ PUBLIC - Xem danh sách hoa (không cần login)
  @Get()
  @ApiOperation({
    summary: '[PUBLIC] Lấy danh sách hoa',
    description: 'Lấy danh sách hoa với các bộ lọc. Không cần đăng nhập.\n\nTìm kiếm bằng ?search=keyword sẽ tìm theo tên hoặc mô tả.'
  })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm theo tên hoặc mô tả (ví dụ: ?search=hoa hồng)' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục (key enum: HOA_BO, HOA_SAP, etc.)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Giá tối thiểu' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Giá tối đa' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại (mặc định: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang (mặc định: 10)' })
  @ApiResponse({ status: 200, description: 'Danh sách hoa' })
  findAll(@Query() query: FlowerQueryDto) {
    // Đảm bảo search hoạt động như keyword
    return this.flowersService.findAll(query);
  }

  // ✅ PUBLIC - Xem chi tiết hoa (không cần login)
  @Get(':id')
  @ApiOperation({
    summary: '[PUBLIC] Lấy chi tiết hoa',
    description: 'Lấy thông tin chi tiết của một hoa. Không cần đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết hoa' })
  @ApiResponse({ status: 404, description: 'Hoa không tồn tại' })
  findOne(@Param('id') id: string) {
    return this.flowersService.findOne(id);
  }

  // ❌ CHỈ ADMIN - Cập nhật hoa
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[ADMIN] Cập nhật hoa',
    description: 'Chỉ ADMIN mới có thể cập nhật thông tin hoa. Cần đăng nhập và có quyền ADMIN.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật hoa thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền ADMIN' })
  @ApiResponse({ status: 404, description: 'Hoa không tồn tại' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  update(@Param('id') id: string, @Body() updateFlowerDto: UpdateFlowerDto) {
    return this.flowersService.update(id, updateFlowerDto);
  }

  // ❌ CHỈ ADMIN - Xóa hoa
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[ADMIN] Xóa hoa',
    description: 'Chỉ ADMIN mới có thể xóa hoa (soft delete). Cần đăng nhập và có quyền ADMIN.'
  })
  @ApiResponse({ status: 200, description: 'Xóa hoa thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền ADMIN' })
  @ApiResponse({ status: 404, description: 'Hoa không tồn tại' })
  remove(@Param('id') id: string) {
    return this.flowersService.remove(id);
  }

  // ✅ PUBLIC - Hoa bán chạy
  @Get('special/best-sellers')
  @ApiOperation({
    summary: '[PUBLIC] Lấy hoa bán chạy',
    description: 'Lấy danh sách hoa bán chạy nhất. Không cần đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách hoa bán chạy' })
  getBestSellers() {
    return this.flowersService.getBestSellers();
  }

  // ✅ PUBLIC - Hoa mới nhất
  @Get('special/latest')
  @ApiOperation({
    summary: '[PUBLIC] Lấy hoa mới nhất',
    description: 'Lấy danh sách hoa mới nhất. Không cần đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách hoa mới nhất' })
  getLatest() {
    return this.flowersService.getLatestFlowers();
  }

  // ✅ PUBLIC - Hoa khuyến mãi
  @Get('special/on-sale')
  @ApiOperation({
    summary: '[PUBLIC] Lấy hoa khuyến mãi',
    description: 'Lấy danh sách hoa đang có khuyến mãi. Không cần đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách hoa khuyến mãi' })
  getOnSale() {
    return this.flowersService.getSaleFlowers();
  }

  // ✅ PUBLIC - SEO metadata cho một hoa
  @Get(':id/seo')
  @ApiOperation({
    summary: '[PUBLIC] Lấy SEO metadata cho hoa',
    description: 'Lấy thông tin SEO metadata để hiển thị trong meta tags'
  })
  @ApiResponse({ status: 200, description: 'SEO metadata' })
  @ApiResponse({ status: 404, description: 'Hoa không tồn tại' })
  async getSeoMetadata(@Param('id') id: string) {
    const result = await this.flowersService.findOne(id);
    const flower = result.data;

    return {
      title: `${flower.name} - Shop Hoa Tươi`,
      description: flower.description?.substring(0, 160) || `Mua ${flower.name} với giá tốt nhất. Giao hàng tận nơi, hoa tươi chất lượng cao.`,
      keywords: `${flower.name}, hoa tươi, ${flower.category?.toLowerCase()}, shop hoa, ${flower.colors?.join(', ')}`,
      ogImage: flower.imageUrl,
      price: flower.salePrice || flower.originalPrice,
      category: flower.category
    };
  }

  // ✅ PUBLIC - Sitemap data
  @Get('sitemap')
  @ApiOperation({
    summary: '[PUBLIC] Lấy sitemap data',
    description: 'Lấy danh sách tất cả hoa để tạo sitemap.xml'
  })
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

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  }
}
