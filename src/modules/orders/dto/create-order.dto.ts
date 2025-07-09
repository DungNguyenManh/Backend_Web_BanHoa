import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../schemas/order.schema';

export class CreateShippingAddressDto {
    @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
    @IsString()
    fullName: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsString()
    phone: string;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    ward?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class CreateOrderDto {
    @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
    @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
    paymentMethod: PaymentMethod;

    @ValidateNested()
    @Type(() => CreateShippingAddressDto)
    shippingAddress: CreateShippingAddressDto;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Phí vận chuyển phải là số' })
    @Min(0, { message: 'Phí vận chuyển phải lớn hơn hoặc bằng 0' })
    shippingFee?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Giảm giá phải là số' })
    @Min(0, { message: 'Giảm giá phải lớn hơn hoặc bằng 0' })
    discount?: number;

    @IsOptional()
    @IsString()
    note?: string;
}
