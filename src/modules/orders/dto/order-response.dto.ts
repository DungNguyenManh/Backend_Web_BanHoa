import { OrderStatus, PaymentStatus, PaymentMethod } from '../schemas/order.schema';

export class OrderItemResponseDto {
    flowerId: string;
    flowerName: string;
    flowerImage?: string;
    quantity: number;
    price: number;
    salePrice?: number;
    totalPrice: number;
}

export class ShippingAddressResponseDto {
    fullName: string;
    phone: string;
    address: string;
    ward?: string;
    district?: string;
    city?: string;
    note?: string;
}

export class OrderResponseDto {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItemResponseDto[];
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    shippingAddress: ShippingAddressResponseDto;
    totalAmount: number;
    shippingFee: number;
    discount: number;
    finalAmount: number;
    note?: string;
    adminNote?: string;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
