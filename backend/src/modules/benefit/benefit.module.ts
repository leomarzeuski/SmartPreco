import { BenefitController } from "@modules/benefit/benefit.controller";
import { BenefitRepository } from "@modules/benefit/benefit.repository";
import { BenefitService } from "@modules/benefit/benefit.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [BenefitController],
  providers: [BenefitService, BenefitRepository],
  exports: [BenefitService, BenefitRepository],
})
export class BenefitModule {}
