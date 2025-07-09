import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Số lượng phải là số' })
    @Min(1, { message: 'Số lượng phải ít nhất là 1' })
    quantity?: number;
}
