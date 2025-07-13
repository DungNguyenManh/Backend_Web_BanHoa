import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../shared/decorators/roles.decorator';

export type UserDocument = User & Document;
export { UserRole }; // Re-export để dùng trong các file khác

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop({ enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ default: 'LOCAL' })
    accountType: string;

    @Prop({ default: false })
    isActive: boolean;

    // Quên mật khẩu: mã xác nhận và hạn sử dụng
    @Prop()
    resetPasswordCode?: string;

    @Prop()
    resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);