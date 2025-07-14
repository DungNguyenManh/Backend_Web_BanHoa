import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { OrdersService } from '../orders/orders.service';
import { Types } from 'mongoose';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly ordersService: OrdersService,
    ) {}

    // Lấy giỏ hàng của user hiện tại
    @Get()
    @ApiOperation({
        summary: '[USER] Lấy giỏ hàng',
        description: 'Lấy giỏ hàng của user hiện tại. Cần đăng nhập.'
    })
    @ApiResponse({ status: 200, description: 'Thông tin giỏ hàng' })
    @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
    getCart(@CurrentUser('_id') userId: string) {
        return this.cartService.getCart(userId);
    }

    // Thêm hoa vào giỏ
    @Post('add')
    @ApiOperation({
        summary: '[USER] Thêm hoa vào giỏ',
        description: 'Thêm hoa vào giỏ hàng. Cần đăng nhập.'
    })
    @ApiResponse({ status: 201, description: 'Thêm vào giỏ thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc hết hàng' })
    @ApiResponse({ status: 404, description: 'Hoa không tồn tại' })
    addToCart(@CurrentUser('_id') userId: string, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(userId, addToCartDto);
    }

    // Cập nhật số lượng item trong giỏ
    @Patch('items/:flowerId')
    @ApiOperation({
        summary: '[USER] Cập nhật số lượng hoa trong giỏ',
        description: 'Cập nhật số lượng của một hoa trong giỏ hàng. Cần đăng nhập.'
    })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
    @ApiResponse({ status: 400, description: 'Số lượng không hợp lệ' })
    @ApiResponse({ status: 404, description: 'Hoa không có trong giỏ' })
    updateCartItem(@CurrentUser('_id') userId: string,
        @Param('flowerId') flowerId: string,
        @Body() updateCartItemDto: UpdateCartItemDto
    ) {
        return this.cartService.updateCartItem(userId, flowerId, updateCartItemDto);
    }

    // Xóa item khỏi giỏ
    @Delete('items/:flowerId')
    @ApiOperation({
        summary: '[USER] Xóa hoa khỏi giỏ',
        description: 'Xóa một hoa khỏi giỏ hàng. Cần đăng nhập.'
    })
    @ApiResponse({ status: 200, description: 'Xóa thành công' })
    @ApiResponse({ status: 404, description: 'Hoa không có trong giỏ' })
    removeFromCart(@CurrentUser('_id') userId: string, @Param('flowerId') flowerId: string) {
        return this.cartService.removeFromCart(userId, flowerId);
    }

    // Xóa toàn bộ giỏ hàng
    @Delete('clear')
    @ApiOperation({
        summary: '[USER] Xóa toàn bộ giỏ hàng',
        description: 'Xóa tất cả hoa trong giỏ hàng. Cần đăng nhập.'
    })
    @ApiResponse({ status: 200, description: 'Xóa toàn bộ giỏ thành công' })
    clearCart(@CurrentUser('_id') userId: string) {
        return this.cartService.clearCart(userId);
    }
    // Đặt hàng: chuyển giỏ hàng thành đơn hàng thật
    @Post('checkout')
    @ApiOperation({
        summary: '[USER] Đặt hàng',
        description: 'Chuyển toàn bộ giỏ hàng thành đơn hàng thật, xóa giỏ hàng sau khi đặt.'
    })
    @ApiResponse({ status: 201, description: 'Đặt hàng thành công' })
    @ApiResponse({ status: 400, description: 'Giỏ hàng trống hoặc lỗi' })
    checkout(@CurrentUser('_id') userId: string) {
        return this.ordersService.checkout(userId);
    }
}
