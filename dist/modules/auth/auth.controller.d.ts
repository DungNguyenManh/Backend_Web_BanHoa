import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserDocument } from '../users/schemas/user.schema';
interface RequestWithUser extends Request {
    user: Omit<UserDocument, 'password'>;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    login(req: RequestWithUser): AuthResponseDto;
}
export {};
