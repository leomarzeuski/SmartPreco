import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MainTag } from '../../main.enum';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MainTag.HTTP);

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request & { body: any }>();

    const method = request.method;
    const url = request.url;
    const params = request['params'];
    const query = request['query'];
    const body = request['body'];

    // eslint-disable-next-line max-len
    this.logger.verbose(`[${method}] ${url} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`);

    return next.handle();
  }
}