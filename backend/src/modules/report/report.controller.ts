import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UseAdmin } from '../../shared/guards/use-admin.decorator';
import { UseUser } from '../../shared/guards/use-user.decorator';
import { ReportCreateDto, ReportDto, ReportIdDto, ReportsDto, ReportUpdateDto } from './report.dto';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('Report')
@UseUser()
export class ReportController {

  public constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Report created successfully', type: ReportDto })
  @ApiOperation({ operationId: 'Create Report', summary: 'Create a price report' })
  public createReport(@Body() body: ReportCreateDto): Promise<ReportDto> {
    return this.reportService.createReport(body);
  }

  @Get()
  @ApiOkResponse({ description: 'Reports retrieved successfully', type: ReportsDto })
  @ApiOperation({ operationId: 'Read Reports', summary: 'Admin list of reports' })
  @UseAdmin()
  public async readReports(): Promise<ReportsDto> {
    const reports = await this.reportService.readReports();
    return { reports };
  }

  @Patch(':reportId')
  @ApiOkResponse({ description: 'Report updated successfully', type: ReportDto })
  @ApiOperation({ operationId: 'Update Report', summary: 'Resolve a report' })
  @UseAdmin()
  public updateReportById(
    @Param() param: ReportIdDto,
    @Body() body: ReportUpdateDto
  ): Promise<ReportDto> {
    return this.reportService.updateReportById(param.reportId, body);
  }

}
