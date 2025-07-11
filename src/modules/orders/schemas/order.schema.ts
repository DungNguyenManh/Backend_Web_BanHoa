import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

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

  @Prop({ default: 'PENDING' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
