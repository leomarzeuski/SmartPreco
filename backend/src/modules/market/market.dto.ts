import { UploadImageDto, UploadImageRepositoryDto } from '@modules/upload/upload.dto';
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaginationReadDto, PaginationResponseDto } from '@shared/utils/pagination.dto';
import { TimestampDto, TimestampRepositoryDto } from '@shared/utils/timestamp.dto';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// == ID DTOs ==

export class MarketIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the market",
    example: "5e7d1d6d-9f5b-4e2a-9c5b-1d6f3d5e9f5b",
  })
  public marketId: string;
}

export class MarketRepositoryIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the market in the repository layer",
    example: "5e7d1d6d-9f5b-4e2a-9c5b-1d6f3d5e9f5b",
  })
  public market_id: string;
}

// == Main DTO ==

export class MarketDto extends IntersectionType(
  PickType(TimestampDto, [ 'updatedAt' ] as const),
  PartialType(UploadImageDto)
) {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the market",
    example: "5e7d1d6d-9f5b-4e2a-9c5b-1d6f3d5e9f5b",
  })
  public id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Name of the market",
    example: "Carrefour Express",
  })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Street address of the market",
    example: "Av. Paulista, 1578",
  })
  public address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "City where the market is located",
    example: "São Paulo",
  })
  public city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "State where the market is located",
    example: "SP",
  })
  public state: string;
}

// == Repository DTOs ==

export class MarketTimestampDto extends IntersectionType(
  OmitType(MarketDto, [ 'imageUrl', 'updatedAt' ] as const),
  UploadImageRepositoryDto,
  TimestampRepositoryDto,
) {}

// == Input DTOs ==

export class MarketReadDto extends PaginationReadDto {
  @ApiProperty({
    description: "Search term to filter markets by name or address",
    example: "Carrefour",
    required: false,
  })
  public search?: string;

  @ApiProperty({
    description: "Maximum number of markets to return",
    example: 20,
    required: false,
  })
  public limit?: number;

  @ApiProperty({
    description: "Number of markets to skip for pagination",
    example: 0,
    required: false,
  })
  public offset?: number;

  @ApiProperty({
    description: "Field to order the markets by",
    example: "name",
    required: false,
  })
  public orderBy?: string;
}

export class MarketCreateDto extends OmitType(MarketDto, [ 'id', 'updatedAt' ] as const) {}

export class MarketUpdateDto extends PartialType(MarketCreateDto) {}

// == Repository DTOs ==

export class MarketCreateRepositoryDto extends IntersectionType(
  PickType(MarketCreateDto, [ 'name', 'address', 'city', 'state' ] as const),
  UploadImageRepositoryDto,
) {}

export class MarketUpdateRepositoryDto extends IntersectionType(
  PartialType(PickType(MarketCreateDto, [ 'name', 'address', 'city', 'state' ] as const)),
  PartialType(UploadImageRepositoryDto),
) {}

// == Pagination DTOs ==

export class MarketsDto extends PaginationResponseDto<MarketDto> {
  @IsArray()
  @ApiProperty({
    description: 'List of markets returned in the current page',
    type: [ MarketDto ],
  })
  public records: MarketDto[];
}

export class MarketsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {
  @IsArray()
  @ApiProperty({
    description: 'List of markets with timestamp fields formatted for the repository layer',
    isArray: true,
    type: [ MarketTimestampDto ],
  })
  public records: MarketTimestampDto[];
}
