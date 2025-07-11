import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, registerDecorator, ValidationOptions } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { isValidCategory, getAllCategories } from '../../categories/schemas/category.schema';

// Custom validator cho category dạng string
function IsFlowerCategory(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isFlowerCategory',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return typeof value === 'string' && isValidCategory(value);
                },
                defaultMessage() {
                    return `Danh mục phải là một trong các giá trị: ${getAllCategories().join(', ')}`;
                }
            }
        });
    };
}

export class CreateFlowerDto {

    @IsNotEmpty({ message: 'Tên hoa không được để trống' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : String(value))
    @IsString({ message: 'name must be a string' })
    name: string;


    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : String(value))
    @IsString({ message: 'description must be a string' })
    description: string;

    @IsNotEmpty({ message: 'Giá gốc không được để trống' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Giá gốc phải là số' })
    @Min(0, { message: 'Giá gốc phải lớn hơn hoặc bằng 0' })
    originalPrice: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Giá khuyến mãi phải là số' })
    @Min(0, { message: 'Giá khuyến mãi phải lớn hơn hoặc bằng 0' })
    salePrice?: number;


    @IsNotEmpty({ message: 'Danh mục không được để trống' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : String(value))
    @IsString({ message: 'category must be a string' })
    @IsFlowerCategory()
    category: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : (value as string[]))
    @IsArray()
    @IsString({ each: true })
    gallery?: string[];

    @IsNotEmpty({ message: 'Số lượng tồn kho không được để trống' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
    @Min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' })
    stock: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isAvailable?: boolean;


    @IsOptional()
    @IsString()
    occasion?: string;

    @IsOptional()
    @IsString()
    careInstructions?: string;
}
