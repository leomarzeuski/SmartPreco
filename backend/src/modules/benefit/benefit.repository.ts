import {
  BenefitCreateRepositoryDto,
  BenefitReadDto,
  BenefitTimestampDto,
  BenefitUpdateDto,
  BenefitsTimestampDto,
  UserBenefitCreateRepositoryDto,
  UserBenefitReadDto,
  UserBenefitStatusEnum,
  UserBenefitTimestampDto,
  UserBenefitsTimestampDto,
} from "@modules/benefit/benefit.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException, EntityEnum, ErrorEnum } from "@shared/errors";
import { getSafeSearch } from "@shared/utils/get-safe-search";
import { SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class BenefitRepository {
  private readonly benefitsTableName = EntityEnum.BENEFITS;
  private readonly userBenefitsTableName = EntityEnum.USER_BENEFITS;

  public constructor(private readonly supabase: SupabaseClient) {}

  // === Benefits operations ===

  public async createBenefit(
    params: BenefitCreateRepositoryDto
  ): Promise<BenefitTimestampDto> {
    console.log("createBenefit", params);

    const { data, error } = await this.supabase
      .from(this.benefitsTableName)
      .insert(params)
      .select()
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.INSERT,
        error.message,
        this.benefitsTableName
      );
    }

    return data;
  }

  public async readBenefits(
    params: BenefitReadDto
  ): Promise<BenefitsTimestampDto> {
    const {
      search,
      type,
      marketId,
      activeOnly,
      limit = 20,
      offset = 0,
      orderBy,
    } = params;

    let query = this.supabase
      .from(this.benefitsTableName)
      .select("*", { count: "exact" });

    if (search) {
      const safeSearch = getSafeSearch(search);
      query = query.or(
        `name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
      );
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (marketId) {
      query = query.eq("market_id", marketId);
    }

    if (activeOnly) {
      const now = new Date().toISOString();
      query = query.lte("valid_from", now).gte("valid_to", now);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error)
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.benefitsTableName
      );

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async readBenefitById(
    benefitId: string
  ): Promise<BenefitTimestampDto> {
    const { data, error } = await this.supabase
      .from(this.benefitsTableName)
      .select("*")
      .eq("id", benefitId)
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.benefitsTableName,
        HttpStatus.NOT_FOUND
      );
    }

    return data;
  }

  public async updateBenefitById(
    benefitId: string,
    updateBenefitDto: BenefitUpdateDto
  ): Promise<BenefitTimestampDto> {
    // Convert camelCase to snake_case for repository layer
    const repositoryDto = {
      ...updateBenefitDto,
      market_id: updateBenefitDto.marketId,
      valid_from: updateBenefitDto.validFrom,
      valid_to: updateBenefitDto.validTo,
      image_url: updateBenefitDto.imageUrl,
    };

    // Remove undefined properties and camelCase versions
    const { marketId, validFrom, validTo, imageUrl, ...cleanDto } =
      repositoryDto;

    const { data, error } = await this.supabase
      .from(this.benefitsTableName)
      .update(cleanDto)
      .eq("id", benefitId)
      .select()
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.UPDATE,
        error.message,
        this.benefitsTableName
      );
    }

    return data;
  }

  public async deleteBenefitById(benefitId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.benefitsTableName)
      .delete()
      .eq("id", benefitId);

    if (error) {
      throw new AppException(
        ErrorEnum.DELETE,
        error.message,
        this.benefitsTableName
      );
    }
  }

  public async existsBenefitById(benefitId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from(this.benefitsTableName)
      .select("id")
      .eq("id", benefitId)
      .maybeSingle();

    return !!data;
  }

  // === User-benefits operations ===

  public async createUserBenefit(
    params: UserBenefitCreateRepositoryDto
  ): Promise<UserBenefitTimestampDto> {
    console.log("createUserBenefit", params);

    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .insert(params)
      .select()
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.INSERT,
        error.message,
        this.userBenefitsTableName
      );
    }

    return data;
  }

  public async readUserBenefits(
    userId: string,
    params: UserBenefitReadDto
  ): Promise<UserBenefitsTimestampDto> {
    const {
      status,
      activeAndClaimedOnly,
      limit = 20,
      offset = 0,
      orderBy,
    } = params;

    let query = this.supabase
      .from(this.userBenefitsTableName)
      .select(
        `
        *,
        benefits:benefit_id (
          id,
          market_id,
          type,
          name,
          description,
          valid_from,
          valid_to,
          image_url,
          created_at,
          updated_at
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    if (activeAndClaimedOnly) {
      query = query.in("status", [
        UserBenefitStatusEnum.CLAIMED,
        UserBenefitStatusEnum.ASSIGNED,
      ]);

      // Only show benefits that are currently valid
      const now = new Date().toISOString();
      query = query
        .lte("benefits.valid_from", now)
        .gte("benefits.valid_to", now);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    } else {
      query = query.order("assigned_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error)
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.userBenefitsTableName
      );

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async readUserBenefitById(
    userId: string,
    userBenefitId: string
  ): Promise<UserBenefitTimestampDto> {
    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .select(
        `
        *,
        benefits:benefit_id (
          id,
          market_id,
          type,
          name,
          description,
          valid_from,
          valid_to,
          image_url,
          created_at,
          updated_at
        )
      `
      )
      .eq("id", userBenefitId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.userBenefitsTableName,
        HttpStatus.NOT_FOUND
      );
    }

    return data;
  }

  public async findUserBenefitByBenefitAndUser(
    userId: string,
    benefitId: string
  ): Promise<UserBenefitTimestampDto | null> {
    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .select("*")
      .eq("user_id", userId)
      .eq("benefit_id", benefitId)
      .eq("status", UserBenefitStatusEnum.ASSIGNED)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.userBenefitsTableName
      );
    }

    return data;
  }

  public async findUserBenefitByCode(
    code: string
  ): Promise<UserBenefitTimestampDto | null> {
    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .select(
        `
        *,
        benefits:benefit_id (
          id,
          market_id,
          type,
          name,
          description,
          valid_from,
          valid_to,
          image_url,
          created_at,
          updated_at
        )
      `
      )
      .eq("code", code)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.userBenefitsTableName
      );
    }

    return data;
  }

  public async updateUserBenefitStatus(
    userId: string,
    benefitId: string,
    status: UserBenefitStatusEnum,
    code?: string
  ): Promise<UserBenefitTimestampDto> {
    const now = new Date();
    const updateData: any = { status };

    // Set the appropriate timestamp based on status
    switch (status) {
      case UserBenefitStatusEnum.CLAIMED:
        updateData.claimed_at = now;
        updateData.code = code;
        break;
      case UserBenefitStatusEnum.CONSUMED:
        updateData.consumed_at = now;
        break;
    }

    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .update(updateData)
      .eq("user_id", userId)
      .eq("benefit_id", benefitId)
      .select()
      .single();

    if (error) {
      throw new AppException(
        ErrorEnum.UPDATE,
        error.message,
        this.userBenefitsTableName
      );
    }

    return data;
  }

  public async existsUserBenefit(
    userId: string,
    benefitId: string
  ): Promise<boolean> {
    const { data } = await this.supabase
      .from(this.userBenefitsTableName)
      .select("id")
      .eq("user_id", userId)
      .eq("benefit_id", benefitId)
      .maybeSingle();

    return !!data;
  }

  public async bulkCreateUserBenefits(
    userBenefits: UserBenefitCreateRepositoryDto[]
  ): Promise<UserBenefitTimestampDto[]> {
    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .insert(userBenefits)
      .select();

    if (error) {
      throw new AppException(
        ErrorEnum.INSERT,
        error.message,
        this.userBenefitsTableName
      );
    }

    return data;
  }

  public async findEligibleUserIds(marketId: string, since: Date): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("prices")
      .select("user_id", { count: "exact", head: false })
      .eq("market_id", marketId)
      .eq("moderated", true)
      .gte("created_at", since.toISOString());

    if (error) {
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        EntityEnum.PRICES
      );
    }

    const userIdSet = new Set<string>();
    (data ?? []).forEach(row => userIdSet.add(row.user_id));
    return Array.from(userIdSet);
  }

  public async findUserBenefitUserIdsForBenefit(benefitId: string, userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];

    const { data, error } = await this.supabase
      .from(this.userBenefitsTableName)
      .select("user_id")
      .eq("benefit_id", benefitId)
      .in("user_id", userIds);

    if (error) {
      throw new AppException(
        ErrorEnum.NOT_FOUND,
        error.message,
        this.userBenefitsTableName
      );
    }

    return (data ?? []).map(row => row.user_id);
  }
}
