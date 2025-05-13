/* eslint-disable camelcase */
import { PriceCreateDto, PriceDto, PriceReadDto, PricesDto, PriceTimestampDto } from '@modules/price/price.dto';
import { PriceRepository } from '@modules/price/price.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContextEnum } from '@shared/context/context.enum';
import { ContextService } from '@shared/context/context.service';
import { EventEnum } from '@shared/events/event.enum';
import { DtoMapper } from '@shared/utils/dto-mapper';
@Injectable()
export class PriceService {
  public constructor(
    private readonly priceRepository: PriceRepository,
    private readonly contextService: ContextService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async createPrice(params: PriceCreateDto): Promise<PriceDto> {
    const { id } = this.contextService.get(ContextEnum.USER);

    const { marketId, productId, price, imageUrl } = params;

    const createdPrice = await this.priceRepository.createPrice({
      user_id: id,
      product_id: productId,
      market_id: marketId,
      image_url: imageUrl,
      price,
      moderated: true
    });

    this.eventEmitter.emit(EventEnum.PRICE_CREATED, createdPrice);

    return DtoMapper.mapOne(createdPrice, this.toDto);
  }

  public async readPrices(params: PriceReadDto): Promise<PricesDto> {
    const { records, total } = await this.priceRepository.readPrices(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: DtoMapper.mapMany(records, this.toDto),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  public async readPriceById(priceId: string): Promise<PriceDto> {
    const price = await this.priceRepository.readPriceById(priceId);

    return DtoMapper.mapOne(price, this.toDto);
  }

  public async calculateAverageModeratedPriceByProductId(productId: string): Promise<number> {
    const prices = await this.priceRepository.findModeratedPricesByProductId(productId);

    if (prices.length === 0) {
      return 0;
    }

    const total = prices.reduce((sum, price) => sum + price, 0);
    const average = total / prices.length;

    return average;
  }

  private toDto(params: PriceTimestampDto): PriceDto {
    const { id, market, product, price, imageUrl, userId, moderated, updated_at } = params;
    return { id, market, product, price, imageUrl, userId, moderated, updatedAt: updated_at };
  }

  public async updateModeratedFlag(priceId: string, moderated: boolean): Promise<void> {
    await this.priceRepository.updatePriceById(priceId, { moderated });
  }

  public async findLowestPriceByProductId(productId: string): Promise<number> {
    return this.priceRepository.findLowestModeratedPriceByProductId(productId);
  }

}