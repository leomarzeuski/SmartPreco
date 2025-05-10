import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { AppException } from '../errors/app.exception';
import { ErrorEnum } from '../errors/error.enum';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorEnum.UNKNOWN_ERROR;
    let message = 'an unexpected error occurred';

    if (exception instanceof AppException) {
      status = exception.getStatus();
      code = exception.error;
      message = (exception.getResponse() as any).message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      message = exceptionResponse?.message || exception.message || 'an error occurred';
      code = ErrorEnum.UNKNOWN_ERROR;
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      code,
      message,
    });
  }
}