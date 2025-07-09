import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    thumbnail: string;
    medium: string;
}

export interface CloudinaryDeleteResult {
    result: string;
}

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, folder: string = 'flower-shop', flowerName?: string): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            // Tạo tên file SEO-friendly
            const seoFileName = flowerName
                ? this.createSeoFriendlyName(flowerName)
                : this.createSeoFriendlyName(file.originalname);

            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${seoFileName}`,
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto:good', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    } else if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            thumbnail: cloudinary.url(result.public_id, {
                                width: 200,
                                height: 200,
                                crop: 'fill',
                                quality: 'auto:good',
                                fetch_format: 'auto'
                            }),
                            medium: cloudinary.url(result.public_id, {
                                width: 500,
                                height: 500,
                                crop: 'limit',
                                quality: 'auto:good',
                                fetch_format: 'auto'
                            })
                        });
                    } else {
                        reject(new Error('Upload failed: No result returned'));
                    }
                }
            ).end(file.buffer);
        });
    }

    async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
        return new Promise((resolve, reject) => {
            void cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    const errorMessage = error && typeof error === 'object' && 'message' in error
                        ? String((error as { message: string }).message)
                        : 'Unknown error';
                    reject(new Error(`Cloudinary delete failed: ${errorMessage}`));
                } else if (result) {
                    const resultValue = result && typeof result === 'object' && 'result' in result
                        ? String((result as { result: string }).result)
                        : 'deleted';
                    resolve({ result: resultValue });
                } else {
                    reject(new Error('Delete failed: No result returned'));
                }
            });
        });
    }

    generateUrl(publicId: string, options: Record<string, unknown> = {}): string {
        try {
            return cloudinary.url(publicId, {
                quality: 'auto:good',
                fetch_format: 'auto',
                ...options
            });
        } catch {
            return '';
        }
    }

    private createSeoFriendlyName(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
            .replace(/\s+/g, '-')         // Thay space bằng dấu gạch ngang
            .replace(/-+/g, '-')          // Loại bỏ dấu gạch ngang liên tiếp
            .trim()
            .replace(/^-|-$/g, '');       // Loại bỏ dấu gạch ngang đầu/cuối
    }
}
