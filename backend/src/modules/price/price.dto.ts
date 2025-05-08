import { ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsObject, IsUUID } from "class-validator";

import { UserIdDto, UserIdRepositoryDto } from "../../shared/user/user.dto";
import { TimestampDto } from "../../shared/utils/timestamp.dto";
import { MarketDto, MarketIdDto, MarketRepositoryIdDto } from "../market/market.dto";
import { ProductDto, ProductIdDto, ProductRepositoryIdDto } from "../product/product.dto";
import { UploadImageDto, UploadImageRepositoryDto } from "../upload/upload.dto";

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

export class PriceReadDto extends PartialType(IntersectionType(ProductIdDto, MarketIdDto)) {}

export class PriceReadRepositoryDto extends IntersectionType(
  PriceReadDto,
  PartialType(PickType(PriceDto, [ 'moderated' ] as const))
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

export class PricesDto {
  @IsObject({ each: true })
  public prices: PriceDto[];
}