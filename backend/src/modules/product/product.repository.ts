import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { ProductCreateDto, ProductReadDto, ProductTimestampDto, ProductUpdateDto } from "./product.dto";

@Injectable()
export class ProductRepository {

  public constructor(private readonly supabase: SupabaseClient) {}

    public async createProduct(params: ProductCreateDto): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
      .from('products')
      .insert(params)
      .select()
      .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    public async readProducts(params: ProductReadDto): Promise<ProductTimestampDto[]> {
      let query = this.supabase.from('products').select('*');

      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    public async readProductById(productId: string): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      return data;
    }

    public async updateProductById(
      productId: string,
      updateProductDto: ProductUpdateDto,
    ): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from('products')
        .update(updateProductDto)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    public async deleteProductById(productId: string): Promise<void> {
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw new BadRequestException(error.message);
      }
    }

}