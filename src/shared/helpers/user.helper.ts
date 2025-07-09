import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../../modules/users/schemas/user.schema';

export class UserHelper {

    // Kiểm tra email đã tồn tại
    static async checkEmailExists(userModel: Model<UserDocument>, email: string): Promise<void> {
        // Tìm user theo email (lean() để tăng tốc độ truy vấn)
        const user = await userModel.findOne({ email }).lean();

        if (user) {
            throw new BadRequestException(`Email đã được sử dụng: ${email}`);
        }
    }

    // Hash password
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // So sánh password
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }


}
