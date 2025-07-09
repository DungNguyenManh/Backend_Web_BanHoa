import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    // @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;
}
