import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
    passwordConfirm: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    address?: string;
}
