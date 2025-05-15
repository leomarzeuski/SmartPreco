import { FavoriteModule } from '@modules/favorite/favorite.module';
import { PriceModule } from '@modules/price/price.module';
import { ProductController } from '@modules/product/product.controller';
import { ProductRepository } from '@modules/product/product.repository';
import { ProductService } from '@modules/product/product.service';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => PriceModule),
    forwardRef(() => FavoriteModule),
  ],
  controllers: [ ProductController ],
  providers: [ ProductService, ProductRepository ],
  exports: [ ProductService, ProductRepository ],
})
export class ProductModule {}