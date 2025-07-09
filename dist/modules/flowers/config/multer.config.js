"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const common_1 = require("@nestjs/common");
exports.multerConfig = {
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            callback(null, true);
        }
        else {
            callback(new common_1.BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'), false);
        }
    },
};
//# sourceMappingURL=multer.config.js.map