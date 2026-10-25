import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseStructure<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ResponseStructure<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseStructure<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((resData) => {
        // If response is already formatted with data and meta
        if (resData && typeof resData === 'object' && 'data' in resData) {
          return {
            success: true,
            statusCode,
            data: resData.data,
            meta: resData.meta || undefined,
            message: resData.message || undefined,
          };
        }

        return {
          success: true,
          statusCode,
          data: resData,
        };
      }),
    );
  }
}
