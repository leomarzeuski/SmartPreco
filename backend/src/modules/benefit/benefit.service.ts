import {
  BenefitClaimResponseDto,
  BenefitConsumeResponseDto,
  BenefitCreateDto,
  BenefitDto,
  BenefitReadDto,
  BenefitsDto,
  BenefitTimestampDto,
  BenefitUpdateDto,
  UserBenefitConsumeDto,
  UserBenefitDto,
  UserBenefitReadDto,
  UserBenefitsDto,
  UserBenefitStatusEnum,
  UserBenefitTimestampDto,
} from "@modules/benefit/benefit.dto";
import { BenefitRepository } from "@modules/benefit/benefit.repository";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ContextEnum } from "@shared/context/context.enum";
import { ContextService } from "@shared/context/context.service";
import { ulid } from "ulid";

@Injectable()
export class BenefitService {
  public constructor(
    private readonly benefitRepository: BenefitRepository,
    private readonly contextService: ContextService
  ) {}

  // === Benefits operations ===

  public async createBenefit(params: BenefitCreateDto): Promise<BenefitDto> {
    const repositoryParams = {
      name: params.name,
      description: params.description,
      type: params.type,
      market_id: params.marketId,
      valid_from: params.validFrom,
      valid_to: params.validTo,
      image_url: params.imageUrl,
    };

    const benefit = await this.benefitRepository.createBenefit(repositoryParams);

    await this.assignBenefitToEligibleUsers(benefit.id);

    return this.benefitToDto(benefit);
  }

