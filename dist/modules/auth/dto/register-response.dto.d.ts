export interface RegisterResponseDto {
    success: boolean;
    message: string;
    user: {
        _id: string;
        email: string;
        name: string;
        phone?: string;
        address?: string;
        role: string;
        isActive: boolean;
    };
}
