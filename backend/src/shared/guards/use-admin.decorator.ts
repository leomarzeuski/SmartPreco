import { applyDecorators, UseGuards } from "@nestjs/common";

import { AdminGuard } from "./admin.guard";

export function UseAdmin(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(AdminGuard));
}