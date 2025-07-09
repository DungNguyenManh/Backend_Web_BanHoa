import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsOptional()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    address?: string;
}