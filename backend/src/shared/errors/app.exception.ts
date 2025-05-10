import { HttpException, HttpStatus, Logger } from '@nestjs/common';

import { MainTag } from '../../main.enum';
import { EntityEnum } from './entity.enum';
import { ErrorEnum } from './error.enum';

export class AppException extends HttpException {

  private readonly logger = new Logger(MainTag.EXCEPTION);

  public readonly error: ErrorEnum;

  public constructor(
    error: ErrorEnum,
    message: string,
    entity: EntityEnum,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code: error, message: `${message} (${entity ?? 'generic'})` }, status);
    this.error = error;

    this.logger.error(message);
  }
}