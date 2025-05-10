import { FavoriteMarketIdDto } from "@modules/favorite/favorite-market/favorite-market.dto";
import { FavoriteMarketService } from "@modules/favorite/favorite-market/favorite-market.service";
import { MarketDto } from "@modules/market/market.dto";
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UseUser } from "@shared/guards/use-user.decorator";


@Controller('favorites/markets')
@ApiTags('Favorite - Market')
@UseUser()
export class FavoriteMarketController {
  public constructor(
    private readonly favoriteMarketService: FavoriteMarketService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Favorite markets retrieved successfully',
    type: MarketDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Get Favorite Markets',
    summary: 'Retrieves favorite markets for the user',
  })
  public getFavoriteMarkets(): Promise<MarketDto[]> {
    return this.favoriteMarketService.getFavorites();
  }

  @Post(':marketId')
  @ApiNoContentResponse({ description: 'Market favorited successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'Favorite Market',
    summary: 'Favorites a market',
  })
  public favoriteMarket(
    @Param() param: FavoriteMarketIdDto,
  ): Promise<void> {
    return this.favoriteMarketService.favorite(param.marketId);
  }

  @Delete(':marketId')
  @ApiNoContentResponse({ description: 'Market unfavorited successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'Unfavorite Market',
    summary: 'Removes a market from the user\'s favorites',
  })
  public unfavoriteMarket(
    @Param() param: FavoriteMarketIdDto,
  ): Promise<void> {
    return this.favoriteMarketService.unfavorite(param.marketId);
  }
}