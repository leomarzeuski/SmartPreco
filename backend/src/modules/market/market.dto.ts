import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

import { TimestampDto } from "../..//shared/utils/timestamp.dto";
import { PaginationReadDto, PaginationResponseDto } from "../../shared/utils/pagination.dto";

export class MarketIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Market's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public marketId: string;

}

export class MarketRepositoryIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Market's repository unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  // eslint-disable-next-line camelcase
  public market_id: string;

}

export class MarketDto  {

  @IsUUID()
  @ApiProperty({
    description: "Market's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public id: string;

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

export class MarketTimestampDto extends IntersectionType(
  MarketDto,
  TimestampDto,
) {}

export class MarketReadDto extends PaginationReadDto {}

export class MarketCreateDto extends OmitType(MarketDto, [ "id" ] as const) {}

export class MarketUpdateDto extends PartialType(MarketCreateDto) {}

export class MarketsDto extends PaginationResponseDto<MarketDto> {

   @ApiProperty({
      description: 'List of Market records',
      type: [ MarketDto ],
    })
    public records: MarketDto[];

 }

export class MarketsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {

  @IsArray()
  @ApiProperty({ description: 'List of records returned', isArray: true })
  public records: MarketTimestampDto[];

 }