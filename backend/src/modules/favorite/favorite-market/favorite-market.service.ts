import { FavoriteMarketRepository } from '@modules/favorite/favorite-market/favorite-market.repository';
import { FavoriteBaseService } from '@modules/favorite/favorite.base.service';
import { MarketDto } from '@modules/market/market.dto';
import { MarketService } from '@modules/market/market.service';
import { Injectable } from '@nestjs/common';
import { ContextService } from '@shared/context/context.service';

@Injectable()
export class FavoriteMarketService extends FavoriteBaseService<MarketDto> {

  public constructor(
    contextService: ContextService,
    private readonly marketService: MarketService,
    private readonly favoriteMarketRepository: FavoriteMarketRepository,
  ) {
    super(contextService);
  }

  protected findIdsByUser(userId: string): Promise<string[]> {
    return this.favoriteMarketRepository.findIdsByUser(userId);
  }

  protected findManyByIds(ids: string[]): Promise<MarketDto[]> {
    return Promise.all(ids.map((id) => this.marketService.readMarketById(id)));
  }

  protected exists(userId: string, id: string): Promise<boolean> {
    return this.favoriteMarketRepository.exists(userId, id);
  }

  protected insert(userId: string, id: string): Promise<void> {
    return this.favoriteMarketRepository.insert(userId, id);
  }

  protected delete(userId: string, id: string): Promise<void> {
    return this.favoriteMarketRepository.delete(userId, id);
  }

}