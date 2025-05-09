  import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

  import { ReportCreateRepositoryDto, ReportRepositoryDto, ReportUpdateDto } from "./report.dto";

  @Injectable()
  export class ReportRepository {
    private readonly selectFields = `
      *,
      prices (
        *,
        product:products (*),
        market:markets (*)
      )
    `;

    public constructor(private readonly supabase: SupabaseClient) {}

    public async createReport(params: ReportCreateRepositoryDto): Promise<ReportRepositoryDto> {
      const { data: report, error: reportError } = await this.supabase
        .from('reports')
        .insert({ ...params, resolved: false })
        .select(this.selectFields)
        .single();

      if (reportError) throw new BadRequestException(reportError.message);

      return report;
    }

    public async readReports(): Promise<any[]> {
      const { data, error } = await this.supabase
        .from('reports')
        .select(this.selectFields);

      if (error) throw new BadRequestException(error.message);
      return data;
    }

    public async readReportById(reportId: string): Promise<any> {
      const { data, error } = await this.supabase
        .from('reports')
        .select(this.selectFields)
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
        .select(this.selectFields)
        .single();

      if (error) throw new BadRequestException(error.message);

      return data;
    }
  }