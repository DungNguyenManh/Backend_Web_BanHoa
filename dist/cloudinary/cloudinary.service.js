"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let CloudinaryService = class CloudinaryService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file, folder = 'flower-shop', flowerName) {
        return new Promise((resolve, reject) => {
            const seoFileName = flowerName
                ? this.createSeoFriendlyName(flowerName)
                : this.createSeoFriendlyName(file.originalname);
            cloudinary_1.v2.uploader.upload_stream({
                folder: folder,
                resource_type: 'auto',
                public_id: `${Date.now()}-${seoFileName}`,
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto:good', fetch_format: 'auto' }
                ]
            }, (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                }
                else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        thumbnail: cloudinary_1.v2.url(result.public_id, {
                            width: 200,
                            height: 200,
                            crop: 'fill',
                            quality: 'auto:good',
                            fetch_format: 'auto'
                        }),
                        medium: cloudinary_1.v2.url(result.public_id, {
                            width: 500,
                            height: 500,
                            crop: 'limit',
                            quality: 'auto:good',
                            fetch_format: 'auto'
                        })
                    });
                }
                else {
                    reject(new Error('Upload failed: No result returned'));
                }
            }).end(file.buffer);
        });
    }
    async deleteImage(publicId) {
        return new Promise((resolve, reject) => {
            void cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    const errorMessage = error && typeof error === 'object' && 'message' in error
                        ? String(error.message)
                        : 'Unknown error';
                    reject(new Error(`Cloudinary delete failed: ${errorMessage}`));
                }
                else if (result) {
                    const resultValue = result && typeof result === 'object' && 'result' in result
                        ? String(result.result)
                        : 'deleted';
                    resolve({ result: resultValue });
                }
                else {
                    reject(new Error('Delete failed: No result returned'));
                }
            });
        });
    }
    generateUrl(publicId, options = {}) {
        try {
            return cloudinary_1.v2.url(publicId, {
                quality: 'auto:good',
                fetch_format: 'auto',
                ...options
            });
        }
        catch {
            return '';
        }
    }
    createSeoFriendlyName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .replace(/^-|-$/g, '');
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map