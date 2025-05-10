  import { Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { AppException, EntityEnum, ErrorEnum } from "../../shared/errors";
import { getSafeSearch } from "../../shared/utils/get-safe-search";
import { ReportCreateRepositoryDto, ReportReadDto, ReportRepositoryDto, ReportsTimestampDto, ReportUpdateDto } from "./report.dto";

  @Injectable()
  export class ReportRepository {

    private readonly tableName = EntityEnum.REPORTS;

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
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({ ...params, resolved: false })
        .select(this.selectFields)
        .single();

      if (reportError) throw new AppException(ErrorEnum.INSERT, error.message, this.tableName);

      return data;
    }

    public async readReports(params: ReportReadDto): Promise<ReportsTimestampDto> {
      const { search, limit = 20, offset = 0, orderBy, resolved } = params;

      let query = this.supabase
        .from(this.tableName)
        .select(this.selectFields, { count: 'exact' });

      if (resolved !== undefined) {
        query = query.eq('resolved', resolved);
      }

      if (search) {
        const safeSearch = getSafeSearch(search);

        query = query.ilike('reason', `%${safeSearch}%`);
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending: true });
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count: total } = await query;

      if (error) {
        throw new AppException(ErrorEnum.NOT_FOUND, error.message, this.tableName);
      }

      return {
        records: data,
        total: total ?? 0,
      };
    }

    public async updateReportById(reportId: string, dto: ReportUpdateDto): Promise<ReportRepositoryDto> {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(dto)
        .eq('id', reportId)
        .select(this.selectFields)
        .single();

      if (error) throw new AppException(ErrorEnum.UPDATE, error.message, this.tableName);

      return data;
    }
  }