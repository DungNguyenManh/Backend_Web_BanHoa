"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const common_1 = require("@nestjs/common");
exports.multerConfig = {
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new common_1.BadRequestException('Chỉ cho phép file ảnh!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    }
};
//# sourceMappingURL=multer.config.js.map