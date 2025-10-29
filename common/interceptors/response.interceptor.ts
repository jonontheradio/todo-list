import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseWrapperDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseWrapperDto<T>> {
    return next.handle().pipe(
      map(data => {

        if (data && data.message && data.result !== undefined) {
          return data;
        }

        return new ResponseWrapperDto('Success', data);
      }),
    );
  }
}