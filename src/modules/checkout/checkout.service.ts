import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../cart/schemas/cart.schema';
import { Order } from '../orders/schemas/order.schema';

export interface CheckoutInfo {
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    note?: string;
    paymentMethod?: string;
}

@Injectable()
export class CheckoutService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<any>,
        @InjectModel(Order.name) private orderModel: Model<any>,
    ) {}

    async checkout(userId: string, checkoutInfo?: CheckoutInfo) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart || !cart.items.length) {
            throw new NotFoundException('Giỏ hàng trống');
        }
        const total = cart.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
        const orderDoc = await this.orderModel.create({
            userId: new Types.ObjectId(userId),
            items: cart.items.map(i => ({
                flowerId: i.flowerId,
                quantity: i.quantity,
                price: i.price,
                salePrice: i.salePrice,
            })),
            total,
            status: 'PENDING',
            recipientName: checkoutInfo?.recipientName,
            recipientPhone: checkoutInfo?.recipientPhone,
            shippingAddress: checkoutInfo?.shippingAddress,
            note: checkoutInfo?.note,
            paymentMethod: checkoutInfo?.paymentMethod,
        });
        cart.items = [];
        await cart.save();
        return { message: 'Đặt hàng thành công', data: orderDoc };
    }
}
