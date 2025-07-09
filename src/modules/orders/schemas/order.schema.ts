import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export enum PaymentMethod {
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    CREDIT_CARD = 'credit_card',
    E_WALLET = 'e_wallet'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

@Schema({ timestamps: true })
export class OrderItem {
    @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
    flowerId: Types.ObjectId;

    @Prop({ required: true })
    flowerName: string; // Lưu tên hoa tại thời điểm đặt

    @Prop()
    flowerImage?: string; // Lưu ảnh hoa tại thời điểm đặt

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 0 })
    price: number; // Giá tại thời điểm đặt

    @Prop()
    salePrice?: number; // Giá khuyến mãi tại thời điểm đặt
}

@Schema({ timestamps: true })
export class ShippingAddress {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    ward?: string;

    @Prop()
    district?: string;

    @Prop()
    city?: string;

    @Prop()
    note?: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    orderNumber: string; // Mã đơn hàng (FLW001, FLW002, ...)

    @Prop([OrderItem])
    items: OrderItem[];

    @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Prop({ required: true, enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Prop({ type: ShippingAddress, required: true })
    shippingAddress: ShippingAddress;

    @Prop({ required: true, min: 0 })
    totalAmount: number;

    @Prop({ min: 0, default: 0 })
    shippingFee: number;

    @Prop({ min: 0, default: 0 })
    discount: number;

    @Prop({ required: true, min: 0 })
    finalAmount: number; // totalAmount + shippingFee - discount

    @Prop()
    note?: string; // Ghi chú từ khách hàng

    @Prop()
    adminNote?: string; // Ghi chú từ admin

    @Prop()
    deliveredAt?: Date;

    @Prop()
    cancelledAt?: Date;

    @Prop()
    cancelReason?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

// Index để tìm kiếm nhanh
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
