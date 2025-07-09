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
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string, flowerName?: string): Promise<CloudinaryUploadResult>;
    deleteImage(publicId: string): Promise<CloudinaryDeleteResult>;
    generateUrl(publicId: string, options?: Record<string, unknown>): string;
    private createSeoFriendlyName;
}
