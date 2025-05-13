import { PriceService } from '@modules/price/price.service';
import { ProductCreateDto, ProductDto, ProductReadDto, ProductsDto, ProductTimestampDto, ProductUpdateDto } from '@modules/product/product.dto';
import { ProductRepository } from '@modules/product/product.repository';
import { Injectable } from '@nestjs/common';
import { DtoMapper } from '@shared/utils/dto-mapper';

@Injectable()
export class ProductService {

  public constructor(
    private readonly productRepository: ProductRepository,
    private readonly priceService: PriceService,
  ) {}

  public async createProduct(params: ProductCreateDto): Promise<ProductDto> {
    const product = await this.productRepository.createProduct(params);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async readProducts(params: ProductReadDto): Promise<ProductsDto> {
    const { records, total } = await this.productRepository.readProducts(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: await Promise.all(DtoMapper.mapMany(records, this.toDto)),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  public async readProductById(productId: string): Promise<ProductDto> {
    const product = await this.productRepository.readProductById(productId);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async updateProductById(
    productId: string,
    updateProductDto: ProductUpdateDto,
  ): Promise<ProductDto> {
    const product = await this.productRepository.updateProductById(productId, updateProductDto);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async deleteProductById(productId: string): Promise<void> {
    await this.productRepository.deleteProductById(productId);
  }

  private async toDto(product: ProductTimestampDto): Promise<ProductDto> {
    const { id, name, description, category, image_url, updated_at } = product;

    const lowestPrice = await this.priceService.findLowestPriceByProductId(id);

    return {
      id,
      name,
      description,
      category,
      imageUrl: image_url,
      updatedAt: updated_at,
      lowestPrice,
    };
  }

}
