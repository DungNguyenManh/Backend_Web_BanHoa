import { FlowersService } from './flowers.service';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { FlowerQueryDto } from './dto/flower-query.dto';
export declare class FlowersController {
    private readonly flowersService;
    constructor(flowersService: FlowersService);
    create(createFlowerDto: CreateFlowerDto, images?: Express.Multer.File[]): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        uploadedImages: number;
    }>;
    findAll(query: FlowerQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
        data: import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, updateFlowerDto: UpdateFlowerDto): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getBestSellers(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getLatest(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getOnSale(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/flower.schema").FlowerDocument, {}> & import("./schemas/flower.schema").Flower & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSeoMetadata(id: string): Promise<{
        title: string;
        description: string;
        keywords: string;
        ogImage: string | undefined;
        price: number;
        availability: string;
        category: string;
    }>;
    getSitemapData(): Promise<{
        flowers: {
            id: unknown;
            slug: string;
            lastmod: string;
            priority: string;
        }[];
    }>;
    private createSlug;
}
