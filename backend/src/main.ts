import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule } from "@nestjs/swagger";
import { createSwaggerConfig } from "@shared/config/swagger.config";
import { createGlobalValidationPipe } from "@shared/config/validation.config";
import { AllExceptionFilter } from "@shared/filters/all-exception.filter";
import { LoggerInterceptor } from "@shared/interceptors/logger.interceptor";
import { AppModule } from "app.module";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { MainTag } from "main.enum";

dotenv.config();

async function bootstrap() {

  const logger = new Logger(MainTag.MAIN);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: [ "error", "warn", "debug", "verbose" ],
  });

  app.enableCors();

  app.use(cookieParser());
  app.useGlobalPipes(createGlobalValidationPipe());

  app.useGlobalInterceptors(new LoggerInterceptor());

  const document = SwaggerModule.createDocument(app, createSwaggerConfig());
  SwaggerModule.setup("api", app, document);

  app.useGlobalFilters(new AllExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.debug(`Application is running on port ${port}! 🚀`);

}

bootstrap();
