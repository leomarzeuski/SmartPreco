import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { MarketCreateDto, MarketReadDto, MarketTimestampDto, MarketUpdateDto } from "./market.dto";

@Injectable()
export class MarketRepository {

  public constructor(private readonly supabase: SupabaseClient) {}

  public async createMarket(params: MarketCreateDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .insert(params)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketTimestampDto[]> {
    let query = this.supabase.from('markets').select('*');

    if (params.city) {
      query = query.eq('city', params.city);
    }

    const { data, error } = await query;

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  public async readMarketById(marketId: string): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single();

    if (error) throw new NotFoundException(`Market with ID ${marketId} not found`);

    return data;
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .update(dto)
      .eq('id', marketId)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    const { error } = await this.supabase
      .from('markets')
      .delete()
      .eq('id', marketId);

    if (error) throw new BadRequestException(error.message);
  }
}