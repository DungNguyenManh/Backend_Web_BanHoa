import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { CheckoutDto } from '../checkout/dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<any>,
  ) {}

  // Thanh toán: chuyển toàn bộ sản phẩm trong giỏ thành đơn hàng mới và xóa giỏ hàng
  async checkout(userId: string, checkoutInfo?: CheckoutDto) {
    // Lấy giỏ hàng của user
    const cart = await this.cartModel.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new NotFoundException('Giỏ hàng trống');
    }
    // Tính tổng tiền
    const total = cart.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    // Tạo đơn hàng mới
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
      orderNumber: new Types.ObjectId().toHexString()
    });
    // Xóa sạch giỏ hàng sau khi đặt
    cart.items = [];
    await cart.save();
    // Trả về đơn hàng vừa đặt
    return { message: 'Đặt hàng thành công', data: orderDoc };
  }

  async getOrders(userId: string) {
  return this.orderModel
    .find({ userId: new Types.ObjectId(userId) })
    .populate('items.flowerId', 'name imageUrl originalPrice salePrice')
    .sort({ createdAt: -1 });
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
