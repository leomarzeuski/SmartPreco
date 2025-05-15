import { MarketDto } from "@modules/market/market.dto";
import { PriceCreateRepositoryDto, PriceReadDto, PricesTimestampDto, PriceTimestampDto, PriceUpdateDto } from "@modules/price/price.dto";
import { ProductDto } from "@modules/product/product.dto";
import { Injectable } from "@nestjs/common";
import { AppException, EntityEnum, ErrorEnum } from "@shared/errors";
import { getSafeSearch } from "@shared/utils/get-safe-search";
import { SupabaseClient } from "@supabase/supabase-js";


@Injectable()
export class PriceRepository {

  private readonly tableName = EntityEnum.PRICES;

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
      .from(this.tableName)
      .insert(params)
      .select(this.selectFields)
      .single();

    if (error) throw new AppException(ErrorEnum.INSERT, error.message, this.tableName);

    return {
      ...data,
      market: data.market as unknown as MarketDto,
      product: data.product as unknown as ProductDto,
      imageUrl: data.image_url,
      userId: data.user_id,
      moderated: data.moderated,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

   public async readPrices(params: PriceReadDto): Promise<PricesTimestampDto> {
    const { search, limit = 20, offset = 0, orderBy, productId, marketId } = params;

    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        market:market_id (id, name, address, city, state),
        product:product_id (id, name, category, description)
      `, { count: 'exact' })
      .eq('moderated', true);

    if (marketId) query = query.eq('market_id', marketId);

    if (productId) query = query.eq('product_id', productId);

    if (search) {
      const safeSearch = getSafeSearch(search);

      query = query.ilike('product.name', `%${safeSearch}%`).or(`market.name.ilike.%${safeSearch}%`);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error) throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async readPriceById(priceId: string): Promise<PriceTimestampDto> {
    const { data, error } = await this.supabase
      .from('prices')
      .select(`
        *,
        market:market_id (id, name, address, city, state),
        product:product_id (id, name, category, description)
      `)
      .eq('id', priceId)
      .single();

    if (error) {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    return data;
  }

  public async updatePriceById(priceId: string, params: PriceUpdateDto): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(params)
      .eq('id', priceId);

    if (error) {
      throw new AppException(ErrorEnum.UPDATE, error.message, this.tableName);
    }
  }

  public async findModeratedPricesByProductId(productId: string): Promise<number[]> {
    const { data, error } = await this.supabase
      .from('prices')
      .select('price')
      .eq('moderated', true)
      .eq('product_id', productId);

    if (error) {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    return (data ?? []).map((item) => item.price);
  }

  public async findLowestModeratedPriceByProductId(productId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('price')
      .eq('moderated', true)
      .eq('product_id', productId)
      .order('price', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    return data?.price ?? null;
  }

  public async updateProductIds(oldProductIds: string[], newProductId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ product_id: newProductId })
      .in('product_id', oldProductIds);

    if (error) {
      throw new AppException(ErrorEnum.UPDATE, error.message, this.tableName);
    }
  }

}