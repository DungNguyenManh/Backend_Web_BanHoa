import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FlowerCategories } from '../../categories/schemas/category.schema';

export type FlowerDocument = Flower & Document;

@Schema({ timestamps: true })
export class Flower {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, min: 0 })
    originalPrice: number; // Giá gốc

    @Prop({ min: 0 })
    salePrice?: number; // Giá khuyến mãi (optional)

    @Prop({
        required: true,
        enum: FlowerCategories
    })
    category: string; // Chỉ chấp nhận các giá trị từ FlowerCategories

    @Prop()
    imageUrl?: string; // URL hình ảnh

    @Prop([String])
    gallery?: string[]; // Nhiều hình ảnh

    @Prop({ default: true })
    isActive: boolean; // Có hiển thị không

    @Prop({ default: true })
    isAvailable: boolean; // Có sẵn để bán không

    @Prop()
    weight?: number; // Trọng lượng (gram)

    @Prop()
    height?: number; // Chiều cao (cm)

    @Prop()
    diameter?: number; // Đường kính (cm)

    @Prop([String])
    colors?: string[]; // Màu sắc: ["Đỏ", "Hồng", "Trắng"]

    @Prop()
    occasion?: string; // Dịp sử dụng: "Sinh nhật", "Valentine", "8/3"

    @Prop()
    careInstructions?: string; // Hướng dẫn chăm sóc

    @Prop({ min: 0, max: 5, default: 0 })
    rating?: number; // Đánh giá trung bình

    @Prop({ min: 0, default: 0 })
    reviewCount?: number; // Số lượng đánh giá

    @Prop({ min: 0, default: 0 })
    soldCount?: number; // Số lượng đã bán
}

export const FlowerSchema = SchemaFactory.createForClass(Flower);