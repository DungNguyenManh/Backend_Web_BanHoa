
import { Controller, Post, UseGuards, Req, Get, Param, Query, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UserRole } from '../../shared/decorators/roles.decorator';
import { CheckoutDto } from '../checkout/dto/checkout.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thanh toán', description: 'Tạo đơn hàng từ giỏ hàng, nhận thông tin nhận hàng.' })
  @ApiResponse({ status: 201, description: 'Đặt hàng thành công' })
  @ApiResponse({ status: 400, description: 'Giỏ hàng trống hoặc lỗi' })
  async checkout(@Req() req, @Body() body: CheckoutDto) {
    return this.ordersService.checkout(req.user.userId || req.user._id, body);
  }


  // ADMIN: Xem tất cả đơn hàng
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Xem tất cả đơn hàng', description: 'Chỉ ADMIN mới xem được toàn bộ đơn hàng.' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getAllOrders(@Query('status') status?: string) {
    return this.ordersService.getAllOrders(status);
  }

  // USER: Xem đơn hàng của chính mình
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lịch sử đơn hàng', description: 'Lấy danh sách đơn hàng của user.' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getMyOrders(@Req() req) {
    return this.ordersService.getOrders(req.user.userId || req.user._id);
  }
}
