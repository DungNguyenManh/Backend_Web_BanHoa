import { UserRole } from '../../../shared/decorators/roles.decorator';
export declare class RegisterResponseDto {
    message: string;
    user: {
        _id: string;
        email: string;
        name: string;
        phone?: string;
        address?: string;
        role: UserRole;
        isActive: boolean;
    };
}
