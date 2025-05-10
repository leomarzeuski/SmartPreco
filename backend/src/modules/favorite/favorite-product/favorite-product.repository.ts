import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { EntityEnum } from '../../../shared/errors';
import { FavoriteBaseRepository } from '../favorite.base.repository';


@Injectable()
export class FavoriteProductRepository extends FavoriteBaseRepository {

  protected tableName = EntityEnum.FAVORITE_PRODUCTS;
  protected columnName = 'product_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

}