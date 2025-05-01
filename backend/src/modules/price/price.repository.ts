import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { MarketDto } from "../market/market.dto";
import { ProductDto } from "../product/product.dto";
import { PriceCreateRepositoryDto, PriceReadRepositoryDto, PriceTimestampDto, PriceUpdateDto } from "./price.dto";

@Injectable()
export class PriceRepository {
  private readonly selectFields = `
    id,
    price,
    user_id,
    image_url,
    moderated,
    created_at,
    updated_at,
    market:markets(*),
    product:products(*)
  `;

  public constructor(private readonly supabase: SupabaseClient) {}

  public async createPrice(params: PriceCreateRepositoryDto): Promise<PriceTimestampDto> {
    const { data, error } = await this.supabase
      .from('prices')
      .insert(params)
      .select(this.selectFields)
      .single();

    if (error) throw new BadRequestException(error.message);

    return {
      ...data,
      market: data.market as unknown as MarketDto,
      product: data.product as unknown as ProductDto,
      imageUrl: data.image_url,
      userId: data.user_id,
      moderated: data.moderated,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public async readPrices(params: PriceReadRepositoryDto): Promise<PriceTimestampDto[]> {
    const { moderated, marketId, productId } = params;

    let query = this.supabase.from('prices').select(this.selectFields).eq('moderated', moderated);

    if (marketId) query = query.eq('market_id', marketId);
    if (productId) query = query.eq('product_id', productId);

    const { data, error } = await query;

    if (error) throw new BadRequestException(error.message);

    return data.map((item) => ({
      ...item,
      market: item.market as unknown as MarketDto,
      product: item.product as unknown as ProductDto,
      imageUrl: item.image_url,
      userId: item.user_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      moderated: item.moderated
    }));
  }

  public async updatePriceById(priceId: string, params: PriceUpdateDto): Promise<PriceTimestampDto> {
    const { data, error } = await this.supabase
      .from('prices')
      .update(params)
      .eq('id', priceId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

}