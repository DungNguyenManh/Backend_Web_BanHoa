import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

interface RequestWithUser extends Request {
    user: Omit<UserDocument, 'password'>;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
        return await this.authService.register(registerDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req: RequestWithUser): AuthResponseDto {
        // Note: LoginDto is validated by the guard, no need to use it here
        return this.authService.login(req.user);
    }
}
