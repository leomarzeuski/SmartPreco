import { FavoriteBaseRepository } from '@modules/favorite/favorite.base.repository';
import { Injectable } from '@nestjs/common';
import { EntityEnum } from '@shared/errors';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FavoriteMarketRepository extends FavoriteBaseRepository {

  protected tableName = EntityEnum.FAVORITE_MARKETS;
  protected columnName = 'market_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

}