  public async readBenefits(params: BenefitReadDto): Promise<BenefitsDto> {
    const { records, total } = await this.benefitRepository.readBenefits(
      params
    );

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: records.map((record) => this.benefitToDto(record)),
      count: records.length,
      total,
      nextOffset: offset + limit < total ? offset + limit : null,
    };
  }

  public async readBenefitById(benefitId: string): Promise<BenefitDto> {
    const benefit = await this.benefitRepository.readBenefitById(benefitId);
    return this.benefitToDto(benefit);
  }

  public async updateBenefitById(
    benefitId: string,
    updateBenefitDto: BenefitUpdateDto
  ): Promise<BenefitDto> {
    const benefit = await this.benefitRepository.updateBenefitById(
      benefitId,
      updateBenefitDto
    );
    return this.benefitToDto(benefit);
  }

  public async deleteBenefitById(benefitId: string): Promise<void> {
    await this.benefitRepository.deleteBenefitById(benefitId);
  }

  public async assignBenefitToEligibleUsers(benefitId: string): Promise<void> {
    // 1. Verifica se o benefício existe
    const benefit = await this.benefitRepository.readBenefitById(benefitId);

    if (!benefit) {
      throw new NotFoundException(`Benefit ${benefitId} not found`);
    }

    // 2. Busca usuários elegíveis (price moderado nos últimos 7 dias para esse market_id)
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const eligibleUserIds: string[] = await this.benefitRepository.findEligibleUserIds(
      benefit.market_id,
      since
    );

    if (!eligibleUserIds.length) {
      return; // Ninguém elegível
    }

    // 3. Busca user_benefit já existentes para não duplicar
    const alreadyAssigned: string[] = await this.benefitRepository.findUserBenefitUserIdsForBenefit(
      benefitId,
      eligibleUserIds
    );

    // Filtra apenas quem ainda não tem o benefício
    const usersToAssign = eligibleUserIds.filter(
      (userId) => !alreadyAssigned.includes(userId)
    );

    if (!usersToAssign.length) {
      return; // Todos já têm
    }

    // 4. Cria os user_benefit no status ASSIGNED
    const now = new Date();
    const userBenefitsToCreate = usersToAssign.map((userId) => ({
      user_id: userId,
      benefit_id: benefitId,
      status: UserBenefitStatusEnum.ASSIGNED,
      assigned_at: now,
    }));

    await this.benefitRepository.bulkCreateUserBenefits(userBenefitsToCreate);

    //TODO: Enviar notificações Push/Email para os usuários

    return;
  }

  // === User-benefits operations ===

  public async readUserBenefits(
    params: UserBenefitReadDto
  ): Promise<UserBenefitsDto> {
    const user = this.contextService.get(ContextEnum.USER);
    const userId = user?.id;

    if (!userId) {
      throw new ForbiddenException("User not found in context");
    }

    const { records, total } = await this.benefitRepository.readUserBenefits(
      userId,
      params
    );

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: records.map((record) => this.userBenefitToDto(record)),
      count: records.length,
      total,
      nextOffset: offset + limit < total ? offset + limit : null,
    };
  }

  public async readAllUserBenefits(
    params: UserBenefitReadDto
  ): Promise<UserBenefitsDto> {
    // This method is for admin use - gets all user benefits across all users
    // We would need to modify the repository to support this, but for now let's keep it simple
    throw new Error(
      "Not implemented - would require admin-specific repository method"
    );
  }

  public async claimBenefit(
    benefitId: string
  ): Promise<BenefitClaimResponseDto> {
    const { id: userId } = this.contextService.get(ContextEnum.USER);

    // Find assigned benefit for this user
    const userBenefit =
      await this.benefitRepository.findUserBenefitByBenefitAndUser(
        userId,
        benefitId
      );

    if (!userBenefit) {
      throw new NotFoundException(
        "Benefit not assigned to this user or already claimed"
      );
    }

    if (userBenefit.status !== UserBenefitStatusEnum.ASSIGNED) {
      throw new BadRequestException(
        "Benefit has already been claimed or consumed"
      );
    }

    const benefit = await this.benefitRepository.readBenefitById(userBenefit.benefit_id);

    // Check if benefit is still valid
    const now = new Date();
    const validFrom = new Date(benefit?.valid_from);
    const validTo = new Date(benefit?.valid_to);

    if (now < validFrom || now > validTo) {
      throw new BadRequestException("Benefit is not currently valid");
    }

    // Generate 8-character ULID code
    const code = ulid().substring(0, 8);

    // Update status to claimed
    const updatedUserBenefit =
      await this.benefitRepository.updateUserBenefitStatus(
        userId,
        benefitId,
        UserBenefitStatusEnum.CLAIMED,
        code
      );

    return {
      code,
      claimedAt: updatedUserBenefit.claimed_at!,
    };
  }

  public async consumeBenefit(
    consumeDto: UserBenefitConsumeDto
  ): Promise<BenefitConsumeResponseDto> {
    const { code } = consumeDto;

    // Find user benefit by code
    const userBenefit = await this.benefitRepository.findUserBenefitByCode(
      code
    );

    if (!userBenefit) {
      throw new NotFoundException("Invalid benefit code");
    }

    if (userBenefit.status !== UserBenefitStatusEnum.CLAIMED) {
      throw new BadRequestException(
        "Benefit must be claimed before it can be consumed"
      );
    }

    const benefit = await this.benefitRepository.readBenefitById(
      userBenefit.benefit_id
    );

    // Check if benefit is still valid
    const now = new Date();
    const validTo = new Date(benefit?.valid_to || "");

    if (now > validTo) {
      throw new BadRequestException("Benefit has expired");
    }

    // Update status to consumed
    const updatedUserBenefit =
      await this.benefitRepository.updateUserBenefitStatus(
        userBenefit.user_id,
        benefit.id,
        UserBenefitStatusEnum.CONSUMED
      );

    return {
      message: "Benefit consumed successfully",
      consumedAt: updatedUserBenefit.consumed_at!,
    };
  }

  // === Private helper methods ===

  private benefitToDto(benefit: BenefitTimestampDto): BenefitDto {
    return {
      id: benefit.id,
      marketId: benefit.market_id,
      type: benefit.type,
      name: benefit.name,
      description: benefit.description,
      validFrom: benefit.valid_from,
      validTo: benefit.valid_to,
      imageUrl: benefit.image_url,
      updatedAt: benefit.updated_at,
    };
  }

  private userBenefitToDto(
    userBenefit: UserBenefitTimestampDto
  ): UserBenefitDto {
    const dto: UserBenefitDto = {
      id: userBenefit.id,
      userId: userBenefit.user_id,
      benefitId: userBenefit.benefit_id,
      status: userBenefit.status,
      code: userBenefit.code,
      assignedAt: userBenefit.assigned_at,
      claimedAt: userBenefit.claimed_at,
      consumedAt: userBenefit.consumed_at,
    };

    return dto;
  }

  // TODO: Implement SMS sending
  private async sendSmsNotifications(
    userIds: string[],
    benefitId: string
  ): Promise<void> {
    // This would integrate with your SMS service
    // For now, just a placeholder
    console.log(
      `Would send SMS to ${userIds.length} users about benefit ${benefitId}`
    );
  }
}
