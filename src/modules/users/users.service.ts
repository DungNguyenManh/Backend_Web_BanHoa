import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { UserUtil } from './helpers/util';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  // Tạo người dùng mới (Admin tạo - default ADMIN role, active: true)
  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone, address } = createUserDto;

    // Kiểm tra email đã tồn tại chưa (sử dụng helper)
    await UserUtil.checkEmailExists(this.userModel, email);

    // Hash mật khẩu (sử dụng helper)
    const hashPassword = await UserUtil.hashPassword(password);

    // Tạo user mới với role ADMIN và active: true
    const user = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      phone,
      address,
      role: UserRole.ADMIN,
      isActive: true,
    });

    return {
      message: 'Tạo tài khoản thành công',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      }
    };
  }

  // Đăng ký người dùng mới (User tự đăng ký - default USER role, active: false)
  async register(createUserDto: CreateUserDto) {
    const { email, password, name, phone, address } = createUserDto;

    // Kiểm tra email đã tồn tại chưa (sử dụng helper)
    await UserUtil.checkEmailExists(this.userModel, email);

    // Hash mật khẩu (sử dụng helper)
    const hashPassword = await UserUtil.hashPassword(password);

    // Tạo user mới với role USER và active: false
    const user = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      phone,
      address,
      role: UserRole.USER,
      isActive: false,
    });

    return {
      message: 'Đăng ký tài khoản thành công',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      }
    };
  }

  async findAll(query: any, current: number, pageSize: number) {
    // Validate pagination parameters
    UserUtil.validatePaginationParams(current, pageSize);

    // Xử lý query string hoặc object an toàn
    let queryObj: Record<string, unknown> = {};
    if (typeof query === 'string' && query.trim() !== '') {
      try {
        queryObj = JSON.parse(query) as Record<string, unknown>;
      } catch (e) {
        throw new BadRequestException('Query không hợp lệ!');
      }
    } else if (typeof query === 'object' && query !== null) {
      queryObj = query;
    }

    // Sử dụng util để handle pagination và query
    return await UserUtil.findAllWithPagination(
      this.userModel,
      queryObj,
      current,
      pageSize
    );
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  // Tìm user theo email (cho Auth)
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Xác nhận mật khẩu mới không khớp');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('Không tìm thấy user');

    const isMatch = await UserUtil.comparePassword(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Sai mật khẩu');

    const isSame = await UserUtil.comparePassword(newPassword, user.password);
    if (isSame) throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ');

    user.password = await UserUtil.hashPassword(newPassword);
    await user.save();

    return { message: 'Đổi mật khẩu thành công' };
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  // Kích hoạt hoặc vô hiệu hóa tài khoản user
  async toggleUserStatus(id: string, isActive: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new BadRequestException('Không tìm thấy user');
    }

    return {
      message: `Tài khoản đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      data: user
    };
  }

  // Kích hoạt tài khoản user (chỉ admin mới được dùng)
  async activateUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new BadRequestException('Không tìm thấy user');
    }

    return {
      message: 'Tài khoản đã được kích hoạt thành công',
      data: user
    };
  }
}
