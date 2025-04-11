import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { MarketDto } from "../market/market.dto";
import { ProductDto } from "../product/product.dto";
import { PriceCreateRepositoryDto, PriceReadDto, PriceTimestampDto } from "./price.dto";

@Injectable()
export class PriceRepository {
  private readonly selectFields = `
    id,
    price,
    user_id,
    image_url,
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
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public async readPrices(params: PriceReadDto): Promise<PriceTimestampDto[]> {
    let query = this.supabase.from('prices').select(this.selectFields);

    if (params.marketId) query = query.eq('market_id', params.marketId);
    if (params.productId) query = query.eq('product_id', params.productId);

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
    }));
  }
}