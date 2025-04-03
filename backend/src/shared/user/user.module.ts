import { Module } from "@nestjs/common";

import { ContextService } from "../../shared/context/context.service";
import { UserService } from "./user.service";

@Module({
  providers: [UserService, ContextService],
  exports: [UserService],
})
export class UserModule {}
