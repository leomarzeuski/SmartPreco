import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { UserIdDto, UserIdRepositoryDto } from "@shared/user/user.dto";
import {
  PaginationReadDto,
  PaginationResponseDto,
} from "@shared/utils/pagination.dto";
import {
  TimestampDto,
  TimestampRepositoryDto,
} from "@shared/utils/timestamp.dto";
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

// == Enums ==

export enum BenefitTypeEnum {
  VOUCHER = "VOUCHER",
  GIFT = "GIFT",
  DISCOUNT = "DISCOUNT",
  CASHBACK = "CASHBACK",
  FREEBIE = "FREEBIE",
}

export enum UserBenefitStatusEnum {
  ASSIGNED = "ASSIGNED",
  CLAIMED = "CLAIMED",
  CONSUMED = "CONSUMED",
}

// == ID DTOs ==

export class BenefitIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the benefit",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public benefitId: string;
}

export class BenefitRepositoryIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the benefit in the repository layer",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public benefit_id: string;
}

export class UserBenefitIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the user-benefit relationship",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public userBenefitId: string;
}

// == Main DTOs ==

export class BenefitDto extends IntersectionType(
  PickType(TimestampDto, [ "updatedAt" ] as const)
) {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the benefit",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public id: string;

  @IsUUID()
  @ApiProperty({
    description: "Market identifier this benefit belongs to",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public marketId: string;

  @IsEnum(BenefitTypeEnum)
  @ApiProperty({
    description: "Type of benefit",
    enum: BenefitTypeEnum,
    example: BenefitTypeEnum.VOUCHER,
  })
  public type: BenefitTypeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Name of the benefit",
    example: "10% Off on All Products",
  })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Detailed description of the benefit",
    example:
      "Get 10% discount on all products in our store. Valid until end of month.",
  })
  public description: string;

  @IsISO8601()
  @ApiProperty({
    description: "Date when the benefit becomes valid",
    example: "2024-01-01",
  })
  public validFrom: string;

  @IsISO8601()
  @ApiProperty({
    description: "Date when the benefit expires",
    example: "2024-01-31",
  })
  public validTo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "URL of the benefit image",
    example: "https://example.com/benefit-image.jpg",
    required: false,
  })
  public imageUrl?: string;
}

