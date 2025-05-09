import { clerkClient } from "@clerk/clerk-sdk-node";
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { MainTag } from "../../main.enum";
import { ContextEnum } from "../context/context.enum";
import { ContextService } from "../context/context.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {

  private readonly logger = new Logger(MainTag.CLERK_AUTH_GUARD);

  public constructor(private readonly contextService: ContextService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      this.logger.warn("No token found in Authorization header");
      throw new UnauthorizedException("No token provided");
    }

    try {
      const { sub: userId } = await clerkClient.verifyToken(token);

      const user = await clerkClient.users.getUser(userId);

      this.contextService.set(ContextEnum.USER, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        publicMetadata: user.publicMetadata,
        privateMetadata: user.privateMetadata,
      });

      return true;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error?.message ?? error}`);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private extractTokenFromRequest(request: any): string | undefined {
    const authorizationHeader = request.headers["authorization"];
    if (authorizationHeader?.startsWith("Bearer ")) {
      return authorizationHeader.split(" ")[1];
    }
  }

}
