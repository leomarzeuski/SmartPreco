import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { ContextMiddleware } from "./context.middleware";
import { ContextService } from "./context.service";

@Module({
  providers: [
    ContextService
  ],
  exports: [
    ContextService
  ],
})
export class ContextModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}