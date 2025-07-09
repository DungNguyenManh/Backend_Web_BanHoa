import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // USER: Tạo đơn hàng từ giỏ hàng
  @Post()
  @ApiOperation({
    summary: '[USER] Tạo đơn hàng',
    description: 'Tạo đơn hàng từ giỏ hàng hiện tại. Cần đăng nhập.'
  })
  @ApiResponse({ status: 201, description: 'Đặt hàng thành công' })
  @ApiResponse({ status: 400, description: 'Giỏ hàng trống hoặc hết hàng' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  createOrder(@CurrentUser('id') userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  // USER: Lấy danh sách đơn hàng của user
  @Get('my-orders')
  @ApiOperation({
    summary: '[USER] Lấy đơn hàng của tôi',
    description: 'Lấy danh sách đơn hàng của user hiện tại. Cần đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  getUserOrders(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.ordersService.getUserOrders(userId, page, limit);
  }

  // ADMIN: Lấy tất cả đơn hàng
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '[ADMIN] Lấy tất cả đơn hàng',
    description: 'Lấy danh sách tất cả đơn hàng. Chỉ ADMIN.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  @ApiResponse({ status: 403, description: 'Không có quyền ADMIN' })
  getAllOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string
  ) {
    return this.ordersService.getAllOrders(page, limit, status as any);
  }

  // Lấy chi tiết đơn hàng
  @Get(':id')
  @ApiOperation({
    summary: '[USER/ADMIN] Lấy chi tiết đơn hàng',
    description: 'Lấy chi tiết đơn hàng. USER chỉ xem được đơn của mình, ADMIN xem được tất cả.'
  })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn hàng' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem đơn hàng này' })
  getOrder(@Param('id') id: string, @CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.ordersService.getOrderById(id, userId);
  }

  // ADMIN: Cập nhật trạng thái đơn hàng
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '[ADMIN] Cập nhật trạng thái đơn hàng',
    description: 'Cập nhật trạng thái đơn hàng. Chỉ ADMIN.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền ADMIN' })
  updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}
