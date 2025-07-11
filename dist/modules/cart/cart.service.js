"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const flower_schema_1 = require("../flowers/schemas/flower.schema");
let CartService = class CartService {
    cartModel;
    flowerModel;
    constructor(cartModel, flowerModel) {
        this.cartModel = cartModel;
        this.flowerModel = flowerModel;
    }
    async getCart(userId) {
        let cart = await this.cartModel.findOne({ userId }).populate('items.flowerId', 'name imageUrl originalPrice salePrice');
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [] });
        }
        return {
            message: 'Lấy giỏ hàng thành công',
            data: cart
        };
    }
    async addToCart(userId, addToCartDto) {
        const { flowerId, quantity } = addToCartDto;
        const flower = await this.flowerModel.findById(flowerId);
        if (!flower) {
            throw new common_1.NotFoundException('Hoa không tồn tại');
        }
        if (!flower.isActive || !flower.isAvailable) {
            throw new common_1.BadRequestException('Hoa này hiện không khả dụng');
        }
        let cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex(item => item.flowerId.toString() === flowerId);
        if (existingItemIndex >= 0) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            cart.items[existingItemIndex].quantity = newQuantity;
        }
        else {
            cart.items.push({
                flowerId: new mongoose_2.Types.ObjectId(flowerId),
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
    async updateCartItem(userId, flowerId, updateCartItemDto) {
        const { quantity } = updateCartItemDto;
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new common_1.NotFoundException('Giỏ hàng không tồn tại');
        }
        const itemIndex = cart.items.findIndex(item => item.flowerId.toString() === flowerId);
        if (itemIndex === -1) {
            throw new common_1.NotFoundException('Sản phẩm không có trong giỏ hàng');
        }
        if (quantity === undefined) {
            throw new common_1.BadRequestException('Số lượng không được để trống');
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.flowerId', 'name imageUrl originalPrice salePrice');
        return {
            message: 'Cập nhật giỏ hàng thành công',
            data: cart
        };
    }
    async removeFromCart(userId, flowerId) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new common_1.NotFoundException('Giỏ hàng không tồn tại');
        }
        cart.items = cart.items.filter(item => item.flowerId.toString() !== flowerId);
        await cart.save();
        await cart.populate('items.flowerId', 'name imageUrl originalPrice salePrice');
        return {
            message: 'Xóa khỏi giỏ hàng thành công',
            data: cart
        };
    }
    async clearCart(userId) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new common_1.NotFoundException('Giỏ hàng không tồn tại');
        }
        cart.items = [];
        await cart.save();
        return {
            message: 'Xóa toàn bộ giỏ hàng thành công',
            data: cart
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(flower_schema_1.Flower.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map