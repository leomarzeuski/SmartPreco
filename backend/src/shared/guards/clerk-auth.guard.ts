import { clerkClient } from "@clerk/clerk-sdk-node";
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { ContextEnum } from "../context/context.enum";
import { ContextService } from "../context/context.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  public constructor(private readonly contextService: ContextService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException("No token found");
    }

    try {
      const verifiedToken = await clerkClient.verifyToken(token);

      const userId = verifiedToken.sub;

      const user = await clerkClient.users.getUser(userId);

      this.contextService.set(ContextEnum.USER, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        publicMetadata: user.publicMetadata,
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token: " + error.message);
    }
  }

  private extractTokenFromRequest(request: any): string | undefined {
    const authorizationHeader = request.headers["authorization"];

    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      return authorizationHeader.split(" ")[1];
    }
  }
}
