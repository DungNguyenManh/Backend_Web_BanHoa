import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
    @IsNotEmpty({ message: 'ID hoa không được để trống' })
    @IsString()
    flowerId: string;

    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Số lượng phải là số' })
    @Min(1, { message: 'Số lượng phải ít nhất là 1' })
    quantity: number;
}
