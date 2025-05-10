import { FavoriteMarketController } from '@modules/favorite/favorite-market/favorite-market.controller';
import { FavoriteMarketRepository } from '@modules/favorite/favorite-market/favorite-market.repository';
import { FavoriteMarketService } from '@modules/favorite/favorite-market/favorite-market.service';
import { FavoriteProductController } from '@modules/favorite/favorite-product/favorite-product.controller';
import { FavoriteProductRepository } from '@modules/favorite/favorite-product/favorite-product.repository';
import { FavoriteProductService } from '@modules/favorite/favorite-product/favorite-product.service';
import { FavoriteStrategyToken } from '@modules/favorite/favorite.strategy';
import { MarketModule } from '@modules/market/market.module';
import { ProductModule } from '@modules/product/product.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ProductModule,
    MarketModule,
  ],
  controllers: [
    FavoriteProductController,
    FavoriteMarketController,
  ],
  providers: [
    FavoriteProductRepository,
    FavoriteProductService,
    {
      provide: FavoriteStrategyToken.PRODUCT,
      useClass: FavoriteProductService,
    },
    FavoriteMarketRepository,
    FavoriteMarketService,
    {
      provide: FavoriteStrategyToken.MARKET,
      useClass: FavoriteMarketService,
    },
  ],
  exports: [
    FavoriteProductRepository,
    FavoriteProductService,
    FavoriteMarketRepository,
    FavoriteMarketService,
  ],
})
export class FavoriteModule {}