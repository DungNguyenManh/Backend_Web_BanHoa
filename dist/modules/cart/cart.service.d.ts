import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { FlowerDocument } from '../flowers/schemas/flower.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private cartModel;
    private flowerModel;
    constructor(cartModel: Model<CartDocument>, flowerModel: Model<FlowerDocument>);
    getCart(userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, CartDocument, {}> & Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, CartDocument, {}> & Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    updateCartItem(userId: string, flowerId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, CartDocument, {}> & Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    removeFromCart(userId: string, flowerId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, CartDocument, {}> & Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    clearCart(userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, CartDocument, {}> & Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
