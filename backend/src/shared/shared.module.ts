import { Module } from "@nestjs/common";

import { ContextModule } from "./context/context.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [ContextModule, UserModule],
  exports: [ContextModule, UserModule],
})
export class SharedModule {}
