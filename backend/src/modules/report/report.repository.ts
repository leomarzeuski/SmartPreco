  import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

  import { ReportCreateRepositoryDto, ReportRepositoryDto, ReportUpdateDto } from "./report.dto";

  @Injectable()
  export class ReportRepository {
    public constructor(private readonly supabase: SupabaseClient) {}

    public async createReport(params: ReportCreateRepositoryDto): Promise<ReportRepositoryDto> {
      const { data: report, error: reportError } = await this.supabase
        .from('reports')
        .insert({ ...params, resolved: false })
        .select()
        .single();

      if (reportError) throw new BadRequestException(reportError.message);

      return report;
    }

    public async readReports(): Promise<ReportRepositoryDto[]> {
      const { data, error } = await this.supabase.from('reports').select('*');
      if (error) throw new BadRequestException(error.message);
      return data;
    }

    public async readReportById(reportId: string): Promise<ReportRepositoryDto> {
      const { data, error } = await this.supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        throw new BadRequestException(`Failed to find report with ID ${reportId}: ${error.message}`);
      }

      return data;
    }

    public async updateReportById(reportId: string, dto: ReportUpdateDto): Promise<ReportRepositoryDto> {
      const { data, error } = await this.supabase
        .from('reports')
        .update(dto)
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw new BadRequestException(error.message);

      if (dto.resolved) {
        await this.supabase
          .from('prices')
          .update({ moderated: true })
          .eq('id', data.price_id);
      }

      return data;
    }
  }