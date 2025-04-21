import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { AllExceptionsFilter } from "./all-exception.filter";
import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
  const logger = new Logger();


  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: [ "error", "warn", "debug" ],
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const options = new DocumentBuilder()
    .setTitle("SmartPreço API")
    .setDescription("SmartPreço API é uma API RESTful que fornece informações sobre mercados, produtos e seus preços.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  logger.debug("Starting application! 🚀");
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
