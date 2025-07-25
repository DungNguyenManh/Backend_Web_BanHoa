import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        flowerId: { type: Types.ObjectId, ref: 'Flower', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
      },
    ],
    required: true,
  })
  items: Array<{
    flowerId: Types.ObjectId;
    quantity: number;
    price: number;
    salePrice?: number;
  }>;

  @Prop({ required: true })
  total: number;

  @Prop({ type: String, unique: true, required: true })
  orderNumber: string;

  @Prop({ default: 'PENDING' })
  status: string;

  // BỔ SUNG CÁC TRƯỜNG DƯỚI ĐÂY
  @Prop() recipientName: string;
  @Prop() recipientPhone: string;
  @Prop() shippingAddress: string;
  @Prop() note: string;
  @Prop() paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
