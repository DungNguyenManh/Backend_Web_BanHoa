import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UsersService } from '../users/users.service';
import { UserUtil } from '../users/helpers/util';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    // Validate user cho LocalStrategy
    async validateUser(email: string, password: string): Promise<Omit<UserDocument, 'password'> | null> {
        console.log('🔍 Validating user:', email);

        const user = await this.usersService.findOneByEmail(email);
        console.log('👤 User found:', user ? 'Yes' : 'No');

        if (user) {
            console.log('👤 User role:', user.role, 'Active:', user.isActive);

            const isPasswordValid = await UserUtil.comparePassword(password, user.password);
            console.log('🔐 Password valid:', isPasswordValid);

            if (isPasswordValid) {
                // Loại bỏ password khỏi response
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...result } = user;
                console.log('✅ Authentication successful for:', email);
                return result as Omit<UserDocument, 'password'>;
            }
        }

        console.log('❌ Authentication failed for:', email);
        return null;
    }

    // Đăng ký user mới
    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        console.log('📝 Registering user:', registerDto.email);

        // Tạo user mới thông qua UsersService (sử dụng register method cho USER role)
        const createUserDto = {
            ...registerDto,
            phone: registerDto.phone || '',
            address: registerDto.address || ''
        };

        const newUser = await this.usersService.register(createUserDto);
        console.log('✅ User registered successfully:', newUser.data.email, 'Role:', newUser.data.role, 'Active:', newUser.data.isActive);

        // Register chỉ trả về thông tin user, không có token
        return {
            message: 'Đăng ký tài khoản thành công',
            user: {
                _id: String(newUser.data._id),
                email: newUser.data.email,
                name: newUser.data.name,
                phone: newUser.data.phone,
                address: newUser.data.address,
                role: newUser.data.role,
                isActive: newUser.data.isActive
            }
        };
    }

    // Đăng nhập
    login(user: Omit<UserDocument, 'password'>): AuthResponseDto {
        const payload = {
            email: user.email,
            sub: String(user._id),
            name: user.name,
            role: user.role,
            isActive: user.isActive
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: String(user._id),
                email: user.email,
                name: user.name,
                phone: user.phone || '',
                address: user.address || '',
                role: user.role,
                isActive: user.isActive
            }
        };
    }
}
