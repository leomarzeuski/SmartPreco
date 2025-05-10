/* eslint-disable camelcase */
import { ReportCreateDto, ReportDto, ReportReadDto, ReportsDto, ReportUpdateDto } from '@modules/report/report.dto';
import { ReportStatusEnum } from '@modules/report/report.enum';
import { ReportRepository } from '@modules/report/report.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContextEnum } from '@shared/context/context.enum';
import { ContextService } from '@shared/context/context.service';
import { EventEnum } from '@shared/events/event.enum';
import { DtoMapper } from '@shared/utils/dto-mapper';

@Injectable()
export class ReportService {

  public constructor(
    private readonly reportRepository: ReportRepository,
    private readonly contextService: ContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createReport(params: ReportCreateDto): Promise<ReportDto> {
    const { priceId, reason } = params;

    const { id } = this.contextService.get(ContextEnum.USER);

    const report = await this.reportRepository.createReport({
      user_id: id,
      price_id: priceId,
      reason
    });

    this.eventEmitter.emit(EventEnum.REPORT_CREATED, priceId);

    return DtoMapper.mapOne(report, this.toDto);
  }

  public async readReports(params: ReportReadDto): Promise<ReportsDto> {
    const { records, total } = await this.reportRepository.readReports(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: DtoMapper.mapMany(records, this.toDto),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  public async updateReportById(reportId: string, params: ReportUpdateDto): Promise<ReportDto> {
    const { status } = params;

    const updatedReport = await this.reportRepository.updateReportById(reportId, params);

    if (status === ReportStatusEnum.APPROVED) {
      this.eventEmitter.emit(EventEnum.REPORT_RESOLVED, updatedReport.price_id);
    }

    return DtoMapper.mapOne(updatedReport, this.toDto);
  }

  private toDto(report: any): ReportDto {
    const price = report.prices;

    return {
      id: report.id,
      reason: report.reason,
      resolved: report.resolved,
      userId: report.user_id,
      status: report.status,
      price: {
        id: price.id,
        price: price.price,
        imageUrl: price.image_url,
        moderated: price.moderated,
        userId: price.user_id,
        product: {
          id: price.product.id,
          name: price.product.name,
          category: price.product.category,
          description: price.product.description,
        },
        market: {
          id: price.market.id,
          name: price.market.name,
          city: price.market.city,
          state: price.market.state,
          address: price.market.address,
        },
      },
    };
  }

}
