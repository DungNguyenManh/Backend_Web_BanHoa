import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../shared/decorators/roles.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        data: {
            _id: unknown;
            email: string;
            name: string;
            phone: string;
            address: string;
            role: UserRole;
            isActive: boolean;
        };
    }>;
    findAll(query: string, current: string, pageSize: string): Promise<{
        results: (import("mongoose").FlattenMaps<import("./schemas/user.schema").UserDocument> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
        pagination: {
            current: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    activateUser(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deactivateUser(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
