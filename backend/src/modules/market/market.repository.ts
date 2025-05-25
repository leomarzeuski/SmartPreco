import { MarketCreateRepositoryDto, MarketReadDto, MarketsTimestampDto, MarketTimestampDto, MarketUpdateDto, MarketUpdateRepositoryDto } from "@modules/market/market.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException, EntityEnum, ErrorEnum } from "@shared/errors";
import { getSafeSearch } from "@shared/utils/get-safe-search";
import { SupabaseClient } from "@supabase/supabase-js";


@Injectable()
export class MarketRepository {

  private readonly tableName = EntityEnum.MARKETS;

  public constructor(private readonly supabase: SupabaseClient) {}

  public async createMarket(params: MarketCreateRepositoryDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(params)
      .select()
      .single();

    if (error) throw new AppException(ErrorEnum.INSERT, error.message, this.tableName);

    return data;
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketsTimestampDto> {
    const { search, limit = 20, offset = 0, orderBy } = params;

    let query = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' });

    if (search) {
      const safeSearch = getSafeSearch(search);

      query = query.or(`name.ilike.%${safeSearch}%,address.ilike.%${safeSearch}%`);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error) {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async readMarketById(marketId: string): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', marketId)
      .single();

    if (error) throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName, HttpStatus.NOT_FOUND);

    return data;
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateRepositoryDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(dto)
      .eq('id', marketId)
      .select()
      .single();

    if (error) throw new AppException(ErrorEnum.UPDATE, error.message, this.tableName);

    return data;
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', marketId);

    if (error) throw new AppException(ErrorEnum.DELETE, error.message, this.tableName);
  }
}