import { Injectable } from '@nestjs/common';

import { MarketCreateDto, MarketDto, MarketReadDto, MarketsDto, MarketTimestampDto, MarketUpdateDto } from './market.dto';
import { MarketRepository } from './market.repository';

@Injectable()
export class MarketService {

  public constructor(private readonly marketRepository: MarketRepository) {}

  public async createMarket(params: MarketCreateDto): Promise<MarketDto> {
    const market = await this.marketRepository.createMarket(params);

    return this.toMarketDto(market);
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketsDto> {
    const markets = await this.marketRepository.readMarkets(params);

    return {
      markets: markets.map(this.toMarketDto),
    };
  }

  public async readMarketById(marketId: string): Promise<MarketDto> {
    const market = await this.marketRepository.readMarketById(marketId);

    return this.toMarketDto(market);
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateDto): Promise<MarketDto> {
    const market = await this.marketRepository.updateMarketById(marketId, dto);

    return this.toMarketDto(market);
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    await this.marketRepository.deleteMarketById(marketId);
  }

  private toMarketDto(market: MarketTimestampDto): MarketDto {
    const { id, name, address, city, state } = market;
    return { id, name, address, city, state };
  }
}