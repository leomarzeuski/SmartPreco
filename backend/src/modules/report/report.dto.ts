import { IsBoolean } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

import { UserIdDto, UserIdRepositoryDto } from "../../shared/user/user.dto";
import { PaginationReadDto, PaginationResponseDto } from "../../shared/utils/pagination.dto";
import { TimestampDto } from "../../shared/utils/timestamp.dto";
import { PriceDto, PriceIdDto, PriceRepositoryIdDto } from "../price/price.dto";
import { ReportStatusEnum } from "./report.enum";

export class ReportIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Report's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public reportId: string;

 }

 export class ReportRepositoryIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Report's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public report_id: string;

 }

export class ReportDto extends IntersectionType(UserIdDto) {
  @IsUUID()
  @ApiProperty()
  public id: string;

  @IsString()
  @ApiProperty()
  public reason: string;

  @IsBoolean()
  @ApiProperty()
  public resolved: boolean;

  @ApiProperty({ type: () => PriceDto })
  public price: PriceDto;

  @IsOptional()
  @IsEnum(ReportStatusEnum)
  @ApiProperty({ enum: ReportStatusEnum })
  public status?: ReportStatusEnum;
}

export class ReportTimestampDto extends IntersectionType(
  ReportDto,
  TimestampDto,
) {}

export class ReportRepositoryDto extends IntersectionType(
  PriceRepositoryIdDto,
  UserIdRepositoryDto,
  PickType(ReportDto, [ "id", "reason", "resolved" ] as const),
) {}

export class ReportReadDto extends IntersectionType(
  PaginationReadDto,
  PartialType(PickType(ReportDto, [ "resolved" ] as const))
) { }

export class ReportCreateDto extends IntersectionType(
  PriceIdDto,
  PickType(ReportDto, [ "reason" ] as const),
) { }

export class ReportUpdateDto extends PickType(ReportDto, [ "status", "resolved" ] as const) {}

export class ReportsDto extends PaginationResponseDto<ReportDto> {

   @ApiProperty({
      description: 'List of Market records',
      type: [ ReportDto ],
    })
    public records: ReportDto[];

 }

export class ReportsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {

  @IsArray()
  @ApiProperty({ description: 'List of records returned', isArray: true })
  public records: ReportTimestampDto[];

}

export class ReportCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  PriceRepositoryIdDto,
  PickType(ReportCreateDto, [ "reason" ] as const)
) { }