import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {
    @IsOptional()
    @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
    status?: OrderStatus;

    @IsOptional()
    @IsEnum(PaymentStatus, { message: 'Trạng thái thanh toán không hợp lệ' })
    paymentStatus?: PaymentStatus;

    @IsOptional()
    @IsString()
    adminNote?: string;

    @IsOptional()
    @IsString()
    cancelReason?: string;
}
