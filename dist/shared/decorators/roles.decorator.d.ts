export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
