import { INestApplication } from "@nestjs/common";
import  redoc  from 'redoc-express';

export function setupRedoc(app: INestApplication) {
  const redocOptions = {
    title: "MindSnap API",
    version: "1.0.0",
    specUrl: "/api-json",
  };

  app.use("/docs", redoc(redocOptions));
}