import { IsBoolean } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { IsEnum, IsObject, IsString, IsUUID } from "class-validator";

import { UserIdDto, UserIdRepositoryDto } from "../../shared/user/user.dto";
import { PriceIdDto, PriceRepositoryIdDto } from "../price/price.dto";
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

export class ReportDto extends IntersectionType(
  PriceIdDto,
  UserIdDto
) {

  @IsUUID()
  @ApiProperty({
    description: "Report's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: "Report's reason",
    example: "Price is out of date",
  })
  public reason: string;

  @IsBoolean()
  @ApiProperty({
    description: "Report's resolved status",
    example: false,
  })
  public resolved: boolean;

}

export class ReportRepositoryDto extends IntersectionType(
  PriceRepositoryIdDto,
  UserIdRepositoryDto,
  PickType(ReportDto, [ "id", "reason", "resolved" ] as const),
) {}

export class ReportReadDto extends PickType(ReportDto, [ "resolved" ] as const) { }

export class ReportCreateDto extends IntersectionType(
  PickType(ReportDto, [ "priceId", "reason" ] as const),
) { }

export class ReportUpdateDto extends PickType(ReportDto, [ "resolved" ] as const) {

  @IsEnum(ReportStatusEnum)
  @ApiProperty({ enum: ReportStatusEnum })
  public status: ReportStatusEnum;

 }

export class ReportsDto {

  @IsObject({ each: true })
  public reports: ReportDto[];

}

export class ReportCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  PriceRepositoryIdDto,
  PickType(ReportCreateDto, [ "reason" ] as const)
) { }