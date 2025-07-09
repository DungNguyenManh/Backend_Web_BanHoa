import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<any>;
    deleteImage(publicId: string): Promise<any>;
    generateUrl(publicId: string, options?: any): string;
}
