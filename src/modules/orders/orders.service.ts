import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async checkout(userId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart || !cart.items.length) {
      throw new NotFoundException('Giỏ hàng trống');
    }
    const total = cart.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const order = await this.orderModel.create({
      userId,
      items: cart.items.map(i => ({
        flowerId: i.flowerId,
        quantity: i.quantity,
        price: i.price,
        salePrice: i.salePrice,
      })),
      total,
      status: 'PENDING',
    });
    cart.items = [];
    await cart.save();
    return { message: 'Đặt hàng thành công', data: order };
  }

  async getOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }
}
