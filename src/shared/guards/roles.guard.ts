import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, ROLES_KEY } from '../decorators/roles.decorator';

interface AuthenticatedUser {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
}

interface RequestWithUser {
    user: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Nếu endpoint không yêu cầu role cụ thể, cho phép truy cập
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest() as RequestWithUser;
        const user = request.user;

        // Nếu không có user (chưa login), từ chối
        if (!user) {
            return false;
        }

        // Kiểm tra role có match với required roles không
        const hasRequiredRole = requiredRoles.some((role) => user.role === role);

        if (!hasRequiredRole) {
            console.log(`❌ Quyền truy cập bị từ chối: Vai trò người dùng '${user.role}' không khớp với các vai trò yêu cầu: [${requiredRoles.join(', ')}]`);
            return false;
        }

        // Nếu là ADMIN endpoint, kiểm tra thêm isActive
        if (requiredRoles.includes(UserRole.ADMIN)) {
            if (!user.isActive) {
                console.log(`❌ Quyền truy cập bị từ chối: Tài khoản Admin không hoạt động cho người dùng: ${user.email}`);
                return false;
            }
        }

        console.log(`✅ Quyền truy cập được cấp: Người dùng '${user.email}' với vai trò '${user.role}' có thể truy cập endpoint`);
        return true;
    }
}
