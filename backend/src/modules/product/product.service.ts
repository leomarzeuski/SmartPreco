import { Injectable } from '@nestjs/common';

import { ProductCreateDto, ProductDto, ProductReadDto, ProductsDto, ProductUpdateDto } from './product.dto';

@Injectable()
export class ProductService {

  public createProduct(params: ProductCreateDto): ProductDto {
    return null;
  }

  public readProducts(params: ProductReadDto): ProductsDto {
    return null;
  }

  public readProductById(productId: string): ProductDto {
    return null;
  }

  public updateProductById(productId: string, updateProductDto: ProductUpdateDto): ProductDto {
    return null;
  }

}
