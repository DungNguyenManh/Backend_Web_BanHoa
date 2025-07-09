"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const flowers_service_1 = require("./flowers.service");
const flowers_controller_1 = require("./flowers.controller");
const flower_schema_1 = require("./schemas/flower.schema");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const config_1 = require("@nestjs/config");
let FlowersModule = class FlowersModule {
};
exports.FlowersModule = FlowersModule;
exports.FlowersModule = FlowersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: flower_schema_1.Flower.name, schema: flower_schema_1.FlowerSchema },
            ]),
            config_1.ConfigModule,
        ],
        controllers: [flowers_controller_1.FlowersController],
        providers: [flowers_service_1.FlowersService, cloudinary_service_1.CloudinaryService],
        exports: [flowers_service_1.FlowersService],
    })
], FlowersModule);
//# sourceMappingURL=flowers.module.js.map