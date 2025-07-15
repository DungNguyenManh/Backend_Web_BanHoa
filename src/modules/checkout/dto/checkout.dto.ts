import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
    @ApiPropertyOptional({ description: 'Họ tên người nhận' })
    @IsOptional()
    @IsString()
    recipientName?: string;

    @ApiPropertyOptional({ description: 'Số điện thoại người nhận' })
    @IsOptional()
    @IsString()
    recipientPhone?: string;

    @ApiPropertyOptional({ description: 'Địa chỉ giao hàng' })
    @IsOptional()
    @IsString()
    shippingAddress?: string;

    @ApiPropertyOptional({ description: 'Ghi chú' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
    @IsOptional()
    @IsString()
    paymentMethod?: string;
}
