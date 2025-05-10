import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ContextEnum } from "@shared/context/context.enum";
import { ContextService } from "@shared/context/context.service";

@Injectable()
export class AdminGuard implements CanActivate {
  public constructor(private readonly contextService: ContextService) {}

  public canActivate(_context: ExecutionContext): boolean {
    const user = this.contextService.get(ContextEnum.USER);

    if (!user?.privateMetadata?.isAdmin) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}