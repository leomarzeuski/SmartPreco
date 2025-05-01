import { Injectable } from '@nestjs/common';

import { ReportCreateDto, ReportDto, ReportUpdateDto } from './report.dto';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {

  public constructor(private readonly reportRepository: ReportRepository) {}

  public createReport(dto: ReportCreateDto): Promise<ReportDto> {
    return this.reportRepository.createReport(dto);
  }

  public readReports(): Promise<ReportDto[]> {
    return this.reportRepository.readReports();
  }

  public updateReportById(reportId: string, dto: ReportUpdateDto): Promise<ReportDto> {
    return this.reportRepository.updateReportById(reportId, dto);
  }

}
