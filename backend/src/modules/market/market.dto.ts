import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { IsObject, IsUUID } from "class-validator";

import { ReadDto } from "../../shared/utils/read.dto";

export class MarketIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Market's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public marketId: string;

}

export class MarketDto extends MarketIdDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Market's name",
    example: "Carrefour",
  })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Market's address",
    example: "Av. Brasil, 123",
  })
  public address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Market's city",
    example: "São Paulo",
  })
  public city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Market's state",
    example: "SP",
  })
  public state: string;

}

export class MarketReadDto extends IntersectionType(
  ReadDto,
  PartialType(PickType(MarketDto, [ "city" ] as const)),
) {}

export class MarketCreateDto extends OmitType(MarketDto, [ "marketId" ] as const) {}

export class MarketUpdateDto extends PartialType(MarketCreateDto) {}

export class MarketsDto {

  @IsObject({ each: true })
  public markets: MarketDto[];

}