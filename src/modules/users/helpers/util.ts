import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../schemas/user.schema';
import aqp from 'api-query-params';

export class UserUtil {

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

    // Sanitize user data (loại bỏ password)
    static sanitizeUser(user: UserDocument) {
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
        };
    }

    // Pagination và query util
    static async findAllWithPagination(
        userModel: Model<UserDocument>,
        query: string,
        current: number,
        pageSize: number
    ) {
        // Parse query parameters
        const { filter, sort } = aqp(query);

        // Loại bỏ pagination params khỏi filter
        if (filter.current) delete filter.current;
        if (filter.pageSize) delete filter.pageSize;

        // Set default values
        const page = current || 1;
        const size = pageSize || 10;

        // Tính toán pagination
        const totalItems = await userModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / size);
        const skip = (page - 1) * size;

        // Query database
        const results = await userModel
            .find(filter)
            .limit(size)
            .skip(skip)
            .select('-password') // Loại bỏ password
            .sort(sort as any)
            .lean(); // Để tăng performance

        return {
            results,
            pagination: {
                current: page,
                pageSize: size,
                totalItems,
                totalPages,
            }
        };
    }

    // Validate pagination parameters
    static validatePaginationParams(current?: number, pageSize?: number) {
        if (current && current < 1) {
            throw new BadRequestException('Trang hiện tại phải lớn hơn 0');
        }
        if (pageSize && (pageSize < 1 || pageSize > 100)) {
            throw new BadRequestException('Kích thước trang phải từ 1 đến 100');
        }
    }
}
