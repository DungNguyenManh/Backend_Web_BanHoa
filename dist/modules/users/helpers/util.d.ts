import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class UserUtil {
    static checkEmailExists(userModel: Model<UserDocument>, email: string): Promise<void>;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static sanitizeUser(user: UserDocument): {
        _id: unknown;
        email: string;
        name: string;
        phone: string;
        address: string;
    };
    static findAllWithPagination(userModel: Model<UserDocument>, query: string, current: number, pageSize: number): Promise<{
        results: (import("mongoose").FlattenMaps<UserDocument> & Required<{
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
    static validatePaginationParams(current?: number, pageSize?: number): void;
}
