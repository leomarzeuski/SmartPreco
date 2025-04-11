import { IsNotEmpty, IsObject, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";

import { ReadDto } from "../../shared/utils/read.dto";
import { TimestampDto } from "../../shared/utils/timestamp.dto";

export class ProductIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Product's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public productId: string;

}


export class ProductDto {

  @IsUUID()
  @ApiProperty({
    description: "Product's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  public id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Product's name",
    example: "Rice"
  })
  public name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Product's description",
    example: "This is a very good rice"
  })
  public description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Product's category",
    example: "Food"
  })
  public category: string;

}

export class ProductTimestampDto extends IntersectionType(
  ProductDto,
  TimestampDto
) {}

export class ProductReadDto extends IntersectionType(
  ReadDto,
  PartialType(PickType(ProductDto, [ "category" ] as const))
) { }

export class ProductCreateDto extends OmitType(ProductDto, [ "id" ] as const) {}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}

export class ProductsDto {

  @IsObject({ each: true })
  public products: ProductDto[];

}

