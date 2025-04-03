import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

@Injectable()
export class ContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  public run(store: Map<string, any>, callback: () => void): void {
    this.asyncLocalStorage.run(store, callback);
  }

  public set(key: string, value: any): void {
    const store = this.asyncLocalStorage.getStore();

    if (store) {
      store.set(key, value);
    }
  }

  public get(key: string): any {
    const store = this.asyncLocalStorage.getStore();

    return store ? store.get(key) : null;
  }
}
