import { Module } from '@nestjs/common';

import { SharedModule } from '../..//shared/shared.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [ SharedModule ],
  controllers: [ ProductController ],
  providers: [ ProductService, ProductRepository ],
  exports: [ ProductService, ProductRepository ],
})
export class ProductModule {}
