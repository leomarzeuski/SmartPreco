import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
