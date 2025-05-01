import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { ContextEnum } from "../context/context.enum";
import { ContextService } from "../context/context.service";

@Injectable()
export class AdminGuard implements CanActivate {
  public constructor(private readonly contextService: ContextService) {}

  public canActivate(_context: ExecutionContext): boolean {
    const user = this.contextService.get(ContextEnum.USER);

    if (!user?.publicMetadata?.isAdmin) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}