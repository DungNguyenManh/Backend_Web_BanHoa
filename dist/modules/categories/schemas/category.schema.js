"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCategory = exports.isValidCategory = exports.getAllCategories = exports.FlowerCategory = void 0;
var FlowerCategory;
(function (FlowerCategory) {
    FlowerCategory["HOA_BO"] = "Hoa b\u00F3";
    FlowerCategory["HOA_SAP"] = "Hoa s\u00E1p";
    FlowerCategory["HOA_KHAI_TRUONG"] = "Hoa khai tr\u01B0\u01A1ng";
    FlowerCategory["HOA_VIP_PRO"] = "Hoa Vip Pro";
    FlowerCategory["HOA_SINH_NHAT"] = "Hoa sinh nh\u1EADt";
    FlowerCategory["HOA_CHUC_MUNG"] = "Hoa ch\u00FAc m\u1EEBng";
    FlowerCategory["CHAU_HOA_LAN_HO_DIEP"] = "Ch\u1EADu Hoa Lan H\u1ED3 \u0110i\u1EC7p";
    FlowerCategory["HOA_CHIA_BUON"] = "Hoa chia bu\u1ED3n";
    FlowerCategory["HOA_HOP_GO"] = "Hoa h\u1ED9p g\u1ED7";
    FlowerCategory["GIO_TRAI_CAY"] = "Gi\u1ECF Tr\u00E1i C\u00E2y";
    FlowerCategory["HOA_SEN_DA"] = "Hoa Sen \u0110\u00E1";
    FlowerCategory["HOA_CUOI"] = "Hoa C\u01B0\u1EDBi";
})(FlowerCategory || (exports.FlowerCategory = FlowerCategory = {}));
const getAllCategories = () => {
    return Object.values(FlowerCategory);
};
exports.getAllCategories = getAllCategories;
const isValidCategory = (category) => {
    return Object.keys(FlowerCategory).includes(category);
};
exports.isValidCategory = isValidCategory;
const normalizeCategory = (category) => {
    if ((0, exports.isValidCategory)(category)) {
        return FlowerCategory[category];
    }
    throw new Error(`Invalid category: ${category}`);
};
exports.normalizeCategory = normalizeCategory;
//# sourceMappingURL=category.schema.js.map