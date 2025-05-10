import { ProductController } from '@modules/product/product.controller';
import { ProductRepository } from '@modules/product/product.repository';
import { ProductService } from '@modules/product/product.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ ProductController ],
  providers: [ ProductService, ProductRepository ],
  exports: [ ProductService, ProductRepository ],
})
export class ProductModule {}
