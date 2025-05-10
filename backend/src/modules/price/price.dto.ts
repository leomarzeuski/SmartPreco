import { MarketDto, MarketIdDto, MarketRepositoryIdDto } from "@modules/market/market.dto";
import { ProductDto, ProductIdDto, ProductRepositoryIdDto } from "@modules/product/product.dto";
import { UploadImageDto, UploadImageRepositoryDto } from "@modules/upload/upload.dto";
import { ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { UserIdDto, UserIdRepositoryDto } from "@shared/user/user.dto";
import { PaginationReadDto, PaginationResponseDto } from "@shared/utils/pagination.dto";
import { TimestampDto } from "@shared/utils/timestamp.dto";
import { IsArray, IsBoolean, IsNumber, IsObject, IsUUID } from "class-validator";


export class PriceIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Price's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public priceId: string;
}

export class PriceRepositoryIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Price's repository unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  // eslint-disable-next-line camelcase
  public price_id: string;

}

export class PriceDto extends IntersectionType(UploadImageDto, UserIdDto) {
  @IsUUID()
  @ApiProperty({
    description: "Price's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public id: string;

  @IsNumber()
  @ApiProperty({
    description: "Product's price",
    example: 10.99,
  })
  public price: number;

  @IsBoolean()
  @ApiProperty({
    description: "Whether the price is currently moderated (approved for public view)",
    example: true,
  })
  public moderated: boolean;

  @IsObject()
  public product: ProductDto;

  @IsObject()
  public market: MarketDto;
}

export class PriceCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  ProductRepositoryIdDto,
  MarketRepositoryIdDto,
  UploadImageRepositoryDto,
  PickType(PriceDto, [ "price", "moderated" ] as const)
) {}

export class PriceTimestampDto extends IntersectionType(PriceDto, TimestampDto) {}

export class PriceReadDto extends IntersectionType(
  PaginationReadDto,
  PartialType(ProductIdDto),
  PartialType(MarketIdDto),
) {}

export class PriceCreateDto extends IntersectionType(
  ProductIdDto,
  MarketIdDto,
  UploadImageDto,
  PickType(PriceDto, [ "price" ] as const)
) {}

export class PriceUpdateDto extends PartialType(IntersectionType(
  PriceCreateDto,
  PickType(PriceDto, [ 'moderated' ] as const)
)) {}

export class PricesDto extends PaginationResponseDto<PriceDto> {

   @ApiProperty({
      description: 'List of Price records',
      type: [ PriceDto ],
    })
    public records: PriceDto[];

 }

export class PricesTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {

  @IsArray()
  @ApiProperty({ description: 'List of records returned', isArray: true })
  public records: PriceTimestampDto[];

}