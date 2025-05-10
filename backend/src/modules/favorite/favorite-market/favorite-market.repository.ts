import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { EntityEnum } from '../../../shared/errors';
import { FavoriteBaseRepository } from '../favorite.base.repository';

@Injectable()
export class FavoriteMarketRepository extends FavoriteBaseRepository {

  protected tableName = EntityEnum.FAVORITE_MARKETS;
  protected columnName = 'market_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

}