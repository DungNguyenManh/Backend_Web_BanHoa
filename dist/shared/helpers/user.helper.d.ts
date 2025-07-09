import { Model } from 'mongoose';
import { UserDocument } from '../../modules/users/schemas/user.schema';
export declare class UserHelper {
    static checkEmailExists(userModel: Model<UserDocument>, email: string): Promise<void>;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
