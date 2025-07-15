import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}



  async getOrders(userId: string) {
    // Trả về các đơn hàng của user, mới nhất lên đầu
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }
  // ADMIN: Lấy tất cả đơn hàng (có thể lọc theo trạng thái)
  async getAllOrders(status?: string) {
    const filter = status ? { status } : {};
    return this.orderModel.find(filter).sort({ createdAt: -1 });
  }

  // ADMIN: Xem chi tiết đơn hàng
  async getOrderDetail(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }
}
