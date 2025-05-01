import { Module } from '@nestjs/common';

import { PriceModule } from '../price/price.module';
import { ReportController } from './report.controller';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';

@Module({
  imports: [ PriceModule ],
  controllers: [ ReportController ],
  providers: [ ReportService, ReportRepository ],
})
export class ReportModule {}
