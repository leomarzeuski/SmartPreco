import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ProductModule } from './modules/product/product.module';
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    ProductModule,
  ],
  controllers: [],
})
export class AppModule {}
