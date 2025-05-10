import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaginationReadDto, PaginationResponseDto } from '@shared/utils/pagination.dto';
import { TimestampDto } from '@shared/utils/timestamp.dto';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';


export class ProductIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Product's unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public productId: string;

}

export class ProductRepositoryIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Product's repository unique identifier",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d"
  })
  // eslint-disable-next-line camelcase
  public product_id: string;

}

export class ProductDto {

  @IsUUID()
  @ApiProperty({ description: "Product's unique identifier" })
  public id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Product's name" })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Product's description" })
  public description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Product's category" })
  public category: string;

}

export class ProductTimestampDto extends IntersectionType(
  ProductDto,
  TimestampDto,
) {}

export class ProductReadDto extends PaginationReadDto {}

export class ProductCreateDto extends OmitType(ProductDto, [ 'id' ] as const) {}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}

export class ProductsDto extends PaginationResponseDto<ProductDto> {

   @ApiProperty({
      description: 'List of Market records',
      type: [ ProductDto ],
    })
    public records: ProductDto[];

 }

export class ProductsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {

  @IsArray()
  @ApiProperty({ description: 'List of records returned', isArray: true })
  public records: ProductTimestampDto[];

}