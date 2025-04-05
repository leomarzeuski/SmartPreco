import { Controller, Delete, Get, NotImplementedException, Param, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MarketIdDto, MarketsDto } from '../market/market.dto';
import { ProductIdDto, ProductsDto } from '../product/product.dto';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
@ApiTags('Favorite')
export class FavoriteController {

  public constructor(private readonly favoriteService: FavoriteService) { }

  @Get('products')
  @ApiOkResponse({ description: 'Favorite products retrieved successfully', type: ProductsDto })
  @ApiOperation({
    operationId: "Get Favorite Products",
    summary: "Get favorite products",
  })
  public getFavoriteProducts(): ProductsDto {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Post('products/:productId')
  @ApiNoContentResponse({ description: 'Product favorited successfully' })
  @ApiOperation({
    operationId: "Favorite Product",
    summary: "Favorite a product",
  })
  public postFavoriteProduct(@Param() param: ProductIdDto): void {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Delete('products/:productId')
  @ApiNoContentResponse({ description: 'Product unfavorited successfully' })
  @ApiOperation({
    operationId: "Unfavorite Product",
    summary: "Unfavorite a product",
  })
  public deleteFavoriteProduct(@Param() param: ProductIdDto): void {
    throw new NotImplementedException("Not implemented yet.");
  }
  @Get('markets')
  @ApiOkResponse({ description: 'Favorite markets retrieved successfully', type: MarketsDto })
  @ApiOperation({
    operationId: "Get Favorite Markets",
    summary: "Get favorite markets",
  })
  public getFavoriteMarkets(): MarketsDto {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Post('markets/:marketId')
  @ApiNoContentResponse({ description: 'Market favorited successfully' })
  @ApiOperation({
    operationId: "Favorite Market",
    summary: "Favorite a market",
  })
  public postFavoriteMarket(@Param() param: MarketIdDto): void {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Delete('markets/:marketId')
  @ApiNoContentResponse({ description: 'Market unfavorited successfully' })
  @ApiOperation({
    operationId: "Unfavorite Market",
    summary: "Unfavorite a market",
  })
  public deleteFavoriteMarket(@Param() param: MarketIdDto): void {
    throw new NotImplementedException("Not implemented yet.");
  }

}
