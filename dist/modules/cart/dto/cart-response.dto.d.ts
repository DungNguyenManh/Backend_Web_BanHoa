export declare class CartItemResponseDto {
    flowerId: string;
    flowerName: string;
    flowerImage?: string;
    quantity: number;
    price: number;
    salePrice?: number;
    totalPrice: number;
}
export declare class CartResponseDto {
    userId: string;
    items: CartItemResponseDto[];
    totalAmount: number;
    totalItems: number;
    createdAt: Date;
    updatedAt: Date;
}
