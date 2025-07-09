import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
    flowerId: Types.ObjectId;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 0 })
    price: number; // Giá tại thời điểm thêm vào giỏ

    @Prop()
    salePrice?: number; // Giá khuyến mãi (nếu có)
}

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop([CartItem])
    items: CartItem[];

    @Prop({ default: 0 })
    totalAmount: number; // Tổng tiền giỏ hàng

    @Prop({ default: 0 })
    totalItems: number; // Tổng số sản phẩm
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Middleware để tự động tính tổng
CartSchema.pre('save', function () {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalAmount = this.items.reduce((sum, item) => {
        const itemPrice = item.salePrice || item.price;
        return sum + (itemPrice * item.quantity);
    }, 0);
});
