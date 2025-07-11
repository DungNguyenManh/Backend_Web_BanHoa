import { Model } from 'mongoose';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { FlowerQueryDto } from './dto/flower-query.dto';
import { Flower, FlowerDocument } from './schemas/flower.schema';
import { CloudinaryService, CloudinaryUploadResult } from '../../cloudinary/cloudinary.service';
export declare class FlowersService {
    private flowerModel;
    private cloudinaryService;
    constructor(flowerModel: Model<FlowerDocument>, cloudinaryService: CloudinaryService);
    createWithGallery(createFlowerDto: CreateFlowerDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    uploadImageOnly(image: Express.Multer.File, folder?: string, flowerName?: string): Promise<CloudinaryUploadResult>;
    findAll(query?: FlowerQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            current: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, updateFlowerDto: UpdateFlowerDto): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getBestSellers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getLatestFlowers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSaleFlowers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, FlowerDocument, {}> & Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
