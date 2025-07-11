"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowerSchema = exports.Flower = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const category_schema_1 = require("../../categories/schemas/category.schema");
let Flower = class Flower {
    name;
    description;
    originalPrice;
    salePrice;
    category;
    imageUrl;
    gallery;
    isActive;
    isAvailable;
    weight;
    height;
    diameter;
    colors;
    occasion;
    careInstructions;
    rating;
    reviewCount;
    soldCount;
};
exports.Flower = Flower;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Flower.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Flower.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Flower.prototype, "originalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Flower.prototype, "salePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: category_schema_1.FlowerCategories
    }),
    __metadata("design:type", String)
], Flower.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Flower.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Flower.prototype, "gallery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Flower.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Flower.prototype, "isAvailable", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Flower.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Flower.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Flower.prototype, "diameter", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Flower.prototype, "colors", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Flower.prototype, "occasion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Flower.prototype, "careInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], Flower.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Flower.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Flower.prototype, "soldCount", void 0);
exports.Flower = Flower = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Flower);
exports.FlowerSchema = mongoose_1.SchemaFactory.createForClass(Flower);
//# sourceMappingURL=flower.schema.js.map