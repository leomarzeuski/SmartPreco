import { BenefitModule } from "@modules/benefit/benefit.module";
import { FavoriteModule } from "@modules/favorite/favorite.module";
import { MarketModule } from "@modules/market/market.module";
import { NotificationModule } from "@modules/notification/notification.module";
import { PriceModule } from "@modules/price/price.module";
import { ProductModule } from "@modules/product/product.module";
import { ReportModule } from "@modules/report/report.module";
import { UploadModule } from "@modules/upload/upload.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ClerkModule } from "@shared/clerk/clerk.module";
import { SharedModule } from "@shared/shared.module";
import { SupabaseModule } from "@shared/supabase/supabase.module";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "docs"),
      serveRoot: "/docs",
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule.forRoot(),
    EventEmitterModule.forRoot(),
    SharedModule,
    BenefitModule,
    ProductModule,
    MarketModule,
    PriceModule,
    FavoriteModule,
    ReportModule,
    UploadModule,
    ClerkModule,
    NotificationModule,
  ],
  controllers: [],
})
export class AppModule {}
