import { Injectable } from '@nestjs/common';

import { ProductCreateDto, ProductDto, ProductReadDto, ProductsDto, ProductTimestampDto, ProductUpdateDto } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {

  public constructor(private readonly productRepository: ProductRepository) {}

  public async createProduct(params: ProductCreateDto): Promise<ProductDto> {
    const product = await this.productRepository.createProduct(params);

    return this.toProductDto(product);
  }

  public async readProducts(params: ProductReadDto): Promise<ProductsDto> {
    const products = await this.productRepository.readProducts(params);

    return {
      products: products.map(this.toProductDto),
    };
  }

  public async readProductById(productId: string): Promise<ProductDto> {
    const product = await this.productRepository.readProductById(productId);

    return this.toProductDto(product);
  }

  public async updateProductById(
    productId: string,
    updateProductDto: ProductUpdateDto,
  ): Promise<ProductDto> {
    const product = await this.productRepository.updateProductById(productId, updateProductDto);

    return this.toProductDto(product);
  }

  public async deleteProductById(productId: string): Promise<void> {
    await this.productRepository.deleteProductById(productId);
  }

  private toProductDto(product: ProductTimestampDto): ProductDto {
    const { id, name, description, category } = product;
    return { id, name, description, category };
  }

}
