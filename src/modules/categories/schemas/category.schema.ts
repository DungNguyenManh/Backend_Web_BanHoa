// Danh mục hoa cố định dạng string
export const FlowerCategories = [
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

// Helper functions để làm việc với danh mục
export const getAllCategories = (): string[] => {
    return FlowerCategories;
};

export const isValidCategory = (category: string): boolean => {
    return FlowerCategories.includes(category);
};
