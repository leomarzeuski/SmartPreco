import { Module } from '@nestjs/common';

import { PriceController } from './price.controller';
import { PriceListener } from './price.listener';
import { PriceRepository } from './price.repository';
import { PriceService } from './price.service';

@Module({
  controllers: [ PriceController ],
  providers: [ PriceService, PriceRepository, PriceListener ],
  exports: [ PriceService, PriceRepository ],
})
export class PriceModule {}
