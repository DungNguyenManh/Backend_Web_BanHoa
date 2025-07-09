export declare class RequestVerificationDto {
    email: string;
    action: 'change-password' | 'update-profile';
}
export declare class VerifyCodeDto {
    email: string;
    code: string;
}
export declare class ChangePasswordWithCodeDto {
    email: string;
    code: string;
    newPassword: string;
}
export declare class UpdateProfileWithCodeDto {
    email: string;
    code: string;
    name: string;
    phone?: string;
    address?: string;
}
