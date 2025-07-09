"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponseDto = exports.CartItemResponseDto = void 0;
class CartItemResponseDto {
    flowerId;
    flowerName;
    flowerImage;
    quantity;
    price;
    salePrice;
    totalPrice;
}
exports.CartItemResponseDto = CartItemResponseDto;
class CartResponseDto {
    userId;
    items;
    totalAmount;
    totalItems;
    createdAt;
    updatedAt;
}
exports.CartResponseDto = CartResponseDto;
//# sourceMappingURL=cart-response.dto.js.map