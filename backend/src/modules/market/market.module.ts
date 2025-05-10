import { MarketController } from '@modules/market/market.controller';
import { MarketRepository } from '@modules/market/market.repository';
import { MarketService } from '@modules/market/market.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ MarketController ],
  providers: [ MarketService, MarketRepository ],
  exports: [ MarketService, MarketRepository ],
})
export class MarketModule {}
