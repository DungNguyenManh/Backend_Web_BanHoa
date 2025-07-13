import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Chỉ ADMIN mới được tạo user mới
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Chỉ ADMIN mới được xem danh sách tất cả user
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  // Chỉ ADMIN mới được xem chi tiết user
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Đổi mật khẩu cho user đang đăng nhập (KHÔNG bị RolesGuard chặn)
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: { user: { _id: string } }, @Body() dto: ChangePasswordDto) {
    // Đảm bảo chỉ user đã đăng nhập mới đổi được mật khẩu của chính mình
    return this.usersService.changePassword(req.user._id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Chỉ ADMIN mới được xóa user
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Chỉ ADMIN mới được kích hoạt tài khoản user
  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  // Chỉ ADMIN mới được vô hiệu hóa tài khoản user
  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deactivateUser(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(id, false);
  }
  
  // Gửi mã xác nhận quên mật khẩu về email (public)
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.usersService.requestPasswordReset(email);
  }

  // Đặt lại mật khẩu bằng mã xác nhận (public)
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmNewPassword') confirmNewPassword: string,
  ) {
    return this.usersService.resetPassword(email, code, newPassword, confirmNewPassword);
  }
}
