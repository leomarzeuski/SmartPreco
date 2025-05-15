import { FavoriteBaseRepository } from '@modules/favorite/favorite.base.repository';
import { Injectable } from '@nestjs/common';
import { AppException, EntityEnum, ErrorEnum } from '@shared/errors';
import { SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class FavoriteProductRepository extends FavoriteBaseRepository {

  protected tableName = EntityEnum.FAVORITE_PRODUCTS;
  protected columnName = 'product_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  public async findFavoritesByProductId(productId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('favorite_products')
      .select('user_id')
      .eq('product_id', productId);

    if (error) {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    return data;
  }

  public async updateProductIds(oldProductIds: string[], newProductId: string): Promise<void> {
    // 1. Buscar todos os favoritos dos oldProductIds
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('user_id, product_id')
      .in('product_id', oldProductIds);

    if (error) {
      throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
    }

    if (!data?.length) {
      return; // Não tem o que atualizar
    }

    // 2. Buscar quem já favoritou o targetProductId
    const { data: targetFavorites, error: targetError } = await this.supabase
      .from(this.tableName)
      .select('user_id')
      .eq('product_id', newProductId);

    if (targetError) {
      throw new AppException(ErrorEnum.NOT_FOUND, targetError.message, this.tableName);
    }

    const targetUserIds = new Set((targetFavorites ?? []).map(f => f.user_id));

    // 3. Deletar duplicados: aqueles que já favoritaram o targetProductId
    const duplicatedUserIds = data
      .filter(fav => targetUserIds.has(fav.user_id))
      .map(fav => fav.user_id);

    if (duplicatedUserIds.length > 0) {
      const { error: deleteError } = await this.supabase
        .from(this.tableName)
        .delete()
        .in('user_id', duplicatedUserIds)
        .in('product_id', oldProductIds);

      if (deleteError) {
        throw new AppException(ErrorEnum.DELETE, deleteError.message, this.tableName);
      }
    }

    // 4. Atualizar o restante
    const { error: updateError } = await this.supabase
      .from(this.tableName)
      .update({ product_id: newProductId })
      .in('product_id', oldProductIds);

    if (updateError) {
      throw new AppException(ErrorEnum.UPDATE, updateError.message, this.tableName);
    }
  }
}