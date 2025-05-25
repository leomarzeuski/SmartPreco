import { MarketCreateDto, MarketDto, MarketReadDto, MarketsDto, MarketTimestampDto, MarketUpdateDto } from '@modules/market/market.dto';
import { MarketRepository } from '@modules/market/market.repository';
import { Injectable } from '@nestjs/common';
import { DtoMapper } from '@shared/utils/dto-mapper';

@Injectable()
export class MarketService {

  public constructor(private readonly marketRepository: MarketRepository) {}

  public async createMarket(params: MarketCreateDto): Promise<MarketDto> {
    const { imageUrl, ...rest } = params;

    const market = await this.marketRepository.createMarket({ ...rest, image_url: imageUrl });

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketsDto> {
    const { records, total } = await this.marketRepository.readMarkets(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: DtoMapper.mapMany(records, this.toDto),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  public async readMarketById(marketId: string): Promise<MarketDto> {
    const market = await this.marketRepository.readMarketById(marketId);

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateDto): Promise<MarketDto> {
    const { imageUrl, ...rest } = dto;

    const market = await this.marketRepository.updateMarketById(marketId, { ...rest, image_url: imageUrl });

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    await this.marketRepository.deleteMarketById(marketId);
  }

  private toDto(market: MarketTimestampDto): MarketDto {
    const { id, name, address, city, state, image_url, created_at, updated_at } = market;
    return { id, name, address, city, state, imageUrl: image_url, updatedAt: updated_at };
  }

}