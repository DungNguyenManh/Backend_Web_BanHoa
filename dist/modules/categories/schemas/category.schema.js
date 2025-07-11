"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCategory = exports.getAllCategories = exports.FlowerCategories = void 0;
exports.FlowerCategories = [
    'Hoa bó',
    'Hoa sáp',
    'Hoa khai trương',
    'Hoa sinh nhật',
    'Hoa chúc mừng',
    'Chậu Hoa Lan Hồ Điệp',
    'Hoa chia buồn',
    'Hoa hộp gỗ',
    'Giỏ Trái Cây',
    'Hoa Sen Đá',
    'Hoa Cưới'
];
const getAllCategories = () => {
    return exports.FlowerCategories;
};
exports.getAllCategories = getAllCategories;
const isValidCategory = (category) => {
    return exports.FlowerCategories.includes(category);
};
exports.isValidCategory = isValidCategory;
//# sourceMappingURL=category.schema.js.map