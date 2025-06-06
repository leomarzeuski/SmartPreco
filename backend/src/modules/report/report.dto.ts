import { PriceDto, PriceIdDto, PriceRepositoryIdDto } from '@modules/price/price.dto';
import { ReportStatusEnum } from '@modules/report/report.enum';
import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { UserIdDto, UserIdRepositoryDto } from '@shared/user/user.dto';
import { PaginationReadDto, PaginationResponseDto } from '@shared/utils/pagination.dto';
import { TimestampDto, TimestampRepositoryDto } from '@shared/utils/timestamp.dto';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

// == ID DTOs ==

export class ReportIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the report",
    example: "b3c1d2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f",
  })
  public reportId: string;
}

export class ReportRepositoryIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the report in the repository layer",
    example: "b3c1d2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f",
  })
  public report_id: string;
}

// == Main DTO ==

export class ReportDto extends IntersectionType(
  UserIdDto,
  PickType(TimestampDto, [ 'updatedAt' ] as const)
) {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the report",
    example: "b3c1d2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f",
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: "Reason for reporting a price",
    example: "Preço incompatível com o mercado.",
  })
  public reason: string;

  @IsBoolean()
  @ApiProperty({
    description: "Indicates whether the report has been resolved",
    example: false,
  })
  public resolved: boolean;

  @ApiProperty({
    description: "Information about the price associated with the report",
    type: () => PriceDto,
  })
  public price: PriceDto;

  @IsOptional()
  @IsEnum(ReportStatusEnum)
  @ApiProperty({
    description: "Current status of the report",
    enum: ReportStatusEnum,
    example: ReportStatusEnum.APPROVED,
    required: false,
  })
  public status?: ReportStatusEnum;
}

// == Repository DTOs ==

export class ReportTimestampDto extends IntersectionType(
  ReportDto,
  TimestampRepositoryDto,
) {}

export class ReportRepositoryDto extends IntersectionType(
  PriceRepositoryIdDto,
  UserIdRepositoryDto,
  PickType(ReportDto, [ 'id', 'reason', 'resolved' ] as const),
) {}

// == Input DTOs ==

export class ReportReadDto extends IntersectionType(
  PaginationReadDto,
  PartialType(PickType(ReportDto, [ 'resolved' ] as const))
) {
  @ApiProperty({
    description: "Filter reports based on their resolution status",
    example: true,
    required: false,
  })
  public resolved?: boolean;
}

export class ReportCreateDto extends IntersectionType(
  PriceIdDto,
  PickType(ReportDto, [ 'reason' ] as const),
) {}

export class ReportUpdateDto extends PickType(ReportDto, [ 'status', 'resolved' ] as const) {}

// == Pagination DTOs ==

export class ReportsDto extends PaginationResponseDto<ReportDto> {
  @IsArray()
  @ApiProperty({
    description: 'List of reports returned in the current page',
    type: [ ReportDto ],
  })
  public records: ReportDto[];
}

export class ReportsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {
  @IsArray()
  @ApiProperty({
    description: 'List of reports with repository-formatted timestamps',
    isArray: true,
    type: [ ReportTimestampDto ],
  })
  public records: ReportTimestampDto[];
}

export class ReportCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  PriceRepositoryIdDto,
  PickType(ReportCreateDto, [ 'reason' ] as const),
) {}
