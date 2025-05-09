/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../shared/context/context.enum';
import { ContextService } from '../../shared/context/context.service';
import { PriceService } from '../price/price.service';
import { ReportCreateDto, ReportDto, ReportsDto, ReportUpdateDto } from './report.dto';
import { ReportStatusEnum } from './report.enum';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {

  public constructor(
    private readonly reportRepository: ReportRepository,
    private readonly priceService: PriceService,
    private readonly contextService: ContextService
  ) {}

  public async createReport(params: ReportCreateDto): Promise<ReportDto> {
    const { priceId, reason } = params;

    const { id } = this.contextService.get(ContextEnum.USER);

    const report = await this.reportRepository.createReport({
      user_id: id,
      price_id: priceId,
      reason
    });

    await this.priceService.updateModeratedFlag(priceId, false);

    return this.toReportDto(report);
  }

  public async readReports(): Promise<ReportsDto> {
    const reports = await this.reportRepository.readReports();

    return { reports: reports.map(this.toReportDto) };
  }

  public async updateReportById(reportId: string, params: ReportUpdateDto): Promise<ReportDto> {
    const { status } = params;

    const updatedReport = await this.reportRepository.updateReportById(reportId, params);


    if (status === ReportStatusEnum.APPROVED) {
      const { price_id } = await this.reportRepository.readReportById(reportId);

      await this.priceService.updateModeratedFlag(price_id, true);
    }

    return this.toReportDto(updatedReport);
  }

  private toReportDto(report: any): ReportDto {
    return {
      id: report.id,
      priceId: report.price_id,
      reason: report.reason,
      resolved: report.resolved,
      userId: report.user_id,
    };
  }

}
