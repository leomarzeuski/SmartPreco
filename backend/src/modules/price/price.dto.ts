import { ApiProperty, IntersectionType, OmitType, PartialType } from "@nestjs/swagger";
import { IsNumber, IsObject, IsUUID } from "class-validator";

import { MarketIdDto } from "../market/market.dto";
import { ProductIdDto } from "../product/product.dto";
import { UploadImageDto } from "../upload/upload.dto";

export class PriceIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Price's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public priceId: string;

}

export class PriceDto extends IntersectionType(PriceIdDto, ProductIdDto, MarketIdDto, UploadImageDto) {

  @IsNumber()
  @ApiProperty({
    description: "Product's price",
    example: 10.99,
  })
  public price: number;

}


export class PriceReadDto extends PartialType(IntersectionType(ProductIdDto, MarketIdDto)) { }

export class PriceCreateDto extends OmitType(PriceDto, [ "priceId" ] as const) { }

export class PricesDto {

  @IsObject({ each: true })
  public prices: PriceDto[];

}