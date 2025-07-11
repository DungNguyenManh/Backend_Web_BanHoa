import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thanh toán giỏ hàng', description: 'Chuyển giỏ hàng thành đơn hàng, xóa giỏ hàng sau khi đặt.' })
  @ApiResponse({ status: 201, description: 'Đặt hàng thành công' })
  async checkout(@Req() req) {
    return this.ordersService.checkout(req.user.userId || req.user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lịch sử đơn hàng', description: 'Lấy danh sách đơn hàng của user.' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getOrders(@Req() req) {
    return this.ordersService.getOrders(req.user.userId || req.user._id);
  }
}
