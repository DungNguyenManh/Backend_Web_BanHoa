import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Chỉ ADMIN mới được tạo user mới
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Chỉ ADMIN mới được xem danh sách tất cả user
  @Get()
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
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user._id, dto);
  }

  // Chỉ ADMIN mới được xóa user
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Chỉ ADMIN mới được kích hoạt tài khoản user
  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  // Chỉ ADMIN mới được vô hiệu hóa tài khoản user
  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  deactivateUser(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(id, false);
  }
}
