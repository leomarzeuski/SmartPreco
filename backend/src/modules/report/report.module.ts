import { Module } from '@nestjs/common';

import { ReportController } from './report.controller';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';

@Module({
  controllers: [ ReportController ],
  providers: [ ReportService, ReportRepository ],
})
export class ReportModule {}
