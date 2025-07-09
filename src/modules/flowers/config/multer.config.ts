import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerConfig: MulterOptions = {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, callback) => {
        // Chỉ cho phép file ảnh
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            callback(null, true);
        } else {
            callback(new BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'), false);
        }
    },
};
