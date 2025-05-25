import { FavoriteProductService } from '@modules/favorite/favorite-product/favorite-product.service';
import { PriceService } from '@modules/price/price.service';
import { ProductCreateDto, ProductDto, ProductReadDto, ProductsDto, ProductsMergeDto, ProductTimestampDto, ProductUpdateDto } from '@modules/product/product.dto';
import { ProductRepository } from '@modules/product/product.repository';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {

  public constructor(
    private readonly productRepository: ProductRepository,
    private readonly priceService: PriceService,

    @Inject(forwardRef(() => FavoriteProductService))
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  public async createProduct(params: ProductCreateDto): Promise<ProductDto> {
    const { imageUrl, ...rest } = params;

    const product = await this.productRepository.createProduct({ ...rest, image_url: imageUrl });

    return this.toDto(product);
  }

  public async readProducts(params: ProductReadDto): Promise<ProductsDto> {
    const { records, total } = await this.productRepository.readProducts(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: await Promise.all(records.map(record => this.toDto(record))),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  public async readProductById(productId: string): Promise<ProductDto> {
    const product = await this.productRepository.readProductById(productId);

    return this.toDto(product);
  }

  public async updateProductById(
    productId: string,
    updateProductDto: ProductUpdateDto,
  ): Promise<ProductDto> {
    const { imageUrl, ...rest } = updateProductDto;

    const product = await this.productRepository.updateProductById(productId, { ...rest, image_url: imageUrl });

    return this.toDto(product);
  }

  public async deleteProductById(productId: string): Promise<void> {
    await this.productRepository.deleteProductById(productId);
  }

  public async mergeProducts(params: ProductsMergeDto): Promise<void> {
    const { targetProductId, productIds } = params;

    if (productIds.includes(targetProductId)) {
      throw new BadRequestException('Target product cannot be included in the list of products to merge.');
    }

    const targetExists = await this.productRepository.existsProductById(targetProductId);

    if (!targetExists) {
      throw new NotFoundException(`Target product ${targetProductId} does not exist.`);
    }

    // Confirma se todos os productIds existem
    const productsExist = await this.productRepository.existAllProductsByIds(productIds);

    if (!productsExist) {
      throw new NotFoundException('Some products to merge do not exist.');
    }

    // Atualizar references em price
    await this.priceService.updateProductIds(productIds, targetProductId);

    // Atualizar references em favorite_product
    await this.favoriteProductService.updateProductIds(productIds, targetProductId);

    // Deletar produtos antigos
    await this.productRepository.deleteProductsByIds(productIds);
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