export class UserBenefitDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the user-benefit relationship",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public id: string;

  @IsUUID()
  @ApiProperty({
    description: "User identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public userId: string;

  @IsUUID()
  @ApiProperty({
    description: "Benefit identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public benefitId: string;

  @IsEnum(UserBenefitStatusEnum)
  @ApiProperty({
    description: "Status of the user benefit",
    enum: UserBenefitStatusEnum,
    example: UserBenefitStatusEnum.ASSIGNED,
  })
  public status: UserBenefitStatusEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Validation code for claiming/consuming the benefit",
    example: "AB12CD34",
    required: false,
  })
  public code?: string;

  @ApiProperty({
    description: "Date when the benefit was assigned",
    example: "2024-01-01T00:00:00.000Z",
    required: false,
  })
  public assignedAt?: Date;

  @ApiProperty({
    description: "Date when the benefit was claimed",
    example: "2024-01-01T12:00:00.000Z",
    required: false,
  })
  public claimedAt?: Date;

  @ApiProperty({
    description: "Date when the benefit was consumed",
    example: "2024-01-01T15:30:00.000Z",
    required: false,
  })
  public consumedAt?: Date;

  @ApiProperty({
    description: "Benefit details",
    type: BenefitDto,
  })
  public benefit?: BenefitDto;
}

// == Input DTOs ==

export class BenefitReadDto extends PaginationReadDto {
  @ApiProperty({
    description: "Search term to filter benefits by name or description",
    example: "discount",
    required: false,
  })
  public search?: string;

  @ApiProperty({
    description: "Filter by benefit type",
    enum: BenefitTypeEnum,
    required: false,
  })
  public type?: BenefitTypeEnum;

  @ApiProperty({
    description: "Filter by market ID",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
    required: false,
  })
  public marketId?: string;

  @ApiProperty({
    description: "Only show active benefits (within valid date range)",
    example: true,
    required: false,
  })
  public activeOnly?: boolean;
}

export class UserBenefitReadDto extends PaginationReadDto {
  @ApiProperty({
    description: "Filter by status",
    enum: UserBenefitStatusEnum,
    required: false,
  })
  public status?: UserBenefitStatusEnum;

  @ApiProperty({
    description: "Only show active and claimed benefits",
    example: true,
    required: false,
  })
  public activeAndClaimedOnly?: boolean;
}

export class BenefitCreateDto extends OmitType(BenefitDto, [
  "id",
  "updatedAt",
] as const) {}

export class BenefitUpdateDto extends PartialType(BenefitCreateDto) {}

export class BenefitAssignDto {
  @IsArray()
  @IsUUID("4", { each: true })
  @ApiProperty({
    description: "List of user IDs to assign the benefit to",
    example: [ "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d" ],
    isArray: true,
  })
  public userIds: string[];
}

export class UserBenefitClaimDto extends UserIdDto {}

export class UserBenefitConsumeDto extends PickType(UserBenefitDto, [ "code" ] as const) {}

// == Repository DTOs ==

export class BenefitTimestampDto extends IntersectionType(
  OmitType(BenefitDto, [
    "marketId",
    "validFrom",
    "validTo",
    "imageUrl",
    "updatedAt",
  ] as const),
  TimestampRepositoryDto
) {
  @IsUUID()
  @ApiProperty({
    description: "Market identifier in repository format",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public market_id: string;

  @ApiProperty({
    description: "Valid from date in repository format",
    example: "2024-01-01T00:00:00.000Z",
  })
  public valid_from: string;

  @ApiProperty({
    description: "Valid to date in repository format",
    example: "2024-01-31T23:59:59.000Z",
  })
  public valid_to: string;

  @ApiProperty({
    description: "Image URL in repository format",
    example: "https://example.com/benefit-image.jpg",
  })
  public image_url?: string;
}

export class BenefitCreateRepositoryDto extends IntersectionType(
  PickType(BenefitCreateDto, [ "name", "description", "type" ] as const)
) {
  @IsUUID()
  @ApiProperty({
    description: "Market identifier in repository format",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public market_id: string;

  @ApiProperty({
    description: "Valid from date in repository format",
    example: "2024-01-01T00:00:00.000Z",
  })
  public valid_from: string;

  @ApiProperty({
    description: "Valid to date in repository format",
    example: "2024-01-31T23:59:59.000Z",
  })
  public valid_to: string;

  @ApiProperty({
    description: "Image URL in repository format",
    example: "https://example.com/benefit-image.jpg",
  })
  public image_url?: string;
}

export class UserBenefitTimestampDto extends IntersectionType(
  OmitType(UserBenefitDto, [
    "userId",
    "benefitId",
    "assignedAt",
    "claimedAt",
    "consumedAt",
    "benefit",
  ] as const),
  UserIdRepositoryDto,
  BenefitRepositoryIdDto
) {
  @ApiProperty({
    description: "Date when the benefit was assigned in repository format",
    example: "2024-01-01T00:00:00.000Z",
  })
  public assigned_at?: Date;

  @ApiProperty({
    description: "Date when the benefit was claimed in repository format",
    example: "2024-01-01T12:00:00.000Z",
  })
  public claimed_at?: Date;

  @ApiProperty({
    description: "Date when the benefit was consumed in repository format",
    example: "2024-01-01T15:30:00.000Z",
  })
  public consumed_at?: Date;
}

export class UserBenefitCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  BenefitRepositoryIdDto
) {
  @IsEnum(UserBenefitStatusEnum)
  @ApiProperty({
    description: "Initial status of the user benefit",
    enum: UserBenefitStatusEnum,
    example: UserBenefitStatusEnum.ASSIGNED,
  })
  public status: UserBenefitStatusEnum;

  @ApiProperty({
    description: "Date when the benefit was assigned in repository format",
    example: "2024-01-01T00:00:00.000Z",
  })
  public assigned_at: Date;
}

// == Pagination DTOs ==

export class BenefitsDto extends PaginationResponseDto<BenefitDto> {
  @IsArray()
  @ApiProperty({
    description: "List of benefits returned in the current page",
    type: [ BenefitDto ],
  })
  public records: BenefitDto[];
}

export class BenefitsTimestampDto extends PickType(PaginationResponseDto, [
  "total",
] as const) {
  @IsArray()
  @ApiProperty({
    description:
      "List of benefits with timestamp fields formatted for the repository layer",
    isArray: true,
    type: [ BenefitTimestampDto ],
  })
  public records: BenefitTimestampDto[];
}

export class UserBenefitsDto extends PaginationResponseDto<UserBenefitDto> {
  @IsArray()
  @ApiProperty({
    description: "List of user benefits returned in the current page",
    type: [ UserBenefitDto ],
  })
  public records: UserBenefitDto[];
}

export class UserBenefitsTimestampDto extends PickType(PaginationResponseDto, [
  "total",
] as const) {
  @IsArray()
  @ApiProperty({
    description:
      "List of user benefits with timestamp fields formatted for the repository layer",
    isArray: true,
    type: [ UserBenefitTimestampDto ],
  })
  public records: UserBenefitTimestampDto[];
}

// == Response DTOs ==

export class BenefitClaimResponseDto {
  @IsString()
  @ApiProperty({
    description: "Validation code for the claimed benefit",
    example: "AB12CD34",
  })
  public code: string;

  @ApiProperty({
    description: "Date when the benefit was claimed",
    example: "2024-01-01T12:00:00.000Z",
  })
  public claimedAt: Date;
}

export class BenefitConsumeResponseDto {
  @ApiProperty({
    description: "Confirmation message",
    example: "Benefit consumed successfully",
  })
  public message: string;

  @ApiProperty({
    description: "Date when the benefit was consumed",
    example: "2024-01-01T15:30:00.000Z",
  })
  public consumedAt: Date;
}
