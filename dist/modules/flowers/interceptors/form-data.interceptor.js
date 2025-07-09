"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataInterceptor = void 0;
const common_1 = require("@nestjs/common");
let FormDataInterceptor = class FormDataInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.body) {
            const numericFields = ['originalPrice', 'salePrice', 'stock', 'weight', 'height', 'diameter'];
            const booleanFields = ['isActive', 'isAvailable'];
            const arrayFields = ['colors', 'gallery'];
            numericFields.forEach(field => {
                if (request.body[field] !== undefined) {
                    const value = request.body[field];
                    if (typeof value === 'string' && value.trim() !== '') {
                        request.body[field] = Number(value);
                    }
                }
            });
            booleanFields.forEach(field => {
                if (request.body[field] !== undefined) {
                    const value = request.body[field];
                    if (typeof value === 'string') {
                        request.body[field] = value === 'true';
                    }
                }
            });
            arrayFields.forEach(field => {
                if (request.body[field] !== undefined) {
                    const value = request.body[field];
                    if (typeof value === 'string') {
                        request.body[field] = value.split(',').map(item => item.trim()).filter(item => item !== '');
                    }
                }
            });
        }
        return next.handle();
    }
};
exports.FormDataInterceptor = FormDataInterceptor;
exports.FormDataInterceptor = FormDataInterceptor = __decorate([
    (0, common_1.Injectable)()
], FormDataInterceptor);
//# sourceMappingURL=form-data.interceptor.js.map