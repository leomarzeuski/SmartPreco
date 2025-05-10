import { FavoriteProductIdDto } from "@modules/favorite/favorite-product/favorite-product.dto";
import { FavoriteProductService } from "@modules/favorite/favorite-product/favorite-product.service";
import { ProductDto } from "@modules/product/product.dto";
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UseUser } from "@shared/guards/use-user.decorator";

@Controller('favorites/products')
@ApiTags('Favorite - Product')
@UseUser()
export class FavoriteProductController {
  public constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Favorite products retrieved successfully',
    type: ProductDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Get Favorite Products',
    summary: 'Retrieves favorite products for the user',
  })
  public getFavoriteProducts(): Promise<ProductDto[]> {
    return this.favoriteProductService.getFavorites();
  }

  @Post(':productId')
  @ApiNoContentResponse({ description: 'Product favorited successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'Favorite Product',
    summary: 'Favorites a product',
  })
  public favoriteProduct(
    @Param() param: FavoriteProductIdDto,
  ): Promise<void> {
    return this.favoriteProductService.favorite(param.productId);
  }

  @Delete(':productId')
  @ApiNoContentResponse({ description: 'Product unfavorited successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'Unfavorite Product',
    summary: 'Removes a product from the user\'s favorites',
  })
  public unfavoriteProduct(
    @Param() param: FavoriteProductIdDto,
  ): Promise<void> {
    return this.favoriteProductService.unfavorite(param.productId);
  }
}