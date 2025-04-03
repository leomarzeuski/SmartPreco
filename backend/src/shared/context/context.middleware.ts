import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { ContextService } from "./context.service";

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  public constructor(private readonly contextService: ContextService) { }

  public use(req: Request, res: Response, next: NextFunction): void {
    const store = new Map<string, any>();

    this.contextService.run(store, () => {
      next();
    });
  }
}