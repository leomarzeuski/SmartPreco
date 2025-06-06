  import { ProductCreateRepositoryDto, ProductReadDto, ProductsTimestampDto, ProductTimestampDto, ProductUpdateRepositoryDto } from "@modules/product/product.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException, EntityEnum, ErrorEnum } from "@shared/errors";
import { getSafeSearch } from "@shared/utils/get-safe-search";
import { SupabaseClient } from "@supabase/supabase-js";


@Injectable()
export class ProductRepository {

  private readonly tableName = EntityEnum.PRODUCTS;

  public constructor(private readonly supabase: SupabaseClient) {}

    public async createProduct(params: ProductCreateRepositoryDto): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(params)
      .select()
      .single();

      if (error) {
        throw new AppException(ErrorEnum.INSERT, error.message, this.tableName);
      }

      return data;
    }

    public async readProducts(params: ProductReadDto): Promise<ProductsTimestampDto> {
      const { search, limit = 20, offset = 0, orderBy } = params;

      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      if (search) {
        const safeSearch = getSafeSearch(search);

        query = query.or(`name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`);
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

    public async readProductById(productId: string): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName, HttpStatus.NOT_FOUND);
      }

      return data;
    }

    public async updateProductById(
      productId: string,
      updateProductDto: ProductUpdateRepositoryDto,
    ): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updateProductDto)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        throw new AppException(ErrorEnum.UPDATE, error.message, this.tableName);
      }

      return data;
    }

    public async deleteProductById(productId: string): Promise<void> {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', productId);

      if (error) {
        throw new AppException(ErrorEnum.DELETE, error.message, this.tableName);
      }
    }

    public async existsProductById(productId: string): Promise<boolean> {
      const { data } = await this.supabase
        .from(this.tableName)
        .select('id')
        .eq('id', productId)
        .maybeSingle();

      return !!data;
    }

    public async existAllProductsByIds(productIds: string[]): Promise<boolean> {
      const { data } = await this.supabase
        .from(this.tableName)
        .select('id')
        .in('id', productIds);

      if (!data) return false;

      return data.length === productIds.length;
    }

    public async deleteProductsByIds(productIds: string[]): Promise<void> {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .in('id', productIds);

      if (error) {
        throw new AppException(ErrorEnum.DELETE, error.message, this.tableName);
      }
    }

}