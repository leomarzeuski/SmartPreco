/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../shared/context/context.enum';
import { ContextService } from '../../shared/context/context.service';
import { PriceCreateDto, PriceDto, PriceReadDto, PricesDto, PriceTimestampDto } from './price.dto';
import { PriceRepository } from './price.repository';

@Injectable()
export class PriceService {
  public constructor(
    private readonly priceRepository: PriceRepository,
    private readonly contextService: ContextService,
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

    return this.toPriceDto(createdPrice);
  }

  public async readPrices(params: PriceReadDto): Promise<PricesDto> {
    const prices = await this.priceRepository.readPrices({ ...params, moderated: true });

    return {
      prices: prices.map(this.toPriceDto),
    };
  }

  private toPriceDto(params: PriceTimestampDto): PriceDto {
    const { id, market, product, price, imageUrl, userId, moderated } = params;
    return { id, market, product, price, imageUrl, userId, moderated };
  }

  public async updateModeratedFlag(priceId: string, moderated: boolean): Promise<void> {
    await this.priceRepository.updatePriceById(priceId, { moderated });
  }

}