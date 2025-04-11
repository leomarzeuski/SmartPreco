import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  controllers: [ ProductController ],
  providers: [ ProductService, ProductRepository ],
  exports: [ ProductService, ProductRepository ],
})
export class ProductModule {}
