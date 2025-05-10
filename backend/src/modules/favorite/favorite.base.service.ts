import { FavoriteStrategy } from "@modules/favorite/favorite.strategy";
import { ContextEnum } from "@shared/context/context.enum";
import { ContextService } from "@shared/context/context.service";

export abstract class FavoriteBaseService<T> implements FavoriteStrategy<T> {
  public constructor(
    protected readonly contextService: ContextService,
  ) {}

  protected getUserId(): string {
    return this.contextService.get(ContextEnum.USER)?.id;
  }

  protected abstract findIdsByUser(userId: string): Promise<string[]>;

  protected abstract findManyByIds(ids: string[]): Promise<T[]>;

  protected abstract exists(userId: string, id: string): Promise<boolean>;

  protected abstract insert(userId: string, id: string): Promise<void>;

  protected abstract delete(userId: string, id: string): Promise<void>;

  public async getFavorites(): Promise<T[]> {
    const userId = this.getUserId();

    const ids = await this.findIdsByUser(userId);

    return this.findManyByIds(ids);
  }

  public async favorite(id: string): Promise<void> {
    const userId = this.getUserId();

    const alreadyExists = await this.exists(userId, id);

    if (!alreadyExists) await this.insert(userId, id);
  }

  public async unfavorite(id: string): Promise<void> {
    const userId = this.getUserId();

    await this.delete(userId, id);
  }
}