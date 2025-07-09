import { Controller, Get } from '@nestjs/common';
import { FlowerCategory, getAllCategories } from './schemas/category.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả danh mục hoa cố định',
    description: 'Trả về danh sách các danh mục hoa được định nghĩa sẵn trong enum'
  })
  @ApiResponse({
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
  })
  getAllCategories() {
    return {
      categories: getAllCategories()
    };
  }
}
