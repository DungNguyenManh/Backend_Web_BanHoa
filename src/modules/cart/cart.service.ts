import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Flower, FlowerDocument } from '../flowers/schemas/flower.schema';
import { Order } from '../orders/schemas/order.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

export interface CheckoutInfo {
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    note?: string;
    paymentMethod?: string;
}

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Flower.name) private flowerModel: Model<FlowerDocument>,
        @InjectModel(Order.name) private orderModel: Model<any>,
    ) { }
    // Thanh toán: chuyển toàn bộ sản phẩm trong giỏ thành đơn hàng mới và xóa giỏ hàng
    async checkoutCart(userId: string, checkoutInfo?: CheckoutInfo) {
        // Lấy giỏ hàng của user
        const cart = await this.cartModel.findOne({ userId });
        if (!cart || !cart.items.length) {
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
        });
        // Xóa sạch giỏ hàng sau khi đặt
        cart.items = [];
        await cart.save();
        // Trả về đơn hàng vừa đặt
        return { message: 'Đặt hàng thành công', data: orderDoc };
    }

    // Lấy giỏ hàng của user (tạo mới nếu chưa có)
    async getCart(userId: string) {
        try {
            let cart = await this.cartModel.findOne({ userId: String(userId) }).populate('items.flowerId', 'name imageUrl originalPrice salePrice');
            if (!cart) {
                // Nếu chưa có giỏ hàng thì trả về giỏ rỗng, không tạo mới
                return {
                    message: 'Lấy giỏ hàng thành công',
                    data: { userId: String(userId), items: [] }
                };
            }
            return {
                message: 'Lấy giỏ hàng thành công',
                data: cart
            };
        } catch (error) {
            return {
                message: 'Lỗi lấy giỏ hàng',
                data: { userId: String(userId), items: [] },
                error: error.message
            };
        }
    }

    // Thêm hoa vào giỏ
    async addToCart(userId: string, addToCartDto: AddToCartDto) {
        const { flowerId, quantity } = addToCartDto;

        // Kiểm tra hoa có tồn tại và còn hàng không
        const flower = await this.flowerModel.findById(flowerId);
        if (!flower) {
            throw new NotFoundException('Hoa không tồn tại');
        }
        if (!flower.isActive || !flower.isAvailable) {
            throw new BadRequestException('Hoa này hiện không khả dụng');
        }

        // Lấy hoặc tạo giỏ hàng
        let cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }

        // Kiểm tra hoa đã có trong giỏ chưa
        const existingItemIndex = cart.items.findIndex(
            item => item.flowerId.toString() === flowerId
        );

        if (existingItemIndex >= 0) {
            // Cập nhật số lượng nếu đã có
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Thêm mới nếu chưa có
            cart.items.push({
                flowerId: new Types.ObjectId(flowerId),
                quantity,
                price: flower.originalPrice,
                salePrice: flower.salePrice
            });
        }

        await cart.save();
        await cart.populate('items.flowerId', 'name imageUrl originalPrice salePrice');

        return {
            message: 'Thêm vào giỏ hàng thành công',
            data: cart
        };
    }

    // Cập nhật số lượng item trong giỏ
    async updateCartItem(userId: string, flowerId: string, updateCartItemDto: UpdateCartItemDto) {
        const { quantity } = updateCartItemDto;

        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new NotFoundException('Giỏ hàng không tồn tại');
        }

        const itemIndex = cart.items.findIndex(
            item => item.flowerId.toString() === flowerId
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
        }

        if (quantity === undefined) {
            throw new BadRequestException('Số lượng không được để trống');
        }

        // Không kiểm tra số lượng tồn kho nữa

        if (quantity <= 0) {
            // Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
        await cart.populate('items.flowerId', 'name imageUrl originalPrice salePrice');

        return {
            message: 'Cập nhật giỏ hàng thành công',
            data: cart
        };
    }

    // Xóa item khỏi giỏ
    async removeFromCart(userId: string, flowerId: string) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new NotFoundException('Giỏ hàng không tồn tại');
        }

        cart.items = cart.items.filter(
            item => item.flowerId.toString() !== flowerId
        );

        await cart.save();
        await cart.populate('items.flowerId', 'name imageUrl originalPrice salePrice');

        return {
            message: 'Xóa khỏi giỏ hàng thành công',
            data: cart
        };
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart(userId: string) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new NotFoundException('Giỏ hàng không tồn tại');
        }

        cart.items = [];
        await cart.save();

        return {
            message: 'Xóa toàn bộ giỏ hàng thành công',
            data: cart
        };
    }
}
