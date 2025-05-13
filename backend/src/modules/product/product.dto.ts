import { UploadImageDto, UploadImageRepositoryDto } from '@modules/upload/upload.dto';
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaginationReadDto, PaginationResponseDto } from '@shared/utils/pagination.dto';
import { TimestampDto, TimestampRepositoryDto } from '@shared/utils/timestamp.dto';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// == ID DTOs ==

export class ProductIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the product",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public productId: string;
}

export class ProductRepositoryIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the product in the repository layer",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public product_id: string;
}

// == Main DTO ==

export class ProductDto extends IntersectionType(
  PickType(TimestampDto, [ 'updatedAt' ] as const),
  PartialType(UploadImageDto)
) {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the product",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
  })
  public id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Name of the product",
    example: "Arroz Integral 5kg",
  })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Detailed description of the product",
    example: "Arroz integral tipo 1, embalagem de 5kg, rico em fibras.",
  })
  public description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Category to which the product belongs",
    example: "Alimentos",
  })
  public category: string;

  @ApiProperty({
    description: "Lowest available moderated price for the product",
    example: 15.99,
    required: false,
  })
  public lowestPrice?: number;
}

// == Repository DTOs ==

export class ProductTimestampDto extends IntersectionType(
  OmitType(ProductDto, [ 'imageUrl', 'updatedAt' ] as const),
  UploadImageRepositoryDto,
  TimestampRepositoryDto,
) {}

// == Input DTOs ==

export class ProductReadDto extends PaginationReadDto {
  @ApiProperty({
    description: "Search term to filter products by name or description",
    example: "arroz",
    required: false,
  })
  public search?: string;

  @ApiProperty({
    description: "Maximum number of products to return",
    example: 20,
    required: false,
  })
  public limit?: number;

  @ApiProperty({
    description: "Number of products to skip for pagination",
    example: 0,
    required: false,
  })
  public offset?: number;

  @ApiProperty({
    description: "Field to order the products by",
    example: "name",
    required: false,
  })
  public orderBy?: string;
}

export class ProductCreateDto extends OmitType(ProductDto, [ 'id' ] as const) {}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}

// == Pagination DTOs ==

export class ProductsDto extends PaginationResponseDto<ProductDto> {
  @IsArray()
  @ApiProperty({
    description: 'List of products returned in the current page',
    type: [ ProductDto ],
  })
  public records: ProductDto[];
}

export class ProductsTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {
  @IsArray()
  @ApiProperty({
    description: 'List of products with timestamp fields formatted for the repository layer',
    isArray: true,
    type: [ ProductTimestampDto ],
  })
  public records: ProductTimestampDto[];
}
