"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const util_1 = require("../users/helpers/util");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        console.log('🔍 Validating user:', email);
        const user = await this.usersService.findOneByEmail(email);
        console.log('👤 User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('👤 User role:', user.role, 'Active:', user.isActive);
            const isPasswordValid = await util_1.UserUtil.comparePassword(password, user.password);
            console.log('🔐 Password valid:', isPasswordValid);
            if (isPasswordValid) {
                const { password: _, ...result } = user;
                console.log('✅ Authentication successful for:', email);
                return result;
            }
        }
        console.log('❌ Authentication failed for:', email);
        return null;
    }
    async register(registerDto) {
        console.log('📝 Registering user:', registerDto.email);
        if (registerDto.password !== registerDto.passwordConfirm) {
            throw new common_1.BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
        }
        const { passwordConfirm, ...userDataWithoutConfirm } = registerDto;
        const createUserDto = {
            ...userDataWithoutConfirm,
            phone: registerDto.phone || '',
            address: registerDto.address || ''
        };
        const newUser = await this.usersService.register(createUserDto);
        console.log('✅ User registered successfully:', newUser.data.email, 'Role:', newUser.data.role, 'Active:', newUser.data.isActive);
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
    login(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map