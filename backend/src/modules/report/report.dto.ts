import { IsBoolean } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { IsObject, IsString, IsUUID } from "class-validator";

import { PriceIdDto } from "../price/price.dto";

export class ReportIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Report's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public reportId: string;

 }

export class ReportDto extends ReportIdDto {

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

export class ReportReadDto extends PickType(ReportDto, [ "resolved" ] as const) { }

export class ReportCreateDto extends IntersectionType(
  PickType(ReportDto, [ "reason" ] as const),
   PriceIdDto
) { }

export class ReportUpdateDto extends PickType(ReportDto, [ "resolved" ] as const) { }

export class ReportsDto {

  @IsObject({ each: true })
  public reports: ReportDto[];

}