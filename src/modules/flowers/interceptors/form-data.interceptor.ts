import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body) {
      // Chuyển đổi các string số thành number
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
}
