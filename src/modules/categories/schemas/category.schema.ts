// Enum các danh mục hoa cố định
export enum FlowerCategory {
    HOA_BO = 'Hoa bó',
    HOA_SAP = 'Hoa sáp',
    HOA_KHAI_TRUONG = 'Hoa khai trương',
    HOA_VIP_PRO = 'Hoa Vip Pro',
    HOA_SINH_NHAT = 'Hoa sinh nhật',
    HOA_CHUC_MUNG = 'Hoa chúc mừng',
    CHAU_HOA_LAN_HO_DIEP = 'Chậu Hoa Lan Hồ Điệp',
    HOA_CHIA_BUON = 'Hoa chia buồn',
    HOA_HOP_GO = 'Hoa hộp gỗ',
    GIO_TRAI_CAY = 'Giỏ Trái Cây',
    HOA_SEN_DA = 'Hoa Sen Đá',
    HOA_CUOI = 'Hoa Cưới'
}

// Helper functions để làm việc với enum
export const getAllCategories = (): string[] => {
    return Object.values(FlowerCategory);
};

export const isValidCategory = (category: string): boolean => {
    return Object.keys(FlowerCategory).includes(category);
};

// Chuyển đổi key enum thành value (HOA_BO -> "Hoa bó")
export const normalizeCategory = (category: string): FlowerCategory => {
    if (isValidCategory(category)) {
        return FlowerCategory[category as keyof typeof FlowerCategory];
    }
    throw new Error(`Invalid category: ${category}`);
};
