import { FavoriteProductRepository } from '@modules/favorite/favorite-product/favorite-product.repository';
import { FavoriteBaseService } from '@modules/favorite/favorite.base.service';
import { ProductDto } from '@modules/product/product.dto';
import { ProductService } from '@modules/product/product.service';
import { Injectable } from '@nestjs/common';
import { ContextService } from '@shared/context/context.service';

@Injectable()
export class FavoriteProductService extends FavoriteBaseService<ProductDto> {

  public constructor(
    contextService: ContextService,
    private readonly productService: ProductService,
    private readonly favoriteProductRepository: FavoriteProductRepository,
  ) {
    super(contextService);
  }

  protected findIdsByUser(userId: string): Promise<string[]> {
    return this.favoriteProductRepository.findIdsByUser(userId);
  }

  protected findManyByIds(ids: string[]): Promise<ProductDto[]> {
    return Promise.all(ids.map((id) => this.productService.readProductById(id)));
  }

  protected exists(userId: string, id: string): Promise<boolean> {
    return this.favoriteProductRepository.exists(userId, id);
  }

  protected insert(userId: string, id: string): Promise<void> {
    return this.favoriteProductRepository.insert(userId, id);
  }

  protected delete(userId: string, id: string): Promise<void> {
    return this.favoriteProductRepository.delete(userId, id);
  }

  public async findUserIdsByProductId(productId: string): Promise<string[]> {
    const favorites = await this.favoriteProductRepository.findFavoritesByProductId(productId);

    return favorites.map((fav) => fav.user_id);
  }

  public async updateProductIds(oldProductIds: string[], newProductId: string): Promise<void> {
    await this.favoriteProductRepository.updateProductIds(oldProductIds, newProductId);
  }

}