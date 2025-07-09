import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { Flower, FlowerSchema } from './schemas/flower.schema';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flower.name, schema: FlowerSchema },
    ]),
    ConfigModule, // Để CloudinaryService sử dụng ConfigService
  ],
  controllers: [FlowersController],
  providers: [FlowersService, CloudinaryService],
  exports: [FlowersService],
})
export class FlowersModule { }
