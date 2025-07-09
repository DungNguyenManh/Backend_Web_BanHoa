import { Injectable } from '@nestjs/common';
import { FlowerCategory, getAllCategories, isValidCategory } from './schemas/category.schema';

@Injectable()
export class CategoriesService {

  // Trả về danh sách các danh mục hoa từ enum
  getAllCategories() {
    return getAllCategories();
  }

  // Kiểm tra một danh mục có hợp lệ không
  isValidCategory(category: string): boolean {
    return isValidCategory(category);
  }
}
