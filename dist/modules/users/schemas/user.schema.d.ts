import { Document } from 'mongoose';
import { UserRole } from '../../../shared/decorators/roles.decorator';
export type UserDocument = User & Document;
export { UserRole };
export declare class User {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    role: UserRole;
    accountType: string;
    isActive: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
