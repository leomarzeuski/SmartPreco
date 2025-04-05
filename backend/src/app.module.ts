import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { FavoriteModule } from './modules/favorite/favorite.module';
import { MarketModule } from './modules/market/market.module';
import { PriceModule } from './modules/price/price.module';
import { ProductModule } from './modules/product/product.module';
import { ReportModule } from './modules/report/report.module';
import { UploadModule } from './modules/upload/upload.module';
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    ProductModule,
    MarketModule,
    PriceModule,
    FavoriteModule,
    ReportModule,
    UploadModule,
  ],
  controllers: [],
})
export class AppModule {}
