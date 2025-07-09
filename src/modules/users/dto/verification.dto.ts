import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RequestVerificationDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Loại hành động không được để trống' })
    @IsString()
    action: 'change-password' | 'update-profile';
}

export class VerifyCodeDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
    @IsString()
    @Length(6, 6, { message: 'Mã xác thực phải có 6 ký tự' })
    code: string;
}

export class ChangePasswordWithCodeDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
    @IsString()
    @Length(6, 6, { message: 'Mã xác thực phải có 6 ký tự' })
    code: string;

    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    @IsString()
    newPassword: string;
}

export class UpdateProfileWithCodeDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
    @IsString()
    @Length(6, 6, { message: 'Mã xác thực phải có 6 ký tự' })
    code: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    phone?: string;
    address?: string;
}
