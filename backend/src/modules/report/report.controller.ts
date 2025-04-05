import { Body, Controller, Get, NotImplementedException, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReportCreateDto, ReportDto, ReportReadDto, ReportsDto, ReportUpdateDto } from './report.dto';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('Report')
export class ReportController {

  public constructor(private readonly reportService: ReportService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Report created successfully', type: ReportDto })
  @ApiOperation({
    operationId: "Create Report",
    summary: "Creates a new report."
  })
  public createReport(@Body() body: ReportCreateDto): ReportDto {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Get()
  @ApiOkResponse({ description: 'Reports retrieved successfully', type: ReportsDto })
  @ApiOperation({
    operationId: "Read Reports",
    summary: "Retrieves a list of reports."
  })
  public readReports(@Query() query: ReportReadDto): ReportsDto {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Patch(':reportId')
  @ApiOkResponse({ description: 'Report updated successfully', type: ReportDto })
  @ApiOperation({
    operationId: "Update Report",
    summary: "Updates a report by its ID."
  })
  public updateReportById(@Body() body: ReportUpdateDto): ReportDto {
    throw new NotImplementedException("Not implemented yet.");
  }

}
