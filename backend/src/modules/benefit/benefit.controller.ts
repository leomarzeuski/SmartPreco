import {
  BenefitClaimResponseDto,
  BenefitConsumeResponseDto,
  BenefitCreateDto,
  BenefitDto,
  BenefitIdDto,
  BenefitReadDto,
  BenefitsDto,
  BenefitsResponseDto,
  BenefitUpdateDto,
  UserBenefitConsumeDto,
  UserBenefitReadDto,
  UserBenefitsDto
} from "@modules/benefit/benefit.dto";
import { BenefitService } from "@modules/benefit/benefit.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ContextEnum } from "@shared/context/context.enum";
import { ContextService } from "@shared/context/context.service";
import { UseAdmin } from "@shared/guards/use-admin.decorator";
import { UseUser } from "@shared/guards/use-user.decorator";

@Controller("benefits")
@ApiTags("Benefit")
@UseUser()
@ApiExtraModels(
  BenefitsDto,
  UserBenefitsDto
)
export class BenefitController {
  public constructor(
    private readonly benefitService: BenefitService,
    private readonly contextService: ContextService
  ) {}

  // === Benefits management (Admin only) ===

  @Post()
  @UseAdmin()
  @ApiCreatedResponse({
    description: "Benefit created successfully",
    type: BenefitDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: "Create Benefit",
    summary: "Creates a new benefit (Admin only)",
    description:
      "Only admins can create benefits. This endpoint creates a new benefit for a specific market.",
  })
  public createBenefit(@Body() body: BenefitCreateDto): Promise<BenefitDto> {
    return this.benefitService.createBenefit(body);
  }

  @Get()
  @ApiOkResponse({
    description: "Benefits retrieved successfully",
    type: BenefitsResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Read Benefits",
    summary: "Retrieves benefits",
    description:
      "If admin: returns all benefits. If user: returns user's assigned/claimed benefits.",
  })
  public async readBenefits(
    @Query() query: BenefitReadDto
  ): Promise<BenefitsResponseDto> {
    const user = this.contextService.get(ContextEnum.USER);
    const isAdmin = user?.privateMetadata?.isAdmin;

    let data: UserBenefitsDto | BenefitsDto;

    // TODO: Migrate logic to service
    if (isAdmin) {
      data = await this.benefitService.readBenefits(query);
    } else {
      const userBenefitQuery: UserBenefitReadDto = {
        ...query,
        activeAndClaimedOnly: true,
      };
      data = await this.benefitService.readUserBenefits(userBenefitQuery);
    }

    return { data };
  }

  @Get(":benefitId")
  @ApiOkResponse({
    description: "Benefit retrieved successfully",
    type: BenefitDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Read Benefit",
    summary: "Retrieves a benefit by its ID",
  })
  public readBenefitById(@Param() param: BenefitIdDto): Promise<BenefitDto> {
    const { benefitId } = param;
    return this.benefitService.readBenefitById(benefitId);
  }

  @Patch(":benefitId")
  @UseAdmin()
  @ApiOkResponse({
    description: "Benefit updated successfully",
    type: BenefitDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Update Benefit",
    summary: "Updates a benefit by its ID (Admin only)",
  })
  public updateBenefitById(
    @Param() param: BenefitIdDto,
    @Body() body: BenefitUpdateDto
  ): Promise<BenefitDto> {
    const { benefitId } = param;
    return this.benefitService.updateBenefitById(benefitId, body);
  }

  @Delete(":benefitId")
  @UseAdmin()
  @ApiNoContentResponse({ description: "Benefit deleted successfully" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: "Delete Benefit",
    summary: "Deletes a benefit by its ID (Admin only)",
  })
  public deleteBenefitById(@Param() param: BenefitIdDto): Promise<void> {
    const { benefitId } = param;
    return this.benefitService.deleteBenefitById(benefitId);
  }

  @Post(":benefitId/claim")
  @ApiOkResponse({
    description: "Benefit claimed successfully",
    type: BenefitClaimResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Claim Benefit",
    summary: "Claims a benefit for the current user",
    description:
      "User claims an assigned benefit and receives a validation code (8-char ULID).",
  })
  public claimBenefit(
    @Param() param: BenefitIdDto
  ): Promise<BenefitClaimResponseDto> {
    const { benefitId } = param;
    return this.benefitService.claimBenefit(benefitId);
  }

  // === Benefit consumption (Admin only) ===

  @Post("consume")
  @UseAdmin()
  @ApiOkResponse({
    description: "Benefit consumed successfully",
    type: BenefitConsumeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Consume Benefit",
    summary: "Consumes a claimed benefit (Admin only)",
    description:
      "Verifies benefit code and user ID, marks benefit as consumed.",
  })
  public consumeBenefit(
    @Body() body: UserBenefitConsumeDto
  ): Promise<BenefitConsumeResponseDto> {
    return this.benefitService.consumeBenefit(body);
  }
}
