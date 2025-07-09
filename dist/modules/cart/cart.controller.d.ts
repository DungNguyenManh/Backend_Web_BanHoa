import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    updateCartItem(userId: string, flowerId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    removeFromCart(userId: string, flowerId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    clearCart(userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
