export declare enum FlowerCategory {
    HOA_BO = "Hoa b\u00F3",
    HOA_SAP = "Hoa s\u00E1p",
    HOA_KHAI_TRUONG = "Hoa khai tr\u01B0\u01A1ng",
    HOA_SINH_NHAT = "Hoa sinh nh\u1EADt",
    HOA_CHUC_MUNG = "Hoa ch\u00FAc m\u1EEBng",
    CHAU_HOA_LAN_HO_DIEP = "Ch\u1EADu Hoa Lan H\u1ED3 \u0110i\u1EC7p",
    HOA_CHIA_BUON = "Hoa chia bu\u1ED3n",
    HOA_HOP_GO = "Hoa h\u1ED9p g\u1ED7",
    GIO_TRAI_CAY = "Gi\u1ECF Tr\u00E1i C\u00E2y",
    HOA_SEN_DA = "Hoa Sen \u0110\u00E1",
    HOA_CUOI = "Hoa C\u01B0\u1EDBi"
}
export declare const getAllCategories: () => string[];
export declare const isValidCategory: (category: string) => boolean;
export declare const normalizeCategory: (category: string) => FlowerCategory;
