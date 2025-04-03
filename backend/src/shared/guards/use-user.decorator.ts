import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { ClerkAuthGuard } from "./clerk-auth.guard";

/**
 * This decorator is used to apply the ClerkAuthGuard and StripeGuard to a route.
 * It adds the user and subscription value to the ContextModule and sincronizes the user subscription with Clerk.
 *
 * @returns {ClassDecorator & MethodDecorator} The decorator to apply ClerkAuthGuard and StripeGuard to a route.
 */
export function UseUser(): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiBearerAuth(), UseGuards(ClerkAuthGuard));
}
