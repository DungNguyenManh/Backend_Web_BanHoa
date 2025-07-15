import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutService, CheckoutInfo } from './checkout.service';

@ApiTags('Checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) {}

    @Post()
    @ApiOperation({ summary: 'Thanh toán', description: 'Tạo đơn hàng từ giỏ hàng, nhận thông tin nhận hàng.' })
    @ApiResponse({ status: 201, description: 'Đặt hàng thành công' })
    @ApiResponse({ status: 400, description: 'Giỏ hàng trống hoặc lỗi' })
    async checkout(@Req() req, @Body() body: CheckoutInfo) {
        return this.checkoutService.checkout(req.user.userId || req.user._id, body);
    }
}
