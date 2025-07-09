import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Flower, FlowerDocument } from '../flowers/schemas/flower.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Flower.name) private flowerModel: Model<FlowerDocument>,
  ) { }

  // Tạo đơn hàng từ giỏ hàng
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { paymentMethod, shippingAddress, shippingFee = 0, discount = 0, note } = createOrderDto;

    // Lấy giỏ hàng
    const cart = await this.cartModel.findOne({ userId }).populate('items.flowerId');
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // Kiểm tra tồn kho và tính toán lại giá
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const cartItem of cart.items) {
      const flower = await this.flowerModel.findById(cartItem.flowerId);
      if (!flower || !flower.isActive || !flower.isAvailable) {
        throw new BadRequestException(`Hoa "${flower?.name || 'không xác định'}" hiện không khả dụng`);
      }
      if (flower.stock < cartItem.quantity) {
        throw new BadRequestException(`Hoa "${flower.name}" chỉ còn ${flower.stock} sản phẩm trong kho`);
      }

      const itemPrice = flower.salePrice || flower.originalPrice;
      const itemTotal = itemPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        flowerId: flower._id,
        flowerName: flower.name,
        flowerImage: flower.imageUrl,
        quantity: cartItem.quantity,
        price: flower.originalPrice,
        salePrice: flower.salePrice
      });
    }

    const finalAmount = totalAmount + shippingFee - discount;

    // Tạo mã đơn hàng
    const orderNumber = await this.generateOrderNumber();

    // Tạo đơn hàng
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      orderNumber,
      items: orderItems,
      paymentMethod,
      shippingAddress,
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
      note
    });

    // Cập nhật tồn kho
    for (const item of orderItems) {
      await this.flowerModel.findByIdAndUpdate(
        item.flowerId,
        {
          $inc: {
            stock: -item.quantity,
            soldCount: item.quantity
          }
        }
      );

      // Cập nhật isAvailable nếu hết hàng
      const updatedFlower = await this.flowerModel.findById(item.flowerId);
      if (updatedFlower && updatedFlower.stock === 0) {
        await this.flowerModel.findByIdAndUpdate(item.flowerId, { isAvailable: false });
      }
    }

    // Xóa giỏ hàng
    await this.cartModel.findOneAndUpdate({ userId }, { items: [] });

    return {
      message: 'Đặt hàng thành công',
      data: order
    };
  }

  // Tạo mã đơn hàng tự động
  private async generateOrderNumber(): Promise<string> {
    const prefix = 'FLW';
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Đếm số đơn hàng trong ngày
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const count = await this.orderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    const orderNumber = `${prefix}${dateStr}${String(count + 1).padStart(3, '0')}`;
    return orderNumber;
  }

  // Lấy danh sách đơn hàng của user
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments({ userId })
    ]);

    return {
      data: orders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: orders.length,
        totalItems: total
      }
    };
  }

  // Lấy chi tiết đơn hàng
  async getOrderById(orderId: string, userId?: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Nếu có userId, kiểm tra quyền sở hữu
    if (userId && order.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return {
      data: order
    };
  }

  // ADMIN: Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status, paymentStatus, adminNote, cancelReason } = updateOrderStatusDto;

    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;

      if (status === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
      } else if (status === OrderStatus.CANCELLED) {
        updateData.cancelledAt = new Date();
        if (cancelReason) {
          updateData.cancelReason = cancelReason;
        }

        // Hoàn lại tồn kho khi hủy đơn
        for (const item of order.items) {
          await this.flowerModel.findByIdAndUpdate(
            item.flowerId,
            {
              $inc: {
                stock: item.quantity,
                soldCount: -item.quantity
              },
              isAvailable: true
            }
          );
        }
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (adminNote) {
      updateData.adminNote = adminNote;
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder
    };
  }

  // ADMIN: Lấy tất cả đơn hàng
  async getAllOrders(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter)
    ]);

    return {
      data: orders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: orders.length,
        totalItems: total
      }
    };
  }
}